import { test, expect } from "@playwright/test"

test.describe("Theme switching", () => {
  test("default theme loads (html has a theme class)", async ({ page }) => {
    await page.goto("/")
    // next-themes sets either "dark" or "light" class on <html>
    await page.waitForFunction(() => {
      const html = document.documentElement
      return html.classList.contains("dark") || html.classList.contains("light")
    })
    const htmlClass = await page.locator("html").getAttribute("class")
    expect(htmlClass).toMatch(/dark|light/)
  })

  test("toggle switches from light to dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.goto("/")

    // Wait for hydration - theme class should be set
    await page.waitForFunction(() => document.documentElement.classList.contains("light"))

    const toggle = page.getByRole("button", { name: /Toggle Dark Mode/i })
    await expect(toggle).toBeVisible()
    await toggle.click()

    // After toggle, html should have "dark" class
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"))
    const htmlClass = await page.locator("html").getAttribute("class")
    expect(htmlClass).toContain("dark")
  })

  test("toggle switches from dark to light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" })
    await page.goto("/")

    await page.waitForFunction(() => document.documentElement.classList.contains("dark"))

    const toggle = page.getByRole("button", { name: /Toggle Dark Mode/i })
    await expect(toggle).toBeVisible()
    await toggle.click()

    await page.waitForFunction(() => document.documentElement.classList.contains("light"))
    const htmlClass = await page.locator("html").getAttribute("class")
    expect(htmlClass).toContain("light")
  })

  test("theme toggle button text reflects current mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.goto("/")
    await page.waitForFunction(() => document.documentElement.classList.contains("light"))

    const toggle = page.getByRole("button", { name: /Toggle Dark Mode/i })
    // In light mode button shows "◐ DARK"
    await expect(toggle).toContainText("DARK")

    await toggle.click()
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"))
    // In dark mode button shows "◑ LIGHT"
    await expect(toggle).toContainText("LIGHT")
  })

  test("theme persists across navigation", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" })
    await page.goto("/")
    await page.waitForFunction(() => document.documentElement.classList.contains("light"))

    // Switch to dark
    const toggle = page.getByRole("button", { name: /Toggle Dark Mode/i })
    await toggle.click()
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"))

    // Navigate to blog
    await page.goto("/blog")

    // Theme should still be dark (stored in localStorage)
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"), {
      timeout: 5000,
    })
    const htmlClass = await page.locator("html").getAttribute("class")
    expect(htmlClass).toContain("dark")
  })
})
