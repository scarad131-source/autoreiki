import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  resolve: {
    // Ensure a single React instance is used across the app and all
    // dependencies. Without this, a nested react copy can resolve to null
    // and break hooks ("Cannot read properties of null (reading 'useState')").
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    // Force react and react-dom into the same optimization pass so react-dom's
    // internal React reference matches the app's import (fixes "useState of null").
    include: ['react', 'react-dom']
  }
});