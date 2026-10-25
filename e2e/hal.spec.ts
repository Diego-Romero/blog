import { test, expect } from "@playwright/test"

test("audit API rejects unauthenticated and forged sessions", async ({ request }) => {
  const response = await request.get("/api/hal/runs")
  expect(response.status()).toBe(401)
  expect(response.headers()["cache-control"]).toContain("no-store")
  expect(await response.text()).not.toContain("repository")
  const forged = await request.get("/api/hal/runs", {
    headers: { Cookie: `hal_session=1999999999.${"a".repeat(64)}` },
  })
  expect(forged.status()).toBe(401)
  const crossOrigin = await request.post("/api/hal/login", {
    headers: { Origin: "https://untrusted.example" },
    data: { password: "wrong" },
  })
  expect(crossOrigin.status()).toBe(403)
})

test("team can sign in, paginate, inspect a timeline, refresh and sign out", async ({ page }) => {
  test.skip(!process.env.HAL_E2E_PASSWORD, "Requires the locally provisioned team password")
  await page.goto("/hal")
  await expect(page.getByRole("heading", { name: "Open the review log" })).toBeVisible()
  await page.getByLabel("Team password").fill("incorrect-test-password")
  await page.getByRole("button", { name: "View reviews" }).click()
  await expect(page.getByRole("alert")).toContainText("Incorrect password")
  await page.getByLabel("Team password").fill(process.env.HAL_E2E_PASSWORD!)
  await page.getByRole("button", { name: "View reviews" }).click()
  await expect(page.getByText("recorded reviews", { exact: false })).toBeVisible()
  await page.getByLabel("Reviews per page").selectOption("5")
  const rows = page.getByRole("region", { name: "Review history" }).locator("button[aria-pressed]")
  await expect(rows).toHaveCount(5)
  const first = await rows.first().innerText()
  await page.getByRole("button", { name: "Older" }).click()
  await expect(page.getByText("Page 2", { exact: true })).toBeVisible()
  await expect(rows.first()).not.toHaveText(first)
  await page.getByRole("button", { name: "Newer" }).click()
  await expect(page.getByText("Page 1", { exact: true })).toBeVisible()
  await expect(rows.first()).toHaveText(first)
  await rows.first().click()
  const details = page.getByRole("complementary", { name: "Review details" })
  await expect(details.getByText("GitHub review published")).toBeVisible()
  await expect(details.getByRole("link", { name: "GitHub summary" })).toHaveAttribute(
    "href",
    /^https:\/\/github\.com\//
  )
  await expect(details.getByText("Input / output")).toBeVisible()
  await page.getByRole("button", { name: "Refresh", exact: false }).click()
  await expect(page.getByRole("button", { name: "Refresh", exact: false })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  )
  await page.getByRole("button", { name: "Sign out" }).click()
  await expect(page.getByRole("heading", { name: "Open the review log" })).toBeVisible()
  const response = await page.request.get("/api/hal/runs")
  expect(response.status()).toBe(401)
})
