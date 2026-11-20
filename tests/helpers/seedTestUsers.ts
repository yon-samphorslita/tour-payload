// Creates the admin, staff and tax test users. Run by scripts/test-server.ts via `payload run`.
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { assertLocalTestDatabase, testUsers } from './testEnv'

assertLocalTestDatabase(process.env.DATABASE_URI)

const payload = await getPayload({ config })

for (const user of Object.values(testUsers)) {
  await payload.create({ collection: 'users', data: { ...user } })
  payload.logger.info(`Test user created: ${user.email}`)
}
