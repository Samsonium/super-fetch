require('esbuild').buildSync({
    entryPoints: ['src/index.ts'],
    outdir: 'lib',
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    format: 'esm',
    target: ['esnext']
})
