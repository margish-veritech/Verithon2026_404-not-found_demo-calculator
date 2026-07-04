import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The vulnerable scientific calculator runs on :3001 so it can coexist with the
// SentinelForge frontend (:3000). Register http://localhost:3001 as a URL target
// for QA/deploy context, or scan the source via a local/GitHub repo target.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
  },
  preview: {
    port: 3001,
  },
});
