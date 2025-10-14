import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: "", // ✅ tom base slik at Vercel finner riktige assets
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist", // ✅ sørger for riktig output
    assetsDir: "assets", // ✅ sikrer riktig mappestruktur på Vercel
  },
})
