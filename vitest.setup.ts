// Points Payload at the in-memory test database. .env is deliberately not loaded here.
import { inject } from 'vitest'
import { assertLocalTestDatabase, TEST_ENQUIRY_API_KEY } from './tests/helpers/testEnv'

process.env.DATABASE_URI = inject('databaseUri')
process.env.PAYLOAD_SECRET = 'integration-test-secret'
process.env.ENQUIRY_API_KEY = TEST_ENQUIRY_API_KEY

assertLocalTestDatabase(process.env.DATABASE_URI)
