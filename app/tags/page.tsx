import Link from "@/components/Link"
import { slug } from "github-slugger"
import tagData from "app/tag-data.json"
import { genPageMetadata } from "app/seo"

export const metadata = genPageMetadata({ title: "Tags", description: "Things I blog about" })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="content-container">
      <div className="page-header">
        <p className="section-label">index</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          Tags
        </h1>
      </div>

      <div className="tags-page-list">
        {tagKeys.length === 0 && (
          <p
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.8rem",
            }}
          >
            No tags found.
          </p>
        )}
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className="terminal-tag"
            aria-label={`View posts tagged ${t}`}
          >
            {t}{" "}
            <span style={{ color: "var(--accent)", marginLeft: "0.15rem" }}>({tagCounts[t]})</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
