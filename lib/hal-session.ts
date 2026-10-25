import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export const sessionCookie = "hal_session"
export const sessionSeconds = 8 * 60 * 60

export function equalSecret(a: string, b: string) {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest()
  )
}

export function configured() {
  return Boolean(
    (process.env.HAL_DASHBOARD_PASSWORD?.length || 0) >= 16 &&
      (process.env.HAL_SESSION_SECRET?.length || 0) >= 32 &&
      (process.env.HAL_AUDIT_TOKEN?.length || 0) >= 32 &&
      process.env.HAL_AUDIT_URL
  )
}

export function createSession(now = Date.now()) {
  const expires = String(Math.floor(now / 1000) + sessionSeconds)
  const signature = createHmac("sha256", process.env.HAL_SESSION_SECRET!)
    .update(expires)
    .digest("hex")
  return `${expires}.${signature}`
}

export function validSession(value: string | undefined, now = Date.now()) {
  if (!configured() || !value || !/^\d{10}\.[a-f0-9]{64}$/.test(value)) return false
  const [expires, signature] = value.split(".")
  if (Number(expires) <= Math.floor(now / 1000)) return false
  const expected = createHmac("sha256", process.env.HAL_SESSION_SECRET!)
    .update(expires)
    .digest("hex")
  return equalSecret(signature, expected)
}
