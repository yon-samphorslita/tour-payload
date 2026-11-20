import type { APIRequestContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface LoginOptions {
  page: Page
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 */
export async function login({ page, user }: LoginOptions): Promise<void> {
  await page.goto('/admin/login')

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL('**/admin')

  const dashboardArtifact = page.locator('span[title="Dashboard"]')
  await expect(dashboardArtifact).toBeVisible()
}

/**
 * Logs in through the REST API and returns the JWT for Authorization headers.
 */
export async function getApiToken(
  request: APIRequestContext,
  user: { email: string; password: string },
): Promise<string> {
  const response = await request.post('/api/users/login', {
    data: { email: user.email, password: user.password },
  })
  expect(response.ok()).toBeTruthy()
  const body = (await response.json()) as { token: string }
  return body.token
}
