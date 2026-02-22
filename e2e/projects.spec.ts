import { test, expect } from "@playwright/test"

test.describe("Projects page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects")
  })

  test("loads at /projects", async ({ page }) => {
    await expect(page).toHaveURL("/projects")
  })

  test('shows "Projects" heading', async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Projects")
  })

  test("project cards render with titles", async ({ page }) => {
    const cards = page.locator(".project-card")
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    const titles = page.locator(".project-card-title")
    await expect(titles.first()).not.toBeEmpty()
  })

  test("project cards show descriptions", async ({ page }) => {
    const descs = page.locator(".project-card-desc")
    const count = await descs.count()
    expect(count).toBeGreaterThan(0)
    const text = await descs.first().textContent()
    expect(text!.trim().length).toBeGreaterThan(10)
  })

  test("project cards have visit links", async ({ page }) => {
    const links = page.locator(".project-card-link")
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    await expect(links.first()).toBeVisible()
  })

  test("Deepflow project card is present", async ({ page }) => {
    const card = page
      .locator(".project-card")
      .filter({ has: page.locator(".project-card-title", { hasText: "Deepflow" }) })
    await expect(card).toBeVisible()
    await expect(card.locator(".project-card-link")).toHaveAttribute("href", /deepflow\.me/)
  })

  test("terminal titlebar dots render on each card", async ({ page }) => {
    const titlebars = page.locator(".terminal-titlebar")
    const count = await titlebars.count()
    expect(count).toBeGreaterThan(0)
    // Each titlebar has the red/yellow/green dots
    const firstBar = titlebars.first()
    await expect(firstBar.locator(".t-dot-r")).toBeVisible()
    await expect(firstBar.locator(".t-dot-y")).toBeVisible()
    await expect(firstBar.locator(".t-dot-g")).toBeVisible()
  })
})
