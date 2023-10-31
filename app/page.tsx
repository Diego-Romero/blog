import { sortPosts, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs, allBooks } from "contentlayer/generated"
import Main from "./Main"

export default async function Page() {
  const allPosts = [...allBlogs, ...allBooks]
  const sortedPosts = sortPosts(allPosts)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
