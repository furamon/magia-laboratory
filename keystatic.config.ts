import { collection, config, fields } from "@keystatic/core";

/**
 * Keystatic 設定。
 * blog / game / creation / lily / text の 5 コレクションを GitHub モードで管理する。
 * 各コレクションは共通スキーマ（title / date / description / draft / content）を持つ。
 * 本文は Markdoc（.mdoc）として単一ファイル（frontmatter + 本文）に出力する。
 */
export default config({
	storage: {
		kind: "github",
		repo: "furamon/magia-laboratory",
	},
	collections: {
		blog: collection({
			label: "Blog",
			slugField: "title",
			path: "src/content/blog/**/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				date: fields.date({ label: "Date" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),
		game: collection({
			label: "Game",
			slugField: "title",
			path: "src/content/game/**/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				date: fields.date({ label: "Date" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),
		creation: collection({
			label: "Creation",
			slugField: "title",
			path: "src/content/creation/**/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				date: fields.date({ label: "Date" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),
		lily: collection({
			label: "Lily",
			slugField: "title",
			path: "src/content/lily/**/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				date: fields.date({ label: "Date" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),
		text: collection({
			label: "Text",
			slugField: "title",
			path: "src/content/text/**/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				date: fields.date({ label: "Date" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				content: fields.markdoc({ label: "Content" }),
			},
		}),
	},
});
