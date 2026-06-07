import { describe, it, expect } from 'vitest'
import { KIT_TAGS, isValidTag, validateTags } from '../tooling/lib/tags.mjs'

describe('tags vocabulary', () => {
  it('contains the 29 controlled tags from asset-inventory §7', () => {
    expect(KIT_TAGS).toContain('math')
    expect(KIT_TAGS).toContain('rna')
    expect(KIT_TAGS).toContain('util')
    expect(KIT_TAGS.length).toBe(29)
    expect(new Set(KIT_TAGS).size).toBe(29) // no duplicates
  })

  it('isValidTag accepts known and rejects unknown', () => {
    expect(isValidTag('chemistry')).toBe(true)
    expect(isValidTag('nonsense')).toBe(false)
  })

  it('validateTags requires 1-3 known tags', () => {
    expect(validateTags(['math', 'core']).ok).toBe(true)
    expect(validateTags([]).ok).toBe(false) // too few
    expect(validateTags(['a', 'b', 'c', 'd']).ok).toBe(false) // too many
    expect(validateTags(['math', 'bogus']).ok).toBe(false) // unknown
  })
})
