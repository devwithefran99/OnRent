import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Owners can paste any public image URL (imgbb, Google, etc.).
    // Allow remote images from any https/http host.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
}

export default nextConfig
