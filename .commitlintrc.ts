import type { UserConfig } from "@commitlint/types";

const commitlintConfig: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [
      2,
      "always",
      [
        "sentence-case",
        "start-case",
        "pascal-case",
        "upper-case",
        "lower-case",
      ],
    ],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "release",
      ],
    ],
    "scope-enum": [
      1,
      "always",
      [
        "bun",
        "node",
        "common",
        "core",
        "graphql",
        "apollo",
        "microservice",
        "deno",
      ],
    ],
  },
};

export default commitlintConfig;
