import { test, expect } from "@playwright/test"

test.describe("SEO meta tags", () => {
  test("homepage has correct title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Diego Blog/)
  })

  test("homepage has meta description", async ({ page }) => {
    await page.goto("/")
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute("content", /I explain things I learn/)
  })

  test("homepage has Open Graph title", async ({ page }) => {
    await page.goto("/")
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute("content", /Diego Blog/)
  })

  test("homepage has Open Graph description", async ({ page }) => {
    await page.goto("/")
    const ogDesc = page.locator('meta[property="og:description"]')
    await expect(ogDesc).toHaveAttribute("content", /I explain things I learn/)
  })

  test("homepage has Open Graph image", async ({ page }) => {
    await page.goto("/")
    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveCount(1)
    const content = await ogImage.getAttribute("content")
    expect(content).toBeTruthy()
  })

  test("homepage has Twitter card meta tag", async ({ page }) => {
    await page.goto("/")
    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image")
  })

  test("homepage has canonical link tag", async ({ page }) => {
    await page.goto("/")
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    const href = await canonical.getAttribute("href")
    expect(href).toBeTruthy()
  })

  test("blog post page has correct title in <title>", async ({ page }) => {
    await page.goto("/blog/pomodoro-technique")
    await expect(page).toHaveTitle(/Pomodoro Technique/)
  })

  test("blog post page has Open Graph title", async ({ page }) => {
    await page.goto("/blog/pomodoro-technique")
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveCount(1)
    const content = await ogTitle.getAttribute("content")
    expect(content).toBeTruthy()
  })

  test("blog page title includes 'Blog'", async ({ page }) => {
    await page.goto("/blog")
    await expect(page).toHaveTitle(/Blog/)
  })

  test("html lang attribute is set", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "en-us")
  })
})
