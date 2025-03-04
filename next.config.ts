import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["stunning-acorn-7qp779w4773rr95-3000.app.github.dev", "localhost:3000"],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
