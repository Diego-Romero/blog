import Link from "@/components/Link"
import siteMetadata from "@/data/siteMetadata"
import { formatDate } from "pliny/utils/formatDate"

const MAX_DISPLAY = 6

export default function Home({ posts }) {
  const recentPosts = posts.filter((p) => p.path?.startsWith("blog")).slice(0, MAX_DISPLAY)

  return (
    <div className="content-container">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero">
        {/* $ whoami terminal line */}
        <div className="hero-prompt">
          <span className="prompt-dollar">$</span>
          whoami
        </div>

        {/* Output block */}
        <div className="hero-whoami-output">
          <div>
            <span className="out-key">name</span>
            {"      : "}
            <span className="out-val">Diego Romero</span>
          </div>
          <div>
            <span className="out-key">role</span>
            {"      : "}
            <span className="out-val">Software Engineer</span>
          </div>
          <div>
            <span className="out-key">interests</span>
            {": "}
            <span className="out-val">deep work, systems thinking, building things</span>
          </div>
        </div>

        {/* Big name with cursor */}
        <h1 className="hero-name">
          Diego <span className="name-accent">Romero</span>
          <span className="cursor-blink" aria-hidden="true" />
        </h1>

        {/* Tagline */}
        <p className="hero-tagline">{siteMetadata.description}</p>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/blog" className="btn btn-primary">
            Read the blog
          </Link>
          <Link href="/about" className="btn">
            About me
          </Link>
        </div>
      </section>

      {/* ── BIO BLOCKQUOTE ───────────────────────────── */}
      <blockquote className="home-bio">
        I write about software engineering, productivity, deep work, and building products. I
        believe in learning by doing and sharing what I learn along the way.
      </blockquote>

      {/* ── RECENT POSTS ─────────────────────────────── */}
      <section className="home-section">
        <div className="home-section-hd">
          <div>
            <p className="section-label">writing</p>
            <h2 className="section-title">Recent Posts</h2>
          </div>
          <Link
            href="/blog"
            style={{
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--muted)",
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            see all →
          </Link>
        </div>

        <div className="recent-list">
          {!recentPosts.length && (
            <p
              style={{
                padding: "1rem",
                color: "var(--muted)",
                fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              }}
            >
              No posts yet.
            </p>
          )}
          {recentPosts.map((post, i) => {
            const { path, date, title } = post
            return (
              <Link key={path} href={`/${path}`} className="recent-row">
                <span className="recent-row-prompt">{i % 2 === 0 ? "▸" : "▹"}</span>
                <span className="recent-row-title">{title}</span>
                <time className="recent-row-date" dateTime={date}>
                  {formatDate(date, siteMetadata.locale)}
                </time>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
