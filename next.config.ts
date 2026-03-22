import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "just-bash",
    "bash-tool",
    "pdf-parse",
    "pdfjs-dist",
    "@mongodb-js/zstd",
    "@napi-rs/canvas",
    "node-liblzma",
    "quickjs-emscripten",
    "@jitl/quickjs-wasmfile-release-sync",
    "@jitl/quickjs-wasmfile-release-asyncify",
    "@jitl/quickjs-wasmfile-debug-sync",
    "@jitl/quickjs-wasmfile-debug-asyncify",
    "exceljs",
  ],
};

export default nextConfig;
