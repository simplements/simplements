import esbuild from 'esbuild';
import config from './config.js';
import process from 'process';

const isDev = process.argv.some((e) => e === '--serve');

if (isDev) {
  const buildContext = await esbuild.context(config);
  await buildContext.serve({
    port: 3000,
    host: 'localhost',
    servedir: './dist',
    fallback: 'index.html',
  });
} else {
  await esbuild.build(config);
}
