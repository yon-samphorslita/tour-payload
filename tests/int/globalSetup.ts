// Starts one throwaway MongoDB for the whole integration test run.
import { MongoMemoryServer } from 'mongodb-memory-server-core'
import type { TestProject } from 'vitest/node'

let mongo: MongoMemoryServer | undefined

export async function setup(project: TestProject) {
  mongo = await MongoMemoryServer.create()
  project.provide('databaseUri', `${mongo.getUri()}mrl-int-test`)
}

export async function teardown() {
  await mongo?.stop()
}

declare module 'vitest' {
  export interface ProvidedContext {
    databaseUri: string
  }
}
