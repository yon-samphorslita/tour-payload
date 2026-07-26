import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Sales } from './collections/Sales'
import { Purchases } from './collections/Purchases'
import { Destinations } from './collections/Destinations'
import { Services } from './collections/Services'
import { RecordMedia } from './collections/RecordMedia'
import { Clients } from './collections/Clients'
import { ExchangeRates } from './collections/ExchangeRates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Admin',
    },
    components: {
      graphics: {
        Logo: '@/components/Logo#Logo',
        Icon: '@/components/Icon#Icon',
      },
    },
  },

  collections: [
    Users,
    Media,
    Sales,
    Destinations,
    RecordMedia,
    Purchases,
    Services,
    Clients,
    ExchangeRates,
  ],

  // Lightweight endpoint for keep-alive pings (no auth, no DB query)
  // so Render's free tier doesn't spin the service down between logins.
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async () => {
        return Response.json({ status: 'ok' })
      },
    },
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  sharp,

  plugins: [
    s3Storage({
      alwaysInsertFields: true,
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true,
      },
    }),
  ],
})
