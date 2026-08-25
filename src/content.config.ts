import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * カテゴリページのカード（リンクボタン） 1 件のスキーマ。
 * label 必須、href / external / description 任意。
 * カテゴリランディングページ（game / lily / creation / text の index.md）の
 * カード群を構造化して表し、Pages CMS で編集可能にする。
 */
const linkItemSchema = z.object({
	/** カードのボタン表示ラベル */
	label: z.string().min(1),
	/** リンク先 URL（未指定時はリンクなしのラベルのみ表示） */
	href: z.string().optional(),
	/** 外部リンクかどうか（true なら target="_blank" + rel="noopener noreferrer"） */
	external: z.boolean().optional(),
	/** カード下部の説明文（任意） */
	description: z.string().optional(),
});

/**
 * コンテンツコレクション定義。
 * blog / game / creation / lily / text の 5 コレクションを glob() ローダーで管理する。
 * Markdown（.md）を読み込む。
 * スキーマ: title 必須、date / description / category / draft / links 任意（data-model.md エンティティ 5）。
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
			links: z.array(linkItemSchema).optional(),
		}),
	});

export const collections = {
	blog: contentCollection("./src/content/blog"),
	game: contentCollection("./src/content/game"),
	creation: contentCollection("./src/content/creation"),
	lily: contentCollection("./src/content/lily"),
	text: contentCollection("./src/content/text"),
};
