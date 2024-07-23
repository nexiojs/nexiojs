import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  platform: "node",
  outDir: "dist",
  external: ["zlib", "@grpc/proto-loader", "@grpc/grpc-js", "@grpc/reflection"],
  bundle: true,
});
