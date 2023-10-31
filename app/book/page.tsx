import ListLayout from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBooks } from "contentlayer/generated"
import { genPageMetadata } from "app/seo"

const BOOKS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: "Book" })

export default function BookPage() {
  const books = allCoreContent(sortPosts(allBooks))
  const pageNumber = 1
  const initialDisplayPosts = books.slice(
    BOOKS_PER_PAGE * (pageNumber - 1),
    BOOKS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={books}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
