import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  externalPackages: ["@react-email/render"], 
} as any);