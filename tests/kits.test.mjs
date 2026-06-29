import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'
import { sha256File } from '../tooling/lib/sha256.mjs'
import { artifactUrl } from '../tooling/lib/release-url.mjs'

const KIT_DIR = 'kit'
const kitIds = readdirSync(KIT_DIR).filter((d) => statSync(join(KIT_DIR, d)).isDirectory())

const KNOWN_PYODIDE_WASI = [
  'arviz', 'ase', 'astropy', 'autograd', 'basis-set-exchange', 'bedtools', 'biopython', 'casadi', 'cclib', 'chaospy', 'chempy', 'cirq', 'control', 'cvxpy', 'deap',
  'decorator', 'dendropy', 'diffraction', 'dill', 'dynesty', 'earcut', 'edlib', 'emcee', 'fasttree',
  'fdtd', 'findiff', 'flint', 'fluids', 'freesasa', 'galpy', 'igraph', 'impedance', 'ikpy', 'iminuit', 'intervaltree', 'joblib', 'lifelines', 'lmfit', 'mendeleev', 'minimap2',
  'molmass', 'networkx', 'nmrglue', 'numpy', 'olll', 'packaging', 'pandas', 'particle', 'periodictable',
  'pint', 'pot', 'prysm', 'pybaselines', 'pyfaidx', 'pygsp', 'pyhf', 'pymap3d', 'pyproj', 'pyrodigal', 'pyteomics', 'pythtb', 'pytz', 'pywavelets', 'pyyaml', 'raytracing', 'ripser', 'salib', 'samtools',
  'scikit-fem', 'scikit-image', 'scikit-learn', 'scikit-optimize', 'scikit-rf', 'scipy', 'selfies',
  'seqtk', 'setuptools', 'sgp4', 'six', 'skyfield', 'spglib', 'statsmodels', 'sympy', 'thermo',
  'tifffile', 'trimesh', 'uncertainties', 'vector', 'viennarna', 'z3',
]

const KNOWN_JSWASM = [
  'coolprop', 'eigen', 'gemmi', 'geodesy', 'geos', 'gmp', 'highs-js', 'kalign', 'manifold', 'meshoptimizer', 'pari', 'rapier2d', 'rapier3d', 'rdkit',
]

describe('seed kits', () => {
  it('kit dirs are all within the known sets and include the seeds', () => {
    expect(new Set(KNOWN_PYODIDE_WASI).size).toBe(90)
    expect(new Set(KNOWN_JSWASM).size).toBe(14)
    expect(kitIds.every((id) => KNOWN_PYODIDE_WASI.includes(id) || KNOWN_JSWASM.includes(id))).toBe(true)
    expect(['numpy', 'scipy', 'seqtk', 'sympy'].every((id) => kitIds.includes(id))).toBe(true)
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

      if (kit.verified) {
        it('every artifact carries the correct distribution url', () => {
          for (const art of kit.artifacts) {
            expect(art.url, `${art.file} missing url`).toBe(artifactUrl(kit.id, kit.version, art.file))
          }
        })
      }

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
