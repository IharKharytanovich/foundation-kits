import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { generateDispatch } from './gen-dispatch.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const realTools = JSON.parse(readFileSync(join(__dirname, 'tools.json'), 'utf8'))

describe('generateDispatch', () => {
  const twoTools = [
    { name: 'RNAfold', source: 'src/bin/RNAfold.c' },
    { name: 'RNAeval', source: 'src/bin/RNAeval.c' },
  ]

  it('emits strcmp routing for each tool', () => {
    const src = generateDispatch(twoTools)
    expect(src).toContain('strcmp(argv[1], "RNAfold")')
    expect(src).toContain('return RNAfold_main(argc - 1, argv + 1);')
    expect(src).toContain('strcmp(argv[1], "RNAeval")')
    expect(src).toContain('return RNAeval_main(argc - 1, argv + 1);')
  })

  it('emits forward declarations for each tool', () => {
    const src = generateDispatch(twoTools)
    expect(src).toContain('int RNAfold_main(int, char **);')
    expect(src).toContain('int RNAeval_main(int, char **);')
  })

  it('emits argc < 2 fallback that returns non-zero', () => {
    const src = generateDispatch(twoTools)
    expect(src).toMatch(/argc\s*<\s*2/)
    expect(src).toContain('return 1;')
  })

  it('includes required headers', () => {
    const src = generateDispatch(twoTools)
    expect(src).toContain('#include <string.h>')
    expect(src).toContain('#include <stdio.h>')
  })

  it('emits unknown-tool fallback to stderr', () => {
    const src = generateDispatch(twoTools)
    // After all strcmp branches, there should be a fallback writing to stderr
    expect(src).toContain('stderr')
  })

  it('produces 25 routing calls for the real tools.json', () => {
    const src = generateDispatch(realTools)
    const matches = src.match(/_main\(argc - 1, argv \+ 1\)/g)
    expect(matches).toHaveLength(25)
  })

  it('produces 25 unique forward declarations for the real tools.json', () => {
    const src = generateDispatch(realTools)
    const decls = src.match(/int \w+_main\(int, char \*\*\);/g)
    expect(decls).toHaveLength(25)
    expect(new Set(decls).size).toBe(25)
  })

  it('lists all 25 tool names in the usage message', () => {
    const src = generateDispatch(realTools)
    for (const tool of realTools) {
      // Each tool name should appear in the usage/stderr output
      expect(src).toContain(`"${tool.name}"`)
    }
  })
})
