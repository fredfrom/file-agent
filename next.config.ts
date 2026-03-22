import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["just-bash", "bash-tool", "@mongodb-js/zstd", "pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
