import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 1. Mark as external for the high-level builder
  externalPackages: ["@react-email/render"],
  
  build: {
    // 2. Mark as external for the underlying esbuild process
    // This is the "Nuclear" fix for the "Could not resolve" error
    bundle: {
      external: ["@react-email/render"]
    }
  }
} as any);