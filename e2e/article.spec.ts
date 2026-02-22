import { test, expect } from "@playwright/test"

const ARTICLE_URL = "/blog/pomodoro-technique"
const ARTICLE_TITLE = "Pomodoro Technique"
const ARTICLE_TAG = "productivity"

test.describe("Article page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ARTICLE_URL)
  })

  test("navigates to article and shows correct title", async ({ page }) => {
    await expect(page.locator(".article-title")).toContainText(ARTICLE_TITLE)
  })

  test("shows publication date", async ({ page }) => {
    const date = page.locator(".article-header time").first()
    await expect(date).toBeVisible()
    // Date should be non-empty (e.g. "Mar 6, 2020")
    const text = await date.textContent()
    expect(text!.trim().length).toBeGreaterThan(0)
  })

  test("shows tags on the article", async ({ page }) => {
    const articleTags = page.locator(".article-tags")
    await expect(articleTags).toBeVisible()
    await expect(articleTags).toContainText(ARTICLE_TAG)
  })

  test("article body content is present", async ({ page }) => {
    const body = page.locator(".article-body")
    await expect(body).toBeVisible()
    // The article has real content
    const text = await body.textContent()
    expect(text!.trim().length).toBeGreaterThan(100)
  })

  test("back link returns to blog listing", async ({ page }) => {
    const backBtn = page.locator(".back-btn")
    await expect(backBtn).toBeVisible()
    await expect(backBtn).toContainText("Back to blog")
    await backBtn.click()
    await expect(page).toHaveURL("/blog")
  })

  test("sidebar shows tags and navigation", async ({ page }) => {
    const sidebar = page.locator(".article-sidebar")
    await expect(sidebar).toBeVisible()
    // Sidebar has toc-blocks with tags and navigation
    await expect(sidebar.locator(".toc-block").first()).toBeVisible()
  })

  test("page title includes article title", async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(ARTICLE_TITLE))
  })

  test("reading progress bar is in the DOM", async ({ page }) => {
    const progressBar = page.locator(".reading-progress-bar")
    await expect(progressBar).toBeAttached()
  })
})
