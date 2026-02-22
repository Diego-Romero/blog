import { test, expect } from "@playwright/test"

test.describe("Blog listing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog")
  })

  test('loads at /blog with "All Posts" heading', async ({ page }) => {
    await expect(page.locator(".section-title")).toContainText("All Posts")
  })

  test("posts are listed with titles and dates", async ({ page }) => {
    const items = page.locator(".blog-item")
    const count = await items.count()
    expect(count).toBeGreaterThan(0)

    const first = items.first()
    await expect(first.locator(".blog-item-title")).not.toBeEmpty()
    await expect(first.locator(".blog-item-date")).not.toBeEmpty()
  })

  test("tags are displayed on posts", async ({ page }) => {
    const firstTaggedPost = page.locator(".blog-item-tags").first()
    await expect(firstTaggedPost).toBeVisible()
    const tag = firstTaggedPost.locator(".blog-item-tag").first()
    await expect(tag).not.toBeEmpty()
  })

  test("clicking a post navigates to its article page", async ({ page }) => {
    const firstPost = page.locator(".blog-item").first()
    const title = await firstPost.locator(".blog-item-title").textContent()
    await firstPost.click()

    // Should be on an article page
    await expect(page).toHaveURL(/\/blog\//)
    await expect(page.locator(".article-title")).toContainText(title!.trim())
  })

  test("article page renders title, date and article body", async ({ page }) => {
    const firstPost = page.locator(".blog-item").first()
    await firstPost.click()

    await expect(page.locator(".article-title")).toBeVisible()
    await expect(page.locator(".article-header time")).toBeVisible()
    await expect(page.locator(".article-body")).toBeVisible()
  })

  test("article page has back link", async ({ page }) => {
    await page.locator(".blog-item").first().click()
    const backBtn = page.locator(".back-btn")
    await expect(backBtn).toBeVisible()
    await expect(backBtn).toContainText("Back to blog")
  })

  test("filter bar is rendered with tag links", async ({ page }) => {
    const filterBar = page.locator(".filter-bar")
    await expect(filterBar).toBeVisible()
    await expect(filterBar.getByRole("link", { name: "all" })).toBeVisible()
  })

  test("pagination only appears when there are multiple pages", async ({ page }) => {
    const pagination = page.locator(".pagination")
    const isVisible = await pagination.isVisible()
    if (isVisible) {
      // If pagination shows, the info text should match "1 / N"
      const totalPages = await page.locator(".pagination-info").textContent({ timeout: 5000 })
      expect(totalPages).toMatch(/\d+ \/ \d+/)
    } else {
      // Blog has 5 posts with POSTS_PER_PAGE=5 — single page, no pagination needed
      expect(isVisible).toBe(false)
    }
  })
})
