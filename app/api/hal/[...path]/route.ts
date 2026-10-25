import { NextRequest, NextResponse } from "next/server"
import {
  configured,
  createSession,
  equalSecret,
  sessionCookie,
  sessionSeconds,
  validSession,
} from "../../../../lib/hal-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" }
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers })
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/hal",
}
type Context = { params: { path: string[] } }

export async function POST(request: NextRequest, { params }: Context) {
  if (!configured()) return json({ error: "Dashboard access is not configured." }, 503)
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return json({ error: "Invalid origin." }, 403)
  const action = params.path.join("/")
  if (action === "logout") {
    const response = json({ ok: true })
    response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 })
    return response
  }
  if (action !== "login") return json({ error: "Not found." }, 404)
  if (Number(request.headers.get("content-length") || 0) > 4096)
    return json({ error: "Request too large." }, 413)
  try {
    const text = await request.text()
    if (text.length > 4096) return json({ error: "Request too large." }, 413)
    const { password } = JSON.parse(text)
    if (
      typeof password !== "string" ||
      !equalSecret(password, process.env.HAL_DASHBOARD_PASSWORD!)
    ) {
      return json({ error: "Incorrect password." }, 401)
    }
    const response = json({ ok: true })
    response.cookies.set(sessionCookie, createSession(), {
      ...cookieOptions,
      maxAge: sessionSeconds,
    })
    return response
  } catch {
    return json({ error: "Invalid request." }, 400)
  }
}

export async function GET(request: NextRequest, { params }: Context) {
  if (!configured()) return json({ error: "Dashboard access is not configured." }, 503)
  if (!validSession(request.cookies.get(sessionCookie)?.value))
    return json({ error: "Sign in to view reviews." }, 401)
  const path = params.path.join("/")
  if (!/^runs(?:\/[a-zA-Z0-9-]{1,80})?$/.test(path)) return json({ error: "Not found." }, 404)
  try {
    const base = new URL(process.env.HAL_AUDIT_URL!)
    if (base.protocol !== "https:" || base.username || base.password || base.pathname !== "/") {
      return json({ error: "Invalid audit configuration." }, 503)
    }
    const url = new URL(`/api/audit/${path}`, base)
    url.search = request.nextUrl.search
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    try {
      const upstream = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.HAL_AUDIT_TOKEN}` },
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
      })
      if (upstream.status === 401 || upstream.status >= 500)
        return json({ error: "Audit service unavailable. Try again shortly." }, 502)
      if (![200, 400, 404].includes(upstream.status))
        return json({ error: "Audit service unavailable." }, 502)
      return json(await upstream.json(), upstream.status)
    } finally {
      clearTimeout(timeout)
    }
  } catch {
    return json({ error: "Could not reach the audit service. Try again shortly." }, 502)
  }
}
