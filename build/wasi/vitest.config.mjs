import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['build/wasi/**/*.test.mjs'],
  },
})
