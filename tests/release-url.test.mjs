import { describe, it, expect } from 'vitest'
import { artifactUrl, RELEASE_BASE } from '../tooling/lib/release-url.mjs'

describe('artifactUrl', () => {
  it('builds the GitHub Release download URL from id, version and file', () => {
    expect(artifactUrl('numpy', '2.2.5', 'artifacts/numpy-2.2.5-cp313.whl')).toBe(
      `${RELEASE_BASE}/numpy@2.2.5/numpy-2.2.5-cp313.whl`,
    )
  })

  it('uses only the basename of the artifact file', () => {
    expect(artifactUrl('seqtk', '1.4', 'artifacts/seqtk.wasm')).toBe(
      `${RELEASE_BASE}/seqtk@1.4/seqtk.wasm`,
    )
  })

  it('handles hyphenated ids', () => {
    expect(artifactUrl('scikit-learn', '1.5.0', 'artifacts/sk.whl')).toBe(
      `${RELEASE_BASE}/scikit-learn@1.5.0/sk.whl`,
    )
  })

  it('RELEASE_BASE is the foundation-kits releases endpoint', () => {
    expect(RELEASE_BASE).toMatch(/^https:\/\/github\.com\/.+\/foundation-kits\/releases\/download$/)
  })
})
