import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * コンテンツコレクション定義。
 * blog / game / creation / lily / text の 5 コレクションを glob() ローダーで管理する。
 * Markdown（.md）を読み込む。
 * スキーマ: title 必須、date / description / category / draft 任意（data-model.md エンティティ 5）。
 * base を各コレクションのディレクトリに設定し、エントリ ID がコレクション相対になるようにする。
 */
const contentCollection = (base: string) =>
	defineCollection({
		loader: glob({ pattern: "**/*.md", base }),
		schema: z.object({
			title: z.string().min(1),
			// date は YAML で Date オブジェクトとして解釈される場合があるため、
			// coerce で ISO 文字列に正規化する
			date: z.coerce.string().optional(),
			description: z.string().optional(),
			category: z.string().optional(),
			draft: z.boolean().optional(),
		}),
	});

export const collections = {
	blog: contentCollection("./src/content/blog"),
	game: contentCollection("./src/content/game"),
	creation: contentCollection("./src/content/creation"),
	lily: contentCollection("./src/content/lily"),
	text: contentCollection("./src/content/text"),
};
