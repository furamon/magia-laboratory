import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { siteConfig } from '@/site-config'

export async function GET() {
	const posts = [
		...(await getCollection('blog')),
		...(await getCollection('game')),
		...(await getCollection('lily'))
	]

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			...post.data,
			link: `${post.collection}/${post.slug}/`
		}))
	})
}
