import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["just-bash", "bash-tool", "@mongodb-js/zstd", "pdf-parse"],
};

export default nextConfig;
