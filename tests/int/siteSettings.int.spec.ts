// Site Settings map embed validation, tested through Payload's Local API on the in-memory database.
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

const OFFICIAL_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.8!2d104.92!3d11.57'
const OLD_EMBED_URL = 'https://www.google.com/maps?q=Phnom+Penh&output=embed'

// Expects the save to fail with the map embed error (it is bilingual, so check both languages).
async function expectMapEmbedError(save: Promise<unknown>) {
  await expect(save).rejects.toMatchObject({
    data: {
      errors: [
        expect.objectContaining({
          path: 'mapEmbedUrl',
          message: expect.stringMatching(/Embed a map[\s\S]*ចាប់ផ្តើមដោយ/),
        }),
      ],
    },
  })
}

beforeAll(async () => {
  payload = await getPayload({ config: await config })
})

describe('site settings: map embed URL', () => {
  it('accepts an official Google "Embed a map" link', async () => {
    const result = await payload.updateGlobal({
      slug: 'site-settings',
      data: { mapEmbedUrl: OFFICIAL_EMBED_URL },
    })
    expect(result.mapEmbedUrl).toBe(OFFICIAL_EMBED_URL)
  })

  it('accepts an empty value', async () => {
    const result = await payload.updateGlobal({ slug: 'site-settings', data: { mapEmbedUrl: '' } })
    expect(result.mapEmbedUrl).toBeFalsy()
  })

  it('rejects the old ?output=embed link', async () => {
    await expectMapEmbedError(
      payload.updateGlobal({ slug: 'site-settings', data: { mapEmbedUrl: OLD_EMBED_URL } }),
    )
  })

  it('rejects a pasted <iframe> and other sites', async () => {
    const iframe = `<iframe src="${OFFICIAL_EMBED_URL}" width="600" height="450"></iframe>`
    await expectMapEmbedError(
      payload.updateGlobal({ slug: 'site-settings', data: { mapEmbedUrl: iframe } }),
    )
    await expectMapEmbedError(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { mapEmbedUrl: 'https://example.com/maps/embed?pb=1' },
      }),
    )
  })

  it('keeps an old link that was saved before this rule, and still lets staff save other fields', async () => {
    // Written straight to the database, like data saved before the validation existed.
    await payload.db.updateGlobal({ slug: 'site-settings', data: { mapEmbedUrl: OLD_EMBED_URL } })

    const loaded = await payload.findGlobal({ slug: 'site-settings' })
    expect(loaded.mapEmbedUrl).toBe(OLD_EMBED_URL)

    const saved = await payload.updateGlobal({
      slug: 'site-settings',
      data: { contactPhone: '+85500000000' },
    })
    expect(saved.mapEmbedUrl).toBe(OLD_EMBED_URL)
    expect(saved.contactPhone).toBe('+85500000000')

    // Changing it to another non-official link is still blocked.
    await expectMapEmbedError(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { mapEmbedUrl: 'https://maps.google.com/?q=Phnom+Penh' },
      }),
    )
  })
})
