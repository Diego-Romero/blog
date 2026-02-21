"use client"

import { usePathname } from "next/navigation"
import { slug } from "github-slugger"
import { formatDate } from "pliny/utils/formatDate"
import { CoreContent } from "pliny/utils/contentlayer"
import type { Blog, Book } from "contentlayer/generated"
import Link from "@/components/Link"
import siteMetadata from "@/data/siteMetadata"
import tagData from "app/tag-data.json"

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog | Book>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog | Book>[]
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

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="content-container">
      {/* Page header */}
      <div className="page-header">
        <p className="section-label">{pathname.startsWith("/blog") ? "writing" : "reading"}</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          {title}
        </h1>
      </div>

      {/* Tag filter bar */}
      <div className="filter-bar">
        <span className="filter-prefix">filter:</span>
        <Link
          href={pathname.startsWith("/blog") ? "/blog" : "/book"}
          className={`terminal-tag ${!pathname.includes("/tags/") ? "active" : ""}`}
        >
          all
        </Link>
        {sortedTags.slice(0, 12).map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className={`terminal-tag ${pathname.split("/tags/")[1] === slug(t) ? "active" : ""}`}
            aria-label={`View posts tagged ${t}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* Post list */}
      <div className="blog-list">
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

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
