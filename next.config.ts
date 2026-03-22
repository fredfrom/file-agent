import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "just-bash",
    "bash-tool",
    "exceljs",
    "@mongodb-js/zstd",
    "node-liblzma",
    "quickjs-emscripten",
    "@jitl/quickjs-wasmfile-release-sync",
    "@jitl/quickjs-wasmfile-release-asyncify",
    "@jitl/quickjs-wasmfile-debug-sync",
    "@jitl/quickjs-wasmfile-debug-asyncify",
  ],
};

export default nextConfig;
