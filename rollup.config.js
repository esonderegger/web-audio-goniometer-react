const rollupBabel = require('rollup-plugin-babel');
const rollupUglify = require('rollup-plugin-uglify');

const config = {
  input: 'src/Goniometer.jsx',
  external: ['react'],
  plugins: [
    rollupBabel(),
    rollupUglify.uglify(),
  ],
  output: {
    format: 'umd',
    name: 'Goniometer',
    globals: {
      react: 'React',
    },
  },
};

export default config;
