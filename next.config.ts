import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mongodb-js/zstd"],
};

export default nextConfig;
