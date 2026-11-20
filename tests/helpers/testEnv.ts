// Settings shared by every test run. Tests only ever use a throwaway in-memory MongoDB.

export const TEST_BACKEND_PORT = 3100
export const TEST_BACKEND_URL = `http://localhost:${TEST_BACKEND_PORT}`

// Dummy values for the throwaway database only; never use them on a real server.
export const TEST_ENQUIRY_API_KEY = 'test-enquiry-key-for-e2e-only'

export const testUsers = {
  admin: {
    email: 'admin@example.test',
    password: 'test-admin-password',
    name: 'Test Admin',
    role: 'admin',
  },
  staff: {
    email: 'staff@example.test',
    password: 'test-staff-password',
    name: 'Test Staff',
    role: 'staff',
  },
  tax: { email: 'tax@example.test', password: 'test-tax-password', name: 'Test Tax', role: 'tax' },
} as const

// Stops a test from ever writing to Atlas or any other real database.
export function assertLocalTestDatabase(databaseUri: string | undefined): void {
  if (!databaseUri || !databaseUri.startsWith('mongodb://127.0.0.1:')) {
    throw new Error(
      `Refusing to run tests: DATABASE_URI must be the local in-memory test database.`,
    )
  }
}
