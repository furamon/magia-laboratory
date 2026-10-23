// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import UnoCSS from '@unocss/astro';
import node from '@astrojs/node';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinksPlugin } from './src/lib/external-links.ts';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [svelte(), UnoCSS()],
  markdown: {
    // Markdown 本文の外部リンクを新しいタブで開く（Sätteri の HAST プラグイン）
    processor: satteri({ hastPlugins: [externalLinksPlugin] }),
  },
});
