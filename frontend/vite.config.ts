import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@tiptap/extension-placeholder',
      '@tiptap/extension-highlight',
      '@tiptap/extension-underline',
    ],
  },
})
