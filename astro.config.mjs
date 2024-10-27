import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'
import solidJs from '@astrojs/solid-js'
import suidPlugin from '@suid/vite-plugin'
import icon from 'astro-icon'
import solidSvg from 'vite-plugin-solid-svg'

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  output: 'server',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    solidJs(),
    icon({ iconDir: 'src/assets/svg' }),
  ],
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      },
    },
    plugins: [suidPlugin(), solidSvg()],
  },
})
