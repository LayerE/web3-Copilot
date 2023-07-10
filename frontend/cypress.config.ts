import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
  numTestsKeptInMemory: 1,
  video: false,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})