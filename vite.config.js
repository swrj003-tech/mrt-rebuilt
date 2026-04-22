import { defineConfig } from 'vite';
import { resolve } from 'path';
 
export default defineConfig({
  root: './',
  base: '/',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        categories: resolve(__dirname, 'categories.html'),
        category: resolve(__dirname, 'category.html'),
        contact: resolve(__dirname, 'contact.html'),
        homeEditoral: resolve(__dirname, 'home-editorial.html'),
      },
    },
  },
  server: {
    host: true,          // Listen on all local IPs
    port: 5174,          // Always use this port
    strictPort: true,    // FAIL instead of jumping to 5174, 5175 etc.
    allowedHosts: true,  // Allow tunnel hosts

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/assets/uploads': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    {
      name: 'admin-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin') {
            res.writeHead(301, { Location: '/admin/' });
            res.end();
          } else {
            next();
          }
        });
      }
    }
  ]
});

