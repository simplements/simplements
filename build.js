import esbuild from "esbuild";
import config from "./config.js";
import process from 'process';

const isDev = process.argv.some((e)=>e==='--serve');
if(isDev){
    esbuild
        .serve({
            port: 3000,
            servedir: "./dist"
        },config)
        .catch((e) => console.error(e.message));
}else{
    esbuild
        .build(config)
        .catch((e) => console.error(e.message));
}
