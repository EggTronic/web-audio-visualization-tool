
import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'iife',
    name: 'AudioVisualizeTool'
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled' 
    }),
  ],
};