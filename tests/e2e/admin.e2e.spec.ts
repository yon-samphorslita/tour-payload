// Payload admin panel in a real browser, logged in as the seeded test admin.
import { expect, test, type Page } from '@playwright/test'
import { login } from '../helpers/login'
import { testUsers } from '../helpers/testEnv'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
    await login({ page, user: testUsers.admin })
  })

  test('can navigate to dashboard', async () => {
    await page.goto('/admin')
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible()
  })

  test('lists the seeded services', async () => {
    await page.goto('/admin/collections/services')
    await expect(page.locator('h1', { hasText: 'Services' }).first()).toBeVisible()
    await expect(page.getByText('Visa preparation').first()).toBeVisible()
  })

  test('can open the create view for users', async () => {
    await page.goto('/admin/collections/users/create')
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})

test('rejects a wrong password on the admin login page', async ({ page }) => {
  await page.goto('/admin/login')
  await page.fill('#field-email', testUsers.staff.email)
  await page.fill('#field-password', 'wrong-password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/admin\/login/)
  await expect(page.getByText(/incorrect/i)).toBeVisible()
})
