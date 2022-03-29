import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import { visualizer } from 'rollup-plugin-visualizer'
import scss from 'rollup-plugin-scss'
import pkg from './package.json'

const isDevMode = Boolean(process.env.ROLLUP_WATCH)
console.log('is dev mode', isDevMode)

export default [{
  input: 'src/index.ts',
  output: {
    file: 'dist/stroeerVideoplayer-endcard-plugin.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerEndcardPlugin',
    sourcemap: isDevMode
  },
  plugins: [
    nodeResolve(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg(),
    scss({
      output: 'dist/stroeerVideoplayer-endcard-plugin.min.css',
      outputStyle: 'compressed'
    }),
    visualizer()
  ]
},
{
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: isDevMode
    }
  ],
  plugins: [
    nodeResolve(),
    typescript({
      sourceMap: isDevMode
    }),
    json(),
    svg(),
    scss({
      output: 'dist/stroeerVideoplayer-endcard-plugin.min.css',
      outputStyle: 'compressed'
    })
  ]
}]
