import { describe, it, expect } from 'vitest'
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fetchVendor } from '../tooling/fetch-vendor.mjs'

describe('fetchVendor', () => {
	const STUB_BYTES = Buffer.from('hello-wheel')

	function stubFetch(status = 200) {
		let callCount = 0
		const impl = async () => {
			callCount++
			return {
				ok: status >= 200 && status < 300,
				status,
				arrayBuffer: async () => STUB_BYTES.buffer.slice(
					STUB_BYTES.byteOffset,
					STUB_BYTES.byteOffset + STUB_BYTES.byteLength,
				),
			}
		}
		impl.callCount = () => callCount
		return impl
	}

	it('downloads a file into the vendor root', async () => {
		const tmp = mkdtempSync(join(tmpdir(), 'fv-'))
		try {
			const stub = stubFetch()
			const specs = [{ url: 'https://example.com/fake.whl', dest: 'pyodide/fake.whl' }]
			const written = await fetchVendor(specs, { vendorRoot: tmp, fetchImpl: stub })

			expect(written).toHaveLength(1)
			const filePath = join(tmp, 'pyodide', 'fake.whl')
			expect(existsSync(filePath)).toBe(true)
			expect(readFileSync(filePath)).toEqual(STUB_BYTES)
			expect(stub.callCount()).toBe(1)
		} finally {
			rmSync(tmp, { recursive: true, force: true })
		}
	})

	it('skips existing files (idempotent)', async () => {
		const tmp = mkdtempSync(join(tmpdir(), 'fv-'))
		try {
			const stub = stubFetch()
			const specs = [{ url: 'https://example.com/fake.whl', dest: 'pyodide/fake.whl' }]

			// First call — downloads
			await fetchVendor(specs, { vendorRoot: tmp, fetchImpl: stub })
			expect(stub.callCount()).toBe(1)

			// Second call — skips (no additional fetch)
			const written2 = await fetchVendor(specs, { vendorRoot: tmp, fetchImpl: stub })
			expect(stub.callCount()).toBe(1) // unchanged
			expect(written2).toHaveLength(0) // nothing new written
		} finally {
			rmSync(tmp, { recursive: true, force: true })
		}
	})

	it('throws on non-200 response', async () => {
		const tmp = mkdtempSync(join(tmpdir(), 'fv-'))
		try {
			const stub = stubFetch(404)
			const specs = [{ url: 'https://example.com/missing.whl', dest: 'pyodide/missing.whl' }]
			await expect(fetchVendor(specs, { vendorRoot: tmp, fetchImpl: stub }))
				.rejects.toThrow(/404/)
		} finally {
			rmSync(tmp, { recursive: true, force: true })
		}
	})
})
