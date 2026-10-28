import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals, ...nextTs,
  // These effects synchronize browser state; the existing app does not use
  // React Compiler. Keep correctness rules while migrating incrementally.
  { rules: { "react-hooks/set-state-in-effect": "off" } },
  { files: ["**/*.cjs", "scripts/**/*.mjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  { files: ["app/global-error.tsx", "app/[[]locale[]]/error.tsx"], rules: { "@next/next/no-html-link-for-pages": "off" } },
  // Server-rendered relative age is evaluated once per ISR render.
  { files: ["components/RatesFreshness.tsx"], rules: { "react-hooks/purity": "off" } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
