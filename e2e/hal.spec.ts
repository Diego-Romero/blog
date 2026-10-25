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
  await expect(page.getByRole("alert").filter({ hasText: "Incorrect password" })).toContainText(
    "Incorrect password"
  )
  await page.getByLabel("Team password").fill(process.env.HAL_E2E_PASSWORD!)
  await page.getByRole("button", { name: "View reviews" }).click()
  await expect(page.getByLabel("Review view")).toHaveValue("latest")
  const rows = page.getByRole("region", { name: "Review history" }).locator("button[aria-pressed]")
  const grouped = await (await page.request.get("/api/hal/runs?view=latest")).json()
  await expect(rows).toHaveCount(Math.min(20, grouped.total))
  const identities = await rows.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-review-key"))
  )
  expect(new Set(identities).size).toBe(identities.length)
  await expect(rows.first()).toContainText("latest review")
  await rows.first().click()
  const latestDetails = page.getByRole("complementary", { name: "Review details" })
  await latestDetails.getByRole("button", { name: "View this PR’s runs" }).click()
  const latest = grouped.runs[0]
  await expect(
    page.getByText(`History for ${latest.repository} #${latest.pr}`, { exact: true })
  ).toBeVisible()
  await expect(rows).toHaveCount(Math.min(20, latest.run_count))
  expect(
    await rows.evaluateAll(
      (elements) => new Set(elements.map((element) => element.getAttribute("data-review-key"))).size
    )
  ).toBe(1)
  await page.getByRole("button", { name: "Back to latest PRs" }).click()
  await expect(rows).toHaveCount(Math.min(20, grouped.total))
  await page.getByLabel("Review view").selectOption("all")
  await expect(rows).toHaveCount(Math.min(20, grouped.total_runs))
  await page.getByLabel("Reviews per page").selectOption("5")
  await expect(rows).toHaveCount(5)
  const first = (await rows.first().textContent()) || ""
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
