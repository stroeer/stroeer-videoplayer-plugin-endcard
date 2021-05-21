import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import { visualizer } from 'rollup-plugin-visualizer'
import scss from 'rollup-plugin-scss'

export default [{
  input: 'src/plugin.ts',
  output: {
    file: 'dist/stroeerVideoplayer-endcard-plugin.umd.js',
    exports: 'default',
    format: 'umd',
    name: 'StroeerVideoplayerEndcardPlugin',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    typescript(),
    json(),
    svg(),
    scss({
      output: 'dist/stroeerVideoplayer-endcard-plugin.min.css',
      outputStyle: 'compressed'
    }),
    visualizer()
  ]
}]
