import Link from "@/components/Link"
import siteMetadata from "@/data/siteMetadata"
import { formatDate } from "pliny/utils/formatDate"

const MAX_DISPLAY = 6

const protocols = [
  {
    title: "Workout Protocol",
    description: "Strength and conditioning built around Wendler's 5/3/1.",
    slug: "workout-protocol",
    icon: "🏋️",
  },
  {
    title: "Nutrition Protocol",
    description: "Fueling training, losing fat, and staying healthy — on autopilot.",
    slug: "nutrition-protocol",
    icon: "🍽️",
  },
]

const projects = [
  {
    title: "Deepflow",
    description:
      "A focus timer app for people who want to do deep work, not just read about it. AI-driven productivity coaching and distraction blocking.",
    href: "https://deepflow.me",
    icon: "🎯",
  },
  {
    title: "This Blog",
    description:
      "Built with Next.js, Contentlayer, and the Terminal Warm design system. Open source.",
    href: "https://github.com/Diego-Romero/blog",
    icon: "📝",
  },
]

export default function Home({ posts }) {
  const recentPosts = posts.filter((p) => p.path?.startsWith("blog")).slice(0, MAX_DISPLAY)

  return (
    <div className="content-container">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-prompt">
          <span className="prompt-dollar">$</span>
          whoami
        </div>

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

        <h1 className="hero-name">
          Diego <span className="name-accent">Romero</span>
          <span className="cursor-blink" aria-hidden="true" />
        </h1>

        <div className="flex flex-wrap gap-3">
          <Link href="/blog" className="btn btn-primary">
            Read the blog
          </Link>
          <Link href="/about" className="btn">
            About me
          </Link>
        </div>
      </section>

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

      {/* ── PROTOCOLS ────────────────────────────────── */}
      <section className="home-section">
        <div className="home-section-hd">
          <div>
            <p className="section-label">systems</p>
            <h2 className="section-title">Protocols</h2>
          </div>
          <Link
            href="/protocols"
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

        <div className="protocol-grid">
          {protocols.map((p) => (
            <Link
              key={p.slug}
              href={`/protocols/${p.slug}`}
              className="protocol-card"
              style={{ textDecoration: "none" }}
            >
              <span className="protocol-icon">{p.icon}</span>
              <div>
                <h3 className="protocol-title">{p.title}</h3>
                <p className="protocol-desc">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────── */}
      <section className="home-section">
        <div className="home-section-hd">
          <div>
            <p className="section-label">building</p>
            <h2 className="section-title">Projects</h2>
          </div>
          <Link
            href="/projects"
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

        <div className="protocol-grid">
          {projects.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="protocol-card"
              style={{ textDecoration: "none" }}
            >
              <span className="protocol-icon">{p.icon}</span>
              <div>
                <h3 className="protocol-title">{p.title}</h3>
                <p className="protocol-desc">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
