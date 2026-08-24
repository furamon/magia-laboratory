import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * コンテンツコレクション定義。
 * blog / game / creation / lily / text の 5 コレクションを glob() ローダーで管理する。
 * Keystatic が出力する Markdoc（.mdoc）を読み込む。
 * スキーマ: title 必須、date / description / draft 任意（data-model.md エンティティ 5）。
 */
const contentCollection = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content" }),
	schema: z.object({
		title: z.string().min(1),
		date: z.string().optional(),
		description: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

export const collections = {
	blog: contentCollection,
	game: contentCollection,
	creation: contentCollection,
	lily: contentCollection,
	text: contentCollection,
};
