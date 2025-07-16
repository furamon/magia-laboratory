import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { remarkReadingTime } from './src/utils/readTime.ts'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
	site: 'https://magialabs.blog',
	markdown: {
		remarkPlugins: [remarkReadingTime],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true
		}
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight'
				},
				wrap: true
			},
			drafts: true
		}),
		sitemap(),
		tailwindcss(),
		react()
	],
	image: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'assets.tina.io'
			}
		]
	},
	vite: {
		plugins: [tailwindcss()]
	},
	outDir: '/var/www/magia-laboratory'
})
