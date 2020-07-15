
import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const env = process.env.BUILD || 'development';

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
    env === 'development' ? serve() : null,
    env === 'development' ? livereload() : null,
    babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled' 
    }),
  ],
};