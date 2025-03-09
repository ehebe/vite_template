import { resolve } from "path";
import { build, defineConfig } from "vite";
import vitePluginPug from "./plugins/vite-plugin-pug";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

import globule from "globule"
const htmlFiles = globule.find('src/**/*.pug', {
  ignore: [
    'src/**/_*.pug'
  ]
});

export default defineConfig({
  root: "src",
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: false,
      },
    },
    emptyOutDir: true,
    cssCodeSplit: true,
    cssMinify: true,
    target: 'es2015',
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: htmlFiles,
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: (assetInfo) => {
          const { name } = assetInfo
          if (/\.(jpe?g|png|gif|svg)$/.test(name ?? '')) {
            return 'assets/img/[name][extname]';
          }
          if (/\.(woff?2|ttf|otf)$/.test(name ?? '')) {
            return 'assets/fonts/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        manualChunks: {
          vendor: ['lodash']
        },

      },

    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  plugins: [
    obfuscatorPlugin({
      options: {
        debugProtection: true,
      },
    }),
    vitePluginPug({
      build: {
        locals: { hoge: "hoge" },
        options: { pretty: true },
      },
      serve: {
        locals: { hoge: "hoge" },
        options: { pretty: true },
      }
    })],
});
