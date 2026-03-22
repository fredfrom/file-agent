import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["just-bash", "bash-tool", "@mongodb-js/zstd"],
};

export default nextConfig;
