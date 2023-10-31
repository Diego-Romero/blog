import { MetadataRoute } from "next"
import { allBlogs, allBooks } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = [...allBlogs, ...allBooks]
  const siteUrl = siteMetadata.siteUrl
  const blogRoutes = allPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = ["", "blog", "book", "projects", "tags"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...blogRoutes]
}
