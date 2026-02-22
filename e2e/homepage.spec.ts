import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Diego Blog/)
  })

  test('shows terminal nav logo "diego@blog:~$"', async ({ page }) => {
    const logo = page.locator(".nav-logo")
    await expect(logo).toBeVisible()
    await expect(logo).toContainText("diego")
    await expect(logo).toContainText("blog")
    await expect(logo).toContainText("$")
  })

  test('"$ whoami" hero section renders', async ({ page }) => {
    const prompt = page.locator(".hero-prompt")
    await expect(prompt).toBeVisible()
    await expect(prompt).toContainText("whoami")
  })

  test('"Diego Romero" heading is visible in hero', async ({ page }) => {
    await expect(page.locator(".hero-name")).toContainText("Diego")
    await expect(page.locator(".hero-whoami-output")).toContainText("Diego Romero")
  })

  test("recent posts section shows posts with dates", async ({ page }) => {
    const recentList = page.locator(".recent-list")
    await expect(recentList).toBeVisible()
    const rows = page.locator(".recent-row")
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    // Each row should have a title and a date
    const firstRow = rows.first()
    await expect(firstRow.locator(".recent-row-title")).not.toBeEmpty()
    await expect(firstRow.locator(".recent-row-date")).not.toBeEmpty()
  })

  test("navigation links are present and clickable", async ({ page }) => {
    for (const label of ["Blogs", "Books", "Tags", "Projects", "About"]) {
      const link = page.getByRole("link", { name: label }).first()
      await expect(link).toBeVisible()
    }
  })

  test("theme toggle button is present", async ({ page }) => {
    // The theme toggle renders a button with aria-label after mount
    const toggle = page.getByRole("button", { name: /Toggle Dark Mode/i })
    await expect(toggle).toBeVisible()
  })

  test("footer renders with diegoromero.blog text", async ({ page }) => {
    const footer = page.locator("footer.site-footer")
    await expect(footer).toBeVisible()
    await expect(footer).toContainText("diegoromero.blog")
  })

  test('footer shows "built with Next.js" text', async ({ page }) => {
    await expect(page.locator(".site-footer")).toContainText("built with Next.js")
  })

  test("CTA: Read the blog links to /blog", async ({ page }) => {
    const readBlog = page.getByRole("link", { name: "Read the blog" })
    await expect(readBlog).toHaveAttribute("href", "/blog")
  })

  test("CTA: About me links to /about", async ({ page }) => {
    const aboutMe = page.getByRole("link", { name: "About me" })
    await expect(aboutMe).toHaveAttribute("href", "/about")
  })

  test("hero tagline is visible", async ({ page }) => {
    await expect(page.locator(".hero-tagline")).toBeVisible()
    await expect(page.locator(".hero-tagline")).toContainText("I explain things I learn")
  })

  test('logo links back to homepage "/"', async ({ page }) => {
    const logo = page.locator(".nav-logo")
    await expect(logo).toHaveAttribute("href", "/")
  })
})
