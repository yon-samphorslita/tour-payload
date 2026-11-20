// Starts Payload on a throwaway in-memory MongoDB for e2e tests. Usage: npm run test:server
// The frontends' Playwright configs start this too, so all three repos test against the same dummy backend.
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { MongoMemoryServer } from 'mongodb-memory-server-core'
import {
  assertLocalTestDatabase,
  TEST_BACKEND_PORT,
  TEST_ENQUIRY_API_KEY,
} from '../tests/helpers/testEnv'

// Runs an npm script with the test env and resolves when it exits successfully.
function runNpmScript(args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', ...args], { stdio: 'inherit', env })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`npm run ${args.join(' ')} failed with exit code ${code}`))
    })
  })
}

async function main() {
  const mongo = await MongoMemoryServer.create()
  // The seed script only accepts database names containing "test".
  const databaseUri = `${mongo.getUri()}mrl-e2e-test`
  assertLocalTestDatabase(databaseUri)

  // Values set here win over .env, so the real database and buckets are never used.
  const testEnv: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URI: databaseUri,
    PAYLOAD_SECRET: randomBytes(32).toString('hex'),
    ENQUIRY_API_KEY: TEST_ENQUIRY_API_KEY,
    S3_ADMIN_BUCKET: 'test-disabled',
    S3_WEBSITE_BUCKET: 'test-disabled',
    S3_ENDPOINT: 'http://127.0.0.1:9',
    S3_ACCESS_KEY_ID: 'test-disabled',
    S3_SECRET_ACCESS_KEY: 'test-disabled',
    // Separate build folder, so this can run next to your normal `npm run dev`.
    NEXT_DIST_DIR: '.next-test',
  }

  console.log('[test-server] Seeding website content and test users...')
  await runNpmScript(['seed'], testEnv)
  await runNpmScript(['payload', '--', 'run', 'tests/helpers/seedTestUsers.ts'], testEnv)

  console.log(`[test-server] Starting Payload on port ${TEST_BACKEND_PORT}...`)
  const devServer = spawn('npm', ['run', 'dev', '--', '--port', String(TEST_BACKEND_PORT)], {
    stdio: 'inherit',
    env: testEnv,
  })

  // Stop the database when the server stops, or when Playwright stops us.
  const shutDown = async () => {
    devServer.kill('SIGTERM')
    await mongo.stop()
    process.exit(0)
  }
  process.on('SIGINT', shutDown)
  process.on('SIGTERM', shutDown)
  devServer.on('exit', shutDown)
}

main().catch((error) => {
  console.error('[test-server]', error)
  process.exit(1)
})
