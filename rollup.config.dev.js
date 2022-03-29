import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import scss from 'rollup-plugin-scss'

export default [{
  input: 'src/index.ts',
  output: [
    {
      file: 'dev/stroeerVideoplayer-endcard-plugin.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve(),
    typescript(),
    json(),
    svg(),
    scss({
      output: 'dev/stroeerVideoplayer-endcard-plugin.min.css',
      outputStyle: 'compressed',
      sourceMap: true
    })
  ]
},
{
  input: 'dev/dev.js',
  output: [
    {
      file: 'dev/dev.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve(),
    scss({
      output: 'dev/dev.css',
      sourceMap: true
    })
  ]
}]
