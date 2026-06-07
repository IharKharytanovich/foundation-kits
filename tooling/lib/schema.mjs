import { z } from 'zod'
import { KIT_TAGS } from './tags.mjs'

const Sha256 = z.string().regex(/^[0-9a-f]{64}$/, 'sha256 must be 64 lowercase hex chars')
const Tag = z.enum(KIT_TAGS)

// --- kit.json: metadata, provenance, artifacts, deps (ships to Foundation) ---
const Artifact = z.object({
  file: z.string(),
  sha256: Sha256,
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

export const KitJsonSchema = z.object({
  id: z.string(),
  version: z.string(),
  runtime: z.enum(['wasi', 'pyodide']),
  tags: z.array(Tag).min(1).max(3),
  tier: z.enum(['default', 'library']),
  verified: z.boolean(),
  provenance: Provenance,
  artifacts: z.array(Artifact).min(1),
  dependencies: z.array(Dependency),
}).strict()

// --- manifest.json: callable surface (strict | loose) + golden ---
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

// Discriminated union on `mode` — strict-only and loose-only fields cannot cross
// (`.strict()` on each branch rejects foreign keys).
export const ManifestSchema = z.discriminatedUnion('mode', [StrictManifest, LooseManifest])

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

export const RecipeSchema = z.discriminatedUnion('track', [
  PypiVendorRecipe, WasiRecipe, PyodideNativeRecipe,
])
