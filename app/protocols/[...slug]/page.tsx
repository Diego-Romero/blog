import "css/prism.css"
import "katex/dist/katex.css"

import { components } from "@/components/MDXComponents"
import { MDXLayoutRenderer } from "pliny/mdx-components"
import { allProtocols } from "contentlayer/generated"
import type { Protocol } from "contentlayer/generated"
import { coreContent } from "pliny/utils/contentlayer"
import { Metadata } from "next"
import siteMetadata from "@/data/siteMetadata"
import Link from "@/components/Link"
import Tag from "@/components/Tag"

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join("/"))
  const protocol = allProtocols.find((p) => p.slug === slug)
  if (!protocol) return

  const publishedAt = new Date(protocol.date).toISOString()
  const modifiedAt = new Date(protocol.lastmod || protocol.date).toISOString()

  return {
    title: protocol.title,
    description: protocol.summary,
    openGraph: {
      title: protocol.title,
      description: protocol.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
    },
    twitter: {
      card: "summary_large_image",
      title: protocol.title,
      description: protocol.summary,
    },
  }
}

export const generateStaticParams = async () => {
  return allProtocols.map((p) => ({ slug: p.slug.split("/") }))
}

const dateTemplate: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
}

export default async function ProtocolPage({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join("/"))
  const protocol = allProtocols.find((p) => p.slug === slug) as Protocol

  if (!protocol) {
    return (
      <div className="mt-24 text-center">
        <h1 className="section-title">Protocol not found</h1>
      </div>
    )
  }

  const content = coreContent(protocol)

  return (
    <div className="article-layout">
      <article className="article-main">
        {/* Back button */}
        <div className="article-back-row">
          <Link href="/protocols" className="back-btn">
            Back to protocols
          </Link>
        </div>

        {/* Article header */}
        <header className="article-header">
          <div className="article-meta-line">
            <time dateTime={content.date}>
              {new Date(content.date).toLocaleDateString(siteMetadata.locale, dateTemplate)}
            </time>
            {content.readingTime && (
              <span> · {Math.ceil(content.readingTime.minutes)} min read</span>
            )}
          </div>

          <h1 className="article-title">{content.title}</h1>

          {content.tags && content.tags.length > 0 && (
            <div className="article-tags">
              {content.tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </header>

        {/* Article body */}
        <div className="prose prose-lg dark:prose-invert article-body">
          <MDXLayoutRenderer code={protocol.body.code} components={components} toc={protocol.toc} />
        </div>
      </article>

      {/* Sidebar (desktop only) */}
      <aside className="article-sidebar">
        <div
          style={{
            fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--muted)",
            marginBottom: "1.5rem",
          }}
        >
          <time dateTime={content.date}>
            {new Date(content.date).toLocaleDateString(siteMetadata.locale, dateTemplate)}
          </time>
        </div>

        {content.tags && content.tags.length > 0 && (
          <div className="toc-block" style={{ marginBottom: "1.5rem" }}>
            <div className="toc-title">Tags</div>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        )}

        <div className="toc-block">
          <div className="toc-title">Navigation</div>
          <Link
            href="/protocols"
            className="toc-link"
            style={{ color: "var(--accent)", marginTop: "0.5rem", display: "block" }}
          >
            ↩ All protocols
          </Link>
        </div>
      </aside>
    </div>
  )
}
