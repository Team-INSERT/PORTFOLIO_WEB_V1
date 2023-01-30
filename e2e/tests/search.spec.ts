import { test } from "@playwright/test";

test("검색 기능 테스트", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("검색").click();
  await page.getByPlaceholder("검색").fill("test");
  await page.getByPlaceholder("검색").press("Enter");
  await page.locator("div").filter({ hasText: "필터" }).nth(4).click();
  await page.getByRole("heading", { name: "포트폴리오4" }).click();
  await page
    .locator("div")
    .filter({
      hasText:
        "포트폴리오4박정호Amazon Route 53Amazon WorkDocs조회수 0회 · 2023년 1월 28일0팔로잉공유포트폴리오4 설명",
    })
    .nth(2)
    .click();
  await page.locator("video").click();
});
