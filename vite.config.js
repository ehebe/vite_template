import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import vitePluginPug from "./plugins/vite-plugin-pug";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import tailwindcss from "@tailwindcss/vite";

import globule from "globule";
const htmlFiles = globule.find("src/**/*.pug", {
  ignore: ["src/**/_*.pug"],
});

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [
    visualizer({
      open: mode == "production" ? false : true,
    }),
    vitePluginPug({
      build: {
        locals: {},
        options: { pretty: true },
      },
      serve: {
        locals: {},
        options: { pretty: true },
      },
    }),
    tailwindcss(),
  ];

  if (mode === "production") {
    plugins.push(
      obfuscatorPlugin({
        options: {
          debugProtection: true,
        },
      })
    );
  }
  return {
    root: "src",
    build: {
      minify: mode == "production" ? "terser" : "esbuild",
      terserOptions: {
        module: true,
        format: {
          comments: mode == "production" ? false : true,
        },
        compress: {
          drop_console: mode == "production" ? true : false,
          drop_debugger: false,
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      modulePreload: {
        polyfill: false,
      },
      sourcemap: mode == "production" ? false : true,
      emptyOutDir: true,
      cssCodeSplit: true,
      cssMinify: mode == "production" ? true : false,
      target: "esnext",
      outDir: resolve(__dirname, "dist"),
      rollupOptions: {
        input: htmlFiles,
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: (assetInfo) => {
            const { name } = assetInfo;
            if (/\.(jpe?g|png|gif|svg|ico)$/.test(name ?? "")) {
              return "assets/img/[name][extname]";
            }
            if (/\.(woff?2|ttf|otf)$/.test(name ?? "")) {
              return "assets/fonts/[name][extname]";
            }
            return "assets/[name][extname]";
          },
          manualChunks: (id, { getModuleInfo, getModuleIds }) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
      extensions: [".js", ".ts", ".json", ".pug"],
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    plugins: plugins,
    server: {
      port: 80,
      open: "/pages/index.html",
    },
  };
});
