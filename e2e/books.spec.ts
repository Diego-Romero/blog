import { test, expect } from "@playwright/test"

test.describe("Books page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/book")
  })

  test("loads at /book", async ({ page }) => {
    await expect(page).toHaveURL("/book")
    await expect(page.locator(".section-title")).toBeVisible()
  })

  test("book entries are listed", async ({ page }) => {
    const items = page.locator(".blog-item")
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test("book entries show titles and dates", async ({ page }) => {
    const first = page.locator(".blog-item").first()
    await expect(first.locator(".blog-item-title")).not.toBeEmpty()
    await expect(first.locator(".blog-item-date")).not.toBeEmpty()
  })

  test("clicking a book navigates to its detail page", async ({ page }) => {
    const first = page.locator(".blog-item").first()
    const title = await first.locator(".blog-item-title").textContent()
    await first.click()

    await expect(page).toHaveURL(/\/book\//)
    await expect(page.locator(".article-title")).toContainText(title!.trim())
  })

  test("book detail page shows title and body content", async ({ page }) => {
    await page.goto("/book/deep-work")
    await expect(page.locator(".article-title")).toContainText("Deep Work")
    await expect(page.locator(".article-body")).toBeVisible()
    const bodyText = await page.locator(".article-body").textContent()
    expect(bodyText!.trim().length).toBeGreaterThan(50)
  })

  test("book detail page has back link to /book", async ({ page }) => {
    await page.goto("/book/deep-work")
    const backBtn = page.locator(".back-btn")
    await expect(backBtn).toBeVisible()
    await expect(backBtn).toContainText("Back to book")
    await backBtn.click()
    await expect(page).toHaveURL("/book")
  })

  test("pagination is rendered for books (>5 books exist)", async ({ page }) => {
    // There are 7 books with BOOKS_PER_PAGE=5, so pagination should appear
    const pagination = page.locator(".pagination")
    await expect(pagination).toBeVisible()
    await expect(page.locator(".pagination-info")).toContainText("1 / 2")
  })

  test("next page of books loads", async ({ page }) => {
    const nextBtn = page.locator(".pagination-btn").filter({ hasText: "Next" })
    await expect(nextBtn).toBeVisible()
    await nextBtn.click()
    await expect(page).toHaveURL(/\/book\/page\/2/)
    const items = page.locator(".blog-item")
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })
})
