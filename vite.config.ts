import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/osfn1.tele-account-nexus.io/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Use Babel instead of SWC for better Termux compatibility
      jsxRuntime: 'automatic'
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Force pre-bundling of these packages for better compatibility
    include: ['react', 'react-dom']
  },
  esbuild: {
    // Use esbuild for better compatibility with ARM architectures
    target: 'es2020'
  }
}));
