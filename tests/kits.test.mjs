import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'
import { sha256File } from '../tooling/lib/sha256.mjs'

const KIT_DIR = 'kit'
const kitIds = readdirSync(KIT_DIR).filter((d) => statSync(join(KIT_DIR, d)).isDirectory())

describe('seed kits', () => {
  it('discovers the 4 seed kits', () => {
    expect(kitIds.sort()).toEqual(['numpy', 'scipy', 'seqtk', 'sympy'])
  })

  for (const id of kitIds) {
    describe(id, () => {
      const dir = join(KIT_DIR, id)
      const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
      const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))

      it('kit.json matches schema', () => {
        const r = KitJsonSchema.safeParse(kit)
        expect(r.success, JSON.stringify(r.error?.issues)).toBe(true)
      })

      it('kit.json id equals folder name', () => {
        expect(kit.id).toBe(id)
      })

      it('manifest.json matches schema and references this kit', () => {
        const r = ManifestSchema.safeParse(manifest)
        expect(r.success, JSON.stringify(r.error?.issues)).toBe(true)
        expect(manifest.kit).toBe(id)
      })

      it('recipe.json matches schema and references this kit', () => {
        const recipePath = join(dir, 'recipe.json')
        expect(existsSync(recipePath), 'recipe.json missing').toBe(true)
        const recipe = JSON.parse(readFileSync(recipePath, 'utf8'))
        const r = RecipeSchema.safeParse(recipe)
        expect(r.success, JSON.stringify(r.error?.issues)).toBe(true)
        expect(recipe.kit).toBe(id)
      })

      it('consumer files LICENSE + instruction.md exist', () => {
        expect(existsSync(join(dir, 'LICENSE'))).toBe(true)
        expect(existsSync(join(dir, 'instruction.md'))).toBe(true)
      })

      for (const art of kit.artifacts) {
        it(`artifact ${art.file} integrity (sha256)`, async () => {
          const path = join(dir, art.file)
          if (!existsSync(path)) return // gitignored on fresh clone — integrity runs where bytes exist
          expect(await sha256File(path)).toBe(art.sha256)
        })
      }
    })
  }
})
