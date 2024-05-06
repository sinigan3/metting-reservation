import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  plugins: [react({
    babel: {
      plugins: [
        [
          "@babel/plugin-proposal-decorators",
          { "version": "2023-11" }
        ]
      ]
    }
  })],
})
