import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./packages/grpc-service/main.ts",
    "./packages/http/node.ts",
    "./packages/http/bun.ts",
    "./packages/gateway/main.ts",
    "./packages/post-application/main.ts",
    "./packages/user-application/main.ts",
    "./packages/serverless/cloudflare.ts",
  ],
  format: ["esm", "cjs"],
  platform: "node",
  outDir: "dist",
  external: ["zlib", "@grpc/reflection", "@grpc/grpc-js", "pg"],
  bundle: true,
  minify: false,
  banner: {
    js: `
    import { createRequire } from 'module';const require = createRequire(import.meta.url);

    import path from 'node:path';
    import url from 'node:url';

    globalThis.require = createRequire(import.meta.url);
    globalThis.__filename = url.fileURLToPath(import.meta.url);
    globalThis.__dirname = path.dirname(__filename);
    `,
  },
});
