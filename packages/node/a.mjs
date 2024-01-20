import { rolldown } from './dist/index.mjs'

const bundler = await rolldown({
  input: process.cwd() + '/packages/node/test.js',
})

const { output } = await bundler.generate({
  format: 'esm',
  file: 'test.mjs',
})

console.info(output)
