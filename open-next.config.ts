import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // @ts-ignore - This ignores the error in VS Code and the build
  externalPackages: ["@react-email/render"],
} as any);