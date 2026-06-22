import { z } from 'zod'
import { KIT_TAGS } from './tags.mjs'

const Sha256 = z.string().regex(/^[0-9a-f]{64}$/, 'sha256 must be 64 lowercase hex chars')
const Tag = z.enum(KIT_TAGS)

// --- kit.json: metadata, provenance, artifacts, deps (ships to Foundation) ---

// Artifact role — used by jswasm kits to distinguish loader (.cjs/.js) from binary (.wasm).
// Optional: wasi/pyodide artifacts don't carry a role.
const Role = z.enum(['binary', 'loader', 'data', 'worker'])

const Artifact = z.object({
  file: z.string(),
  sha256: Sha256,
  // Distribution pointer: where Foundation downloads the bytes. Deterministic
  // GitHub Release URL (see tooling/lib/release-url.mjs). Optional on skeletons
  // (pre-publish); required-and-verified at publish time (tooling/publish.mjs).
  url: z.string().url().optional(),
  role: Role.optional(),
  wasiTools: z.array(z.string()).optional(),
  multiplexed: z.boolean().optional(),
  stdinAsFile: z.boolean().optional(),
}).strict()

const Provenance = z.object({
  source: z.string(),
  repo: z.string(),
  ref: z.string(),
  license: z.string(),
  buildNote: z.string().optional(),
}).strict()

const Dependency = z.object({
  id: z.string(),
  version: z.string(),
  sha256: Sha256,
}).strict()

// Loader descriptor — required for jswasm kits, describes how the JS glue module
// is loaded and how it supplies the .wasm binary. Mirrors @found/types/kit Loader.
const Loader = z.object({
  entry: z.string(),
  moduleSystem: z.enum(['cjs', 'esm']),
  initStyle: z.enum(['none', 'factory', 'default-init']),
  initExport: z.string().optional(),
  wasmSupply: z.enum(['auto', 'locateFile', 'wasmBinary', 'init-arg']),
  handleAccessor: z.string().optional(),
}).strict()

export const KitJsonSchema = z.object({
  id: z.string(),
  version: z.string(),
  runtime: z.enum(['wasi', 'pyodide', 'jswasm']),
  tags: z.array(Tag).min(1).max(3),
  tier: z.enum(['default', 'library']),
  verified: z.boolean(),
  provenance: Provenance,
  artifacts: z.array(Artifact),
  dependencies: z.array(Dependency),
  loader: Loader.optional(),
}).strict().superRefine((v, ctx) => {
  // a verified kit requires at least one artifact
  if (v.verified === true && v.artifacts.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'a verified kit requires at least one artifact',
      path: ['artifacts'],
    })
  }
  // loader is required iff runtime === 'jswasm'
  if (v.runtime === 'jswasm' && !v.loader) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'jswasm runtime requires a loader block',
      path: ['loader'],
    })
  }
  if (v.runtime !== 'jswasm' && v.loader) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'loader block is only valid for jswasm runtime',
      path: ['loader'],
    })
  }
})

// --- manifest.json: callable surface (strict | loose | callable) + golden ---
const ParamSpec = z.object({
  type: z.string(),
  optional: z.boolean().optional(),
}).passthrough()

const StrictOperation = z.object({
  id: z.string(),
  summary: z.string(),
  tool: z.string().optional(),
  params: z.record(ParamSpec),
  stdinParam: z.string().optional(),
  argsTemplate: z.array(z.string()).optional(),
  output: z.object({ format: z.string() }).passthrough(),
  golden: z.object({ input: z.record(z.any()), expect: z.string() }).strict(),
}).strict()

const StrictManifest = z.object({
  kit: z.string(),
  mode: z.literal('strict'),
  operations: z.array(StrictOperation).min(1),
}).strict()

const LooseManifest = z.object({
  kit: z.string(),
  mode: z.literal('loose'),
  imports: z.array(z.string()).min(1),
  golden: z.object({ code: z.string(), expect: z.string() }).strict(),
}).strict()

