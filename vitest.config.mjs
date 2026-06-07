import { defineConfig } from 'vitest/config'

// Scope the factory test suite to tests/ only. The nested .claude/orchestrator
// package has its own vitest config and is tested independently.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.mjs'],
    exclude: ['node_modules/**', '.claude/**', 'temp/**'],
  },
})
