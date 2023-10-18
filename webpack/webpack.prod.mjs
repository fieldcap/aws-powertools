import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';
import TerserPlugin from 'terser-webpack-plugin';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        /*
         * Google requires some conditions:
         * - Removal of whitespace, newlines, code comments, and block delimiters
         * - Shortening of variable and function names
         * - Collapsing the number of JavaScript files
         */
        terserOptions: {
          compress: true, // To rename variables & function names
          mangle: true, // Note `mangle.properties` is `false` by default.
        },
      }),
    ],
  },
});
