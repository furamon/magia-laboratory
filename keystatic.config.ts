import { collection, config, fields } from "@keystatic/core";

/**
 * 共通コレクションスキーマを生成する（DRY）。
 * title は slug フィールドであり、slug に "/" を含めることでフォルダ階層（例: guide/fireemblem/fe1-darkdragon）を表現できる。
 * @param titleLabel - title フィールドの表示名
 * @returns 共通スキーマオブジェクト
 */
function commonSchema(titleLabel: string) {
	return {
		title: fields.slug({
			name: { label: titleLabel },
			slug: {
				label: "Slug（フォルダ階層）",
				description:
					"例: guide/fireemblem/fe1-darkdragon のように / で区切るとフォルダ階層になります",
			},
		}),
		date: fields.date({ label: "Date" }),
		description: fields.text({
			label: "Description",
			multiline: true,
		}),
		category: fields.text({ label: "Category" }),
		draft: fields.checkbox({ label: "Draft" }),
		content: fields.markdoc({ label: "Content" }),
	};
}

/**
 * Keystatic 設定。
 * blog / game / creation / lily / text の 5 コレクションを GitHub モードで管理する。
 * 各コレクションは共通スキーマ（title / date / description / draft / content）を持つ。
 * 本文は Markdoc（.mdoc）として単一ファイル（frontmatter + 本文）に出力する。
 * path の ** ワイルドカードにより、slug に / を含めるとフォルダ階層として保存できる。
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
			path: "src/content/blog/**",
			format: { contentField: "content" },
			columns: ["category", "title"],
			schema: commonSchema("Title"),
		}),
		game: collection({
			label: "Game",
			slugField: "title",
			path: "src/content/game/**",
			format: { contentField: "content" },
			columns: ["category", "title"],
			schema: commonSchema("Title"),
		}),
		creation: collection({
			label: "Creation",
			slugField: "title",
			path: "src/content/creation/**",
			format: { contentField: "content" },
			columns: ["category", "title"],
			schema: commonSchema("Title"),
		}),
		lily: collection({
			label: "Lily",
			slugField: "title",
			path: "src/content/lily/**",
			format: { contentField: "content" },
			columns: ["category", "title"],
			schema: commonSchema("Title"),
		}),
		text: collection({
			label: "Text",
			slugField: "title",
			path: "src/content/text/**",
			format: { contentField: "content" },
			columns: ["category", "title"],
			schema: commonSchema("Title"),
		}),
	},
});
