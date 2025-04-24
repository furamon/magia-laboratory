import { env } from 'process'
import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main'

export default defineConfig({
	branch,

	clientId: process.env.TINA_CLIENT_ID,
	token: process.env.TINA_TOKEN,

	build: {
		outputFolder: 'admin',
		publicFolder: 'public'
	},
	media: {
		tina: {
			mediaRoot: 'images',
			publicFolder: 'public'
		}
	},
	schema: {
		collections: [
			{
				name: 'post',
				label: 'Blog Post',
				path: 'src/content/blog',
				format: 'mdx',
				fields: [
					{
						type: 'string',
						label: 'description',
						required: true,
						name: 'description',
						description: 'A short description of the post'
					},
					{
						type: 'datetime',
						name: 'date',
						label: 'Publication Date',
						required: true
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'body',
						isBody: true
					}
				]
			},
			{
				name: 'game',
				label: 'Game Page',
				path: 'src/content/game',
				format: 'mdx',
				fields: [
					{
						type: 'datetime',
						name: 'date',
						label: 'Publication Date',
						required: true
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'body',
						isBody: true
					}
				]
			},
			{
				name: 'lily',
				label: 'Lily Page',
				path: 'src/content/lily',
				format: 'mdx',
				fields: [
					{
						type: 'datetime',
						name: 'date',
						label: 'Publication Date',
						required: true
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'body',
						isBody: true
					}
				]
			},
			{
				name: 'model',
				label: 'Model Page',
				path: 'src/content/model',
				format: 'mdx',
				fields: [
					{
						type: 'datetime',
						name: 'date',
						label: 'Publication Date',
						required: true
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'body',
						isBody: true
					}
				]
			},
			{
				name: 'text',
				label: 'Text Page',
				path: 'src/content/text',
				format: 'mdx',
				fields: [
					{
						type: 'datetime',
						name: 'date',
						label: 'Publication Date',
						required: true
					},
					{
						name: 'draft',
						label: 'Draft',
						type: 'boolean',
						description: 'If this is checked the post will not be published'
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Body',
						name: 'body',
						isBody: true
					}
				]
			}
		]
	},
	search: {
		tina: {
			indexerToken: process.env.TINA_INDEXER_TOKEN,
			stopwordLanguages: ['jpn']
		},
		indexBatchSize: 100,
		maxSearchIndexFieldLength: 100
	}
})
