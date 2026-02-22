import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test("logo navigates to homepage", async ({ page }) => {
    await page.goto("/blog")
    const logo = page.locator(".nav-logo")
    await logo.click()
    await expect(page).toHaveURL("/")
  })

  test("Blogs nav link navigates to /blog", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Blogs" }).first().click()
    await expect(page).toHaveURL("/blog")
  })

  test("Books nav link navigates to /book", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Books" }).first().click()
    await expect(page).toHaveURL("/book")
  })

  test("Projects nav link navigates to /projects", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Projects" }).first().click()
    await expect(page).toHaveURL("/projects")
  })

  test("About nav link navigates to /about", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "About" }).first().click()
    await expect(page).toHaveURL("/about")
  })

  test("Tags nav link navigates to /tags", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Tags" }).first().click()
    await expect(page).toHaveURL("/tags")
  })

  test("mobile nav (.bottom-nav) has all nav links in DOM", async ({ page }) => {
    await page.goto("/")
    const mobileNav = page.locator(".bottom-nav")
    await expect(mobileNav).toBeAttached()

    // Use href-based selectors — the bottom-nav may be CSS-hidden on desktop
    // but the links must always be present in the DOM
    for (const href of ["/blog", "/book", "/tags", "/projects", "/about"]) {
      await expect(mobileNav.locator(`a[href="${href}"]`)).toBeAttached()
    }
  })

  test("search button opens KBar modal", async ({ page }) => {
    await page.goto("/")
    const searchBtn = page.getByRole("button", { name: /Search/i })
    await expect(searchBtn).toBeVisible()
    await searchBtn.click()

    // KBar renders an input for search
    const searchInput = page.getByRole("combobox").or(page.locator('input[type="text"]')).first()
    await expect(searchInput).toBeVisible({ timeout: 5000 })
  })

  test("ESC closes search modal", async ({ page }) => {
    await page.goto("/")
    const searchBtn = page.getByRole("button", { name: /Search/i })
    await searchBtn.click()

    // Wait for search input
    const searchInput = page.getByRole("combobox").or(page.locator('input[type="text"]')).first()
    await expect(searchInput).toBeVisible({ timeout: 5000 })

    // Press ESC
    await page.keyboard.press("Escape")

    // Input should no longer be visible
    await expect(searchInput).not.toBeVisible({ timeout: 3000 })
  })

  test("search modal shows results when typing", async ({ page }) => {
    await page.goto("/")
    const searchBtn = page.getByRole("button", { name: /Search/i })
    await searchBtn.click()

    const searchInput = page.getByRole("combobox").or(page.locator('input[type="text"]')).first()
    await expect(searchInput).toBeVisible({ timeout: 5000 })

    await searchInput.fill("pomodoro")

    // Some kind of result list should appear (KBar renders list items)
    const results = page.locator('[role="option"], [role="listbox"] *, [data-kbar-list] *')
    await expect(results.first()).toBeVisible({ timeout: 5000 })
  })
})
