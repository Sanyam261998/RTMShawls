import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // Accept connections from outside (0.0.0.0)
    port: 5173,           // Ensure this matches your exposed port
    strictPort: true,
    watch: {
      usePolling: true,   // Required for Docker volume watching
    },
  },
});
