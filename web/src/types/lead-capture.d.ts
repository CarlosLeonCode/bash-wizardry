// Types for @carlosleoncode/lead-capture when the private package is NOT
// installed. TypeScript only falls back to an ambient module declaration when
// the import does not resolve to a real file, so with the package in
// node_modules its own dist/index.d.ts wins and this block is ignored.
// The bundler side of the same fallback is turbopack.resolveAlias in
// next.config.ts.
declare module "@carlosleoncode/lead-capture" {
  export * from "@/lib/lead-capture-fallback";
}
