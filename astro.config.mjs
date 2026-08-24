// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import UnoCSS from '@unocss/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [svelte(), UnoCSS()]
});
