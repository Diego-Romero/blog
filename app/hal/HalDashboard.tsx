"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import styles from "./hal.module.css"

type Run = {
  id: string
  repository: string | null
  pr: number | null
  title: string | null
  status: string
  started_at: string | null
  finished_at: string | null
  duration_seconds: number | null
  trigger: string | null
  profile: string | null
  model: string | null
  tokens: number | null
  input_tokens: number | null
  output_tokens: number | null
  cached_tokens: number | null
  estimated_cost_usd: number | null
  findings: number | null
  inline_count: number | null
  head: string | null
  base: string | null
  scope: string | null
  error_type: string | null
  summary_url: string | null
  review_url: string | null
  events?: { at: string; event: string }[]
}
type Listing = { runs: Run[]; total: number; next_cursor: string | null }
const count = (value: number | null) => (value == null ? "—" : value.toLocaleString())
const cost = (value: number | null) => (value == null ? "Unavailable" : `$${value.toFixed(6)}`)
const date = (value: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" })
    : "Time not recorded"
const duration = (value: number | null) =>
  value == null
    ? "—"
    : value < 60
      ? `${Math.round(value)}s`
      : `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`
const eventLabels: Record<string, string> = {
  started: "Review queued for execution",
  preflight_passed: "Repository access verified",
  acknowledged: "GitHub acknowledgement posted",
  size_checked: "PR size checked",
  context_prepared: "Repository context collected",
  model_started: "OCR review started",
  model_completed: "OCR review completed",
  review_published: "GitHub review published",
  finished: "Run finished",
  restart_reconciled: "Interrupted run reconciled",
  operator_validation: "Operator validation recorded",
}

function Status({ value }: { value: string }) {
  return (
    <span className={styles.status} data-state={value}>
      {value.replace(/_/g, " ")}
    </span>
  )
}

export default function HalDashboard() {
  const detailPanel = useRef<HTMLElement>(null)
  const selectedButton = useRef<HTMLButtonElement | null>(null)
  const [auth, setAuth] = useState<"checking" | "in" | "out">("checking")
  const [password, setPassword] = useState("")
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState("")
  const [detailError, setDetailError] = useState("")
  const [listing, setListing] = useState<Listing | null>(null)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [limit, setLimit] = useState(20)
  const [refresh, setRefresh] = useState(0)
  const [updated, setUpdated] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<Run | null>(null)
  const [loading, setLoading] = useState(true)
  const cursor = cursors[cursors.length - 1]

  useEffect(() => {
    if (auth === "out") return
    const controller = new AbortController()
    let busy = false
    async function load() {
      if (busy || document.hidden) return
      busy = true
      try {
        const query = new URLSearchParams({ limit: String(limit) })
        if (cursor) query.set("cursor", cursor)
        const response = await fetch(`/api/hal/runs?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        if (response.status === 401) {
          setAuth("out")
          setListing(null)
          setDetail(null)
          return
        }
        if (!response.ok)
          throw new Error(
            "Review history is temporarily unavailable. Your current page is preserved."
          )
        const data: Listing = await response.json()
        if (controller.signal.aborted) return
        setListing(data)
        setAuth("in")
        setError("")
        setUpdated(new Date().toISOString())
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message)
      } finally {
        busy = false
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    setLoading(true)
    void load()
    const timer = setInterval(load, 15000)
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [auth, cursor, limit, refresh])

  useEffect(() => {
    setDetail(null)
    setDetailError("")
    if (!selected || auth !== "in") return
    const controller = new AbortController()
    let busy = false
    async function load() {
      if (busy || document.hidden) return
      busy = true
      try {
        const response = await fetch(`/api/hal/runs/${selected}`, {
          cache: "no-store",
          signal: controller.signal,
        })
        if (response.status === 401) {
          if (!controller.signal.aborted) setAuth("out")
          return
        }
        if (!response.ok) throw new Error("Could not load this review timeline.")
        const data = await response.json()
        if (!controller.signal.aborted) {
          setDetail(data.run)
          setDetailError("")
        }
      } catch (e) {
        if (!controller.signal.aborted) setDetailError((e as Error).message)
      } finally {
        busy = false
      }
    }
    void load()
    const timer = setInterval(load, 15000)
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [selected, auth, refresh])

  async function login(event: FormEvent) {
    event.preventDefault()
    setSigningIn(true)
    setError("")
    try {
      const response = await fetch("/api/hal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to sign in.")
      setPassword("")
      setAuth("in")
      setCursors([null])
      setRefresh((value) => value + 1)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSigningIn(false)
    }
  }
  async function logout() {
    try {
      const response = await fetch("/api/hal/logout", { method: "POST" })
      if (!response.ok) throw new Error("Could not sign out. Please retry.")
      setAuth("out")
      setListing(null)
      setSelected(null)
      setDetail(null)
      setError("")
    } catch (e) {
      setError((e as Error).message)
    }
  }
  function paginate(next: boolean) {
    setSelected(null)
    setCursors((value) =>
      next && listing?.next_cursor ? [...value, listing.next_cursor] : value.slice(0, -1)
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} /> TTD-GitHub-Hal / review log
      </div>
      <div className={styles.heading}>
        <div>
          <h1>
            Every review.
            <br />
            <span>A clear trail.</span>
          </h1>
          <p>Follow Hal from GitHub request to published review.</p>
        </div>
        {auth === "in" ? (
          <button className={styles.button} onClick={logout}>
            Sign out ↗
          </button>
        ) : (
          <span className={styles.private}>TEAM ACCESS</span>
        )}
      </div>
      {error ? (
        <div role="alert" className={styles.error}>
          {error}{" "}
          {auth !== "out" ? (
            <button onClick={() => setRefresh((value) => value + 1)}>Retry</button>
          ) : null}
        </div>
      ) : null}
      {auth === "out" || (auth === "checking" && error) ? (
        <form className={styles.login} onSubmit={login}>
          <div className={styles.eyebrow}>01 / team sign-in</div>
          <h2>Open the review log</h2>
          <p>Enter the shared team password to see review progress and timelines.</p>
          <label htmlFor="hal-password">Team password</label>
          <input
            id="hal-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={256}
          />
          <button className={styles.primary} disabled={signingIn}>
            {signingIn ? "Signing in…" : "View reviews →"}
          </button>
          <small>Access lasts 8 hours. Raw prompts and source code stay on the worker.</small>
        </form>
      ) : auth === "checking" ? (
        <p role="status" className={styles.empty}>
          Checking team access…
        </p>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div>
              <strong>{listing?.total ?? "—"}</strong> recorded reviews{" "}
              <span className={styles.divider}>/</span> newest first
            </div>
            <div className={styles.controls}>
              <label>
                Per page{" "}
                <select
                  aria-label="Reviews per page"
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value))
                    setCursors([null])
                    setSelected(null)
                  }}
                >
                  <option value={20}>20</option>
                  <option value={5}>5</option>
                </select>
              </label>
              <button
                className={styles.button}
                onClick={() => setRefresh((value) => value + 1)}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>
          </div>
          <div className={styles.updated} role="status">
            {loading
              ? "Updating reviews…"
              : `Updated ${updated ? new Date(updated).toLocaleTimeString() : "—"} · refreshes every 15 seconds`}
          </div>
          <div className={styles.workspace}>
            <section aria-label="Review history" className={styles.history}>
              {!listing?.runs.length ? (
                <div className={styles.empty}>
                  {loading
                    ? "Loading reviews…"
                    : "No reviews on this page yet. New runs appear here automatically."}
                </div>
              ) : (
                listing.runs.map((run) => (
                  <button
                    key={run.id}
                    className={`${styles.row} ${selected === run.id ? styles.selected : ""}`}
                    aria-pressed={selected === run.id}
                    onClick={(event) => {
                      selectedButton.current = event.currentTarget
                      setSelected(run.id)
                      if (window.matchMedia("(max-width: 900px)").matches)
                        detailPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                  >
                    <div className={styles.rowTop}>
                      <span>
                        {run.repository || "Repository not recorded"} <b>#{run.pr ?? "—"}</b>
                      </span>
                      <Status value={run.status} />
                    </div>
                    <h2>{run.title || `Review ${run.id.slice(0, 8)}`}</h2>
                    <div className={styles.timestamp}>
                      {date(run.started_at)} ·{" "}
                      {run.trigger === "push" ? "Push re-review" : "Manual review"}
                    </div>
                    <div className={styles.rowMeta}>
                      <span>
                        {run.model?.replace("system.ai.", "") || "Model not recorded"}{" "}
                        <em>/ {run.profile || "—"}</em>
                      </span>
                      <span>{count(run.tokens)} tokens</span>
                      <span>{cost(run.estimated_cost_usd)}</span>
                      <span>{duration(run.duration_seconds)}</span>
                      <span>
                        {count(run.findings)} findings <b>↗</b>
                      </span>
                    </div>
                  </button>
                ))
              )}
              <nav className={styles.pagination} aria-label="Review pagination">
                <button
                  className={styles.button}
                  disabled={cursors.length === 1 || loading}
                  onClick={() => paginate(false)}
                >
                  ← Newer
                </button>
                <span>Page {cursors.length}</span>
                <button
                  className={styles.button}
                  disabled={!listing?.next_cursor || loading}
                  onClick={() => paginate(true)}
                >
                  Older →
                </button>
              </nav>
            </section>
            <aside ref={detailPanel} className={styles.detail} aria-label="Review details">
              <div className={styles.detailHeader}>
                <span className={styles.eyebrow}>Review timeline</span>
                {selected ? (
                  <button
                    aria-label="Close review details"
                    onClick={() => {
                      setSelected(null)
                      selectedButton.current?.focus()
                    }}
                  >
                    ×
                  </button>
                ) : null}
              </div>
              {!selected ? (
                <div className={styles.placeholder}>
                  <span>↳</span>
                  <h2>Pick a review</h2>
                  <p>See when each stage ran, what it used, and where the results landed.</p>
                </div>
              ) : detailError ? (
                <p role="alert">{detailError}</p>
              ) : !detail ? (
                <p role="status">Loading timeline…</p>
              ) : (
                <>
                  <h2 className={styles.detailTitle}>
                    {detail.repository} #{detail.pr}
                  </h2>
                  <Status value={detail.status} />
                  <dl className={styles.facts}>
                    <div>
                      <dt>Scope</dt>
                      <dd>{detail.scope || "Not recorded"}</dd>
                    </div>
                    <div>
                      <dt>Range</dt>
                      <dd>
                        {detail.base?.slice(0, 8) || "—"} → {detail.head?.slice(0, 8) || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>Input / output</dt>
                      <dd>
                        {count(detail.input_tokens)} / {count(detail.output_tokens)}
                      </dd>
                    </div>
                    <div>
                      <dt>Cached input</dt>
                      <dd>{count(detail.cached_tokens)}</dd>
                    </div>
                    <div>
                      <dt>Estimated model cost</dt>
                      <dd>{cost(detail.estimated_cost_usd)}</dd>
                    </div>
                  </dl>
                  <p className={styles.costNote}>
                    Estimates exclude hosting and startup checks. “Unavailable” means usage or
                    pricing was not recorded.
                  </p>
                  {detail.error_type ? (
                    <p className={styles.error}>Error type: {detail.error_type}</p>
                  ) : null}
                  <ol className={styles.timeline}>
                    {detail.events?.map((event, index) => (
                      <li key={`${event.at}-${index}`}>
                        <span className={styles.timelineDot} />
                        <strong>
                          {eventLabels[event.event] || event.event.replace(/_/g, " ")}
                        </strong>
                        <time dateTime={event.at}>{date(event.at)}</time>
                      </li>
                    ))}
                  </ol>
                  <div className={styles.resultLinks}>
                    {detail.summary_url ? (
                      <a href={detail.summary_url} target="_blank" rel="noreferrer">
                        GitHub summary ↗
                      </a>
                    ) : null}
                    {detail.review_url ? (
                      <a href={detail.review_url} target="_blank" rel="noreferrer">
                        Published review ↗
                      </a>
                    ) : null}
                  </div>
                  <details className={styles.runId}>
                    <summary>Run identifier</summary>
                    <code>{detail.id}</code>
                  </details>
                </>
              )}
            </aside>
          </div>
          <p className={styles.footer}>
            Read-only review history · Advisory reviews · Source code and raw model traces are not
            displayed.
          </p>
        </>
      )}
    </div>
  )
}
