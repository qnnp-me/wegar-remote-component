import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";

export default defineConfig(({command}) => ({
  publicDir: command === 'build' ? false : 'public',
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      exclude: ['src/main.tsx'],
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  build: {
    lib: {
      name: 'WegarPackageWegarRemoteComponent',
      formats: ['es', 'cjs', 'umd'],
      entry: './src/RemoteComponent.tsx',
      fileName: (format) => {
        if (format === 'es') {
          return 'index.mjs'
        }
        if (format === 'cjs') {
          return 'index.cjs'
        }
        return 'index.js'
      },
    },
    define: {
      'process.env': process.env
    },
    rollupOptions: {
      external: ['react', 'react-dom',],
      output: {
        globals: {
          react: 'WegarPackageReact',
          'react-dom': 'WegarPackageReactDOM',
        },
      },
    },
  }
}))
