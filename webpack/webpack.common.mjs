import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: {
    background: join(__dirname, '../src/background.ts'),
    landingpage: join(__dirname, '../src/landingpage.ts'),
    console: join(__dirname, '../src/console.ts'),
    options: join(__dirname, '../src/options.ts'),
    signin: join(__dirname, '../src/signin.ts'),
  },
  output: {
    path: join(__dirname, '../dist'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './images', to: '../dist/images', context: 'public' },
        { from: './options.html', to: '../dist/options.html', context: 'public' },
        { from: './style.css', to: '../dist/style.css', context: 'public' },
        { from: 'manifest.json', to: '../dist/manifest.json', context: 'public' },
      ],
    }),
  ],
};
