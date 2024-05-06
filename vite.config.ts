import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@utils': path.resolve(__dirname, './src/utils')
    } 
  },
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
