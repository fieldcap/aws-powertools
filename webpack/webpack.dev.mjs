import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';
import WebExtPlugin from 'web-ext-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new WebExtPlugin({
      sourceDir: join(__dirname, '../dist'),
      browserConsole: true,
    }),
  ],
});
