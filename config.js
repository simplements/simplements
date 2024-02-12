import postCSSPlugin from "esbuild-postcss-plugin";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";
import esbuildPluginInlineImport from 'esbuild-plugin-inline-import'
import postcss from "postcss";
import {parse, parseFragment} from "parse5";
import {parse5JsonTemplateTransformer} from "./parse5-json-template.transformer.js";
const postcssPlugin = postcss([autoprefixer, postcssImport, postcssNesting])
export default {
    entryPoints: ["./src/app.ts", "./src/index.html", "./src/styles.css"],
    treeShaking: true,
    nodePaths: ['node_modules'],
    splitting: true,
    format: 'esm',
    bundle: true,
    outdir: "dist",
    loader: {
        '.component.html': 'text',
        '.html': 'copy',
    },
    logLevel: 'debug',
    plugins: [
        esbuildPluginInlineImport({
            filter: /^css:/,
            transform:(contents, args)=>{
                return postcssPlugin.process(contents).then(e=>e.css);
            }
        }),
        esbuildPluginInlineImport({
            filter: /^html:/,
            transform:(contents)=>{
                return parse5JsonTemplateTransformer(contents);
            }
        }),
        postCSSPlugin({
            plugins: [autoprefixer, postcssImport],
        }),
    ]
}
