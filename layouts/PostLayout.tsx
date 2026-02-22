"use client"

import { ReactNode, useEffect, useState } from "react"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog, Authors } from "contentlayer/generated"
import Comments from "@/components/Comments"
import Link from "@/components/Link"
import Tag from "@/components/Tag"
import siteMetadata from "@/data/siteMetadata"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="reading-progress-bar" style={{ width: `${progress}%` }} aria-hidden="true" />
  )
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags } = content
  const basePath = path.split("/")[0]

  return (
    <>
      <ReadingProgressBar />
      <ScrollTopAndComment />
      <div className="article-layout">
        {/* ── MAIN COLUMN ─────────────────────────── */}
        <article className="article-main">
          {/* Back button */}
          <div className="article-back-row">
            <Link href={`/${basePath}`} className="back-btn">
              Back to {basePath}
            </Link>
          </div>

          {/* Article header */}
          <header className="article-header">
            <div className="article-meta-line">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              </time>
              {authorDetails.length > 0 && (
                <span> · {authorDetails.map((a) => a.name).join(", ")}</span>
              )}
            </div>

            <h1 className="article-title">{title}</h1>

            {tags && tags.length > 0 && (
              <div className="article-tags">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
          </header>

          {/* Article body */}
          <div className="prose prose-lg dark:prose-invert article-body">{children}</div>

          {/* Comments */}
          {siteMetadata.comments && (
            <div
              className="mt-12 pt-8"
              style={{ borderTop: "1px solid var(--border)" }}
              id="comment"
            >
              <Comments slug={slug} />
            </div>
          )}

          {/* Prev/Next navigation */}
          {(next || prev) && (
            <nav
              className="mt-12 pt-6 flex justify-between gap-4"
              style={{
                borderTop: "1px solid var(--border)",
                fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                fontSize: "0.75rem",
              }}
            >
              {prev && prev.path ? (
                <div>
                  <div style={{ color: "var(--muted)", marginBottom: "0.3rem" }}>← Previous</div>
                  <Link
                    href={`/${prev.path}`}
                    style={{ color: "var(--accent)", textDecoration: "none" }}
                  >
                    {prev.title}
                  </Link>
                </div>
              ) : (
                <div />
              )}
              {next && next.path ? (
                <div className="text-right">
                  <div style={{ color: "var(--muted)", marginBottom: "0.3rem" }}>Next →</div>
                  <Link
                    href={`/${next.path}`}
                    style={{ color: "var(--accent)", textDecoration: "none" }}
                  >
                    {next.title}
                  </Link>
                </div>
              ) : (
                <div />
              )}
            </nav>
          )}
        </article>

        {/* ── SIDEBAR (desktop only) ───────────────── */}
        <aside className="article-sidebar">
          <div
            style={{
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.72rem",
              color: "var(--muted)",
              marginBottom: "1.5rem",
            }}
          >
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
            </time>
          </div>

          {tags && tags.length > 0 && (
            <div className="toc-block" style={{ marginBottom: "1.5rem" }}>
              <div className="toc-title">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            </div>
          )}

          <div className="toc-block">
            <div className="toc-title">Navigation</div>
            {prev && prev.path && (
              <Link href={`/${prev.path}`} className="toc-link">
                ← {prev.title}
              </Link>
            )}
            {next && next.path && (
              <Link href={`/${next.path}`} className="toc-link">
                → {next.title}
              </Link>
            )}
            <Link
              href={`/${basePath}`}
              className="toc-link"
              style={{ color: "var(--accent)", marginTop: "0.5rem", display: "block" }}
            >
              ↩ All {basePath === "blog" ? "posts" : "books"}
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}
