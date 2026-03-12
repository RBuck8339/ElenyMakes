import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  overrides: {
    wrapper: "cloudflare-node", // Ensures it uses Node-compatible bundling
    converter: "edge",
  },
  // We add it to both places to be safe
  externalPackages: ["@react-email/render", "@react-email/components"],
  build: {
    minify: false, // Disabling minify can sometimes reveal the real path error
  }
} as any);