"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { formatDate } from "pliny/utils/formatDate"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog } from "contentlayer/generated"
import Link from "@/components/Link"
import siteMetadata from "@/data/siteMetadata"

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split("/")[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="pagination">
      {!prevPage ? (
        <span
          className="pagination-btn"
          aria-disabled="true"
          style={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          ← Previous
        </span>
      ) : (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="pagination-btn"
        >
          ← Previous
        </Link>
      )}
      <span className="pagination-info">
        {currentPage} / {totalPages}
      </span>
      {!nextPage ? (
        <span
          className="pagination-btn"
          aria-disabled="true"
          style={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          Next →
        </span>
      ) : (
        <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className="pagination-btn">
          Next →
        </Link>
      )}
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState("")
  const filteredPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(" ")
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredPosts

  return (
    <div className="content-container">
      <div className="page-header">
        <p className="section-label">search</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          {title}
        </h1>
      </div>

      {/* Search input */}
      <div className="filter-bar" style={{ marginBottom: "1.75rem", gap: "0.75rem" }}>
        <span className="filter-prefix">$</span>
        <input
          aria-label="Search articles"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="grep -i ..."
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--fg)",
            fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
            fontSize: "0.8rem",
            flex: 1,
          }}
        />
      </div>

      <div className="blog-list">
        {!filteredPosts.length && (
          <p
            style={{
              padding: "1rem",
              color: "var(--muted)",
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.8rem",
            }}
          >
            no results found.
          </p>
        )}
        {displayPosts.map((post) => {
          const { path, date, title: postTitle, summary, tags } = post
          return (
            <Link key={path} href={`/${path}`} className="blog-item">
              <span className="blog-item-prompt">▸</span>
              <div className="blog-item-content">
                <div className="blog-item-top">
                  <span className="blog-item-title">{postTitle}</span>
                  <span className="blog-item-meta">
                    <time className="blog-item-date" dateTime={date}>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </span>
                </div>
                {summary && <p className="blog-item-excerpt">{summary}</p>}
                {tags && tags.length > 0 && (
                  <div className="blog-item-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="blog-item-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
