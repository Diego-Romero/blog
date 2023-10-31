import ListLayout from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBooks } from "contentlayer/generated"

const BOOKS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default function Page({ params }: { params: { page: string } }) {
  const books = allCoreContent(sortPosts(allBooks))
  const pageNumber = parseInt(params.page as string)
  const initialDisplayBooks = books.slice(
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
      initialDisplayPosts={initialDisplayBooks}
      pagination={pagination}
      title="All Books"
    />
  )
}
