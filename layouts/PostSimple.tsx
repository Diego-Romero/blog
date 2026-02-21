import { ReactNode } from "react"
import { formatDate } from "pliny/utils/formatDate"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog } from "contentlayer/generated"
import Comments from "@/components/Comments"
import Link from "@/components/Link"
import siteMetadata from "@/data/siteMetadata"
import ScrollTopAndComment from "@/components/ScrollTopAndComment"

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostSimple({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title } = content
  const basePath = path.split("/")[0]

  return (
    <>
      <ScrollTopAndComment />
      <div className="content-container">
        {/* Back */}
        <div className="article-back-row">
          <Link href={`/${basePath}`} className="back-btn">
            Back to {basePath}
          </Link>
        </div>

        <article>
          {/* Header */}
          <header className="article-header">
            <div className="article-meta-line">
              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
            </div>
            <h1 className="article-title">{title}</h1>
          </header>

          {/* Body */}
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

          {/* Prev/Next */}
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
      </div>
    </>
  )
}
