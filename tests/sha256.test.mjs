import { describe, it, expect } from 'vitest'
import { sha256File } from '../tooling/lib/sha256.mjs'
import { existsSync } from 'node:fs'

describe('sha256File', () => {
  it('hashes the seqtk artifact to the value recorded in kit.json', async () => {
    const path = 'kit/seqtk/artifacts/seqtk.wasm'
    if (!existsSync(path)) return // artifact gitignored; skip when absent (CI without artifacts)
    const hex = await sha256File(path)
    expect(hex).toBe('1ebae080b3f36ee28037ab29b1f50d6ce15b32c44633650ec0b422caada1da2a')
  })
})
