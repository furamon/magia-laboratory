import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'
import { rssSchema } from '@astrojs/rss'

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			// Transform string to Date object
			date: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			draft: z.boolean().default(false),
			rssSchema
		})
})

const game = defineCollection({
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string().max(80),
			date: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			draft: z.boolean().default(false),
			rssSchema
		})
})

const lily = defineCollection({
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string().max(80),
			date: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			draft: z.boolean().default(false),
			rssSchema
		})
})

const model = defineCollection({
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string().max(80),
			date: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			draft: z.boolean().default(false),
			rssSchema
		})
})

const text = defineCollection({
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string().max(80),
			date: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			draft: z.boolean().default(false),
			rssSchema
		})
})

export const blogCollections = {
	blog
}

export const gameCollections = {
	game
}

export const lilyCollections = {
	lily
}

export const modelCollections = {
	model
}
export const textCollections = {
	text
}
