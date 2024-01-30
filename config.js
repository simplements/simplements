import htmlPlugin from "@chialab/esbuild-plugin-html";
import postCssPlugin from "@deanc/esbuild-plugin-postcss";
import autoprefixer from "autoprefixer";

export default {
    entryPoints: ["./src/index.html"],
    treeShaking: true,
    nodePaths: ['node_modules'],
    splitting: true,
    format: 'esm',
    bundle: true,
    outdir: "dist",
    logLevel: 'debug',
    loader:{
        '.component.html': 'text',
        '.html': 'html'
    },
    plugins: [
        htmlPlugin(),
        postCssPlugin({
            plugins: [autoprefixer],
        }),
    ],
}
