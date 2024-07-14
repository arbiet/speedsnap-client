import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve('C:/laragon/etc/ssl/laragon.key')), 
      cert: fs.readFileSync(path.resolve('C:/laragon/etc/ssl/laragon.crt'))
    },
    proxy: {
      '/api': {
        target: 'https://speedsnap.my.id/',
        // target: 'http://127.0.0.1:8000',
        changeOrigin:true,
        headers: {
          Accept: 'application/json',
          "Content-Type": 'application/json',
        }
      }
    }
  }
})
