// Minimal Lexical JSON builders for seed content.
const text = (value: string) => ({
  type: 'text',
  text: value,
  version: 1,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
})

const base = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 }

export const p = (value: string) => ({ ...base, type: 'paragraph', textFormat: 0, children: [text(value)] })

export const h2 = (value: string) => ({ ...base, type: 'heading', tag: 'h2', children: [text(value)] })

export const richText = (...children: ReturnType<typeof p | typeof h2>[]) => ({
  root: { ...base, type: 'root', children },
})