// --- callable manifest (jswasm kits) ---
const CallableArg = z.union([
  z.object({ kind: z.literal('scalar'), from: z.string() }).strict(),
  z.object({ kind: z.literal('handle'), factory: z.string(), from: z.string() }).strict(),
])

const CallableOperation = z.object({
  id: z.string(),
  summary: z.string(),
  construct: z.object({ factory: z.string(), from: z.string() }).strict().optional(),
  method: z.string(),
  args: z.array(CallableArg).default([]),
  params: z.record(ParamSpec),
  result: z.object({ kind: z.enum(['string', 'json', 'number', 'boolean']), deterministic: z.boolean() }).strict(),
  golden: z.object({ input: z.record(z.any()), expect: z.string() }).strict(),
}).strict()

const CallableManifest = z.object({
  kit: z.string(),
  mode: z.literal('callable'),
  operations: z.array(CallableOperation).default([]),
  scriptable: z.boolean().default(false),
  scriptGolden: z.object({ script: z.string(), expect: z.string() }).strict().optional(),
}).strict()

// Discriminated union on `mode` — strict-only, loose-only, and callable-only
// fields cannot cross (`.strict()` on each branch rejects foreign keys).
// CRITICAL: z.discriminatedUnion requires raw ZodObject members (not ZodEffects),
// so callable cross-field rules are attached to the union, guarded by mode.
export const ManifestSchema = z.discriminatedUnion('mode', [StrictManifest, LooseManifest, CallableManifest])
  .superRefine((v, ctx) => {
    if (v.mode === 'callable') {
      if (v.scriptable && !v.scriptGolden) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'callable manifest with scriptable:true requires scriptGolden',
          path: ['scriptGolden'],
        })
      }
      if (v.operations.length === 0 && !v.scriptable) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'callable manifest must have at least one operation or be scriptable',
          path: ['operations'],
        })
      }
    }
  })

// --- recipe.json: factory-only build recipe (does NOT ship to Foundation) ---
// `source.url` is free-text provenance and is NOT verified until the build/vendor
// subsystem lands (follow-on); the recorded `sha256` is the integrity anchor.
const BundledWheel = z.object({ file: z.string(), url: z.string(), sha256: Sha256 }).strict()

const PypiVendorRecipe = z.object({
  kit: z.string(),
  track: z.literal('pypi-vendor'),
  source: z.object({ url: z.string(), sha256: Sha256 }).strict(),
  // Exclusive bundled deps (architecture §4.2) — multi-artifact kits record each
  // bundled wheel's provenance here. Optional; absent for single-artifact kits.
  bundled: z.array(BundledWheel).optional(),
}).strict()

const WasiRecipe = z.object({
  kit: z.string(),
  track: z.literal('wasi'),
  source: z.object({ repo: z.string(), ref: z.string() }).strict(),
  build: z.object({
    dockerfile: z.string(),
    args: z.array(z.string()).default([]),
    exclude: z.array(z.string()).default([]), // non-redistributable files (e.g. naview.c)
  }).strict(),
}).strict()

const PyodideNativeRecipe = WasiRecipe.extend({ track: z.literal('pyodide-native') })

// --- jswasm-vendor recipe: prebuilt JS-WASM distribution vendored from npm/CDN ---
const JsWasmVendorRecipe = z.object({
  kit: z.string(),
  track: z.literal('jswasm-vendor'),
  family: z.enum(['emscripten', 'wasm-bindgen']),
  source: z.object({ package: z.string(), version: z.string() }).strict(),
  vendored: z.array(z.object({ file: z.string(), url: z.string(), sha256: Sha256 }).strict()).min(1),
}).strict()

export const RecipeSchema = z.discriminatedUnion('track', [
  PypiVendorRecipe, WasiRecipe, PyodideNativeRecipe, JsWasmVendorRecipe,
])
