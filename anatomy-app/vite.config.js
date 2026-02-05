import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    publicDir: 'public',
    build: {
        assetsInlineLimit: 0, // Don't inline any assets, keep them as separate files
        rollupOptions: {
            output: {
                manualChunks: undefined,
            }
        }
    }
})
