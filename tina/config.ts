import { CATEGORIES } from '../src/data/categories.ts'
import { defineConfig, tinaTableTemplate } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = 'main'

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: '63c34133-8fa0-4cbc-813f-8109618bc0b7',
	// Get this from tina.io
	token: '32ad00fa69dd798e7c07e4664afebeb51ff5ba63',

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
						name: 'pubDate',
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
						name: '_body',
						templates: [tinaTableTemplate]
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
						name: 'pubDate',
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
						name: '_body',
						templates: [tinaTableTemplate]
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
						name: 'pubDate',
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
						name: '_body',
						templates: [tinaTableTemplate]
					}
				]
			},
			{
				name: 'novel',
				label: 'Novel Page',
				path: 'src/content/novel',
				format: 'mdx',
				fields: [
					{
						type: 'datetime',
						name: 'pubDate',
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
						name: '_body',
						templates: [tinaTableTemplate]
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
						name: 'pubDate',
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
						name: '_body',
						templates: [tinaTableTemplate]
					}
				]
			}
		]
	},
	search: {
		tina: {
			indexerToken: '533dbe2444a0bc2fc792614b979725015b934f6f',
			stopwordLanguages: ['jpn']
		},
		indexBatchSize: 100,
		maxSearchIndexFieldLength: 100
	}
})
