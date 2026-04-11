
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        watch: {
            usePolling: true, // Forces Vite to notice saves even if OS signals fail
        },
        proxy: {
            // This redirects any frontend call to /api over to your Java server
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})



/*
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true, // This forces Vite to check files every X milliseconds
        },
    },
})

 */