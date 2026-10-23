import { defineHastPlugin } from "satteri";

/**
 * 外部リンクを新しいタブで開くためのロジック。
 * - `isExternalHref`: href が外部サイト（http / https の絶対 URL）かどうかを判定する純粋関数
 * - `externalLinkAttributes`: <a> 要素に付与すべき属性を算出する純粋関数
 * - `externalLinksPlugin`: Markdown 本文（Content）に適用する Sätteri の HAST プラグイン
 * - `shouldOpenInNewTab`: カテゴリカードのリンクで新規タブ表示するかを判定する純粋関数
 */

/** リンクを新規タブで開く際に必要な rel の値 */
const NEW_TAB_REL_VALUES = ["noopener", "noreferrer"] as const;

/**
 * href がサイト外（http / https の絶対 URL）かどうかを判定する。
 * 相対パス・アンカー・mailto などはサイト内として扱う。
 * @param href - 判定対象の href
 * @returns 外部サイトへのリンクなら true
 */
export function isExternalHref(href: string): boolean {
	return /^https?:\/\//i.test(href);
}

/**
 * 既存の rel（文字列または配列）を配列に正規化する。
 * @param rel - 既存の rel 属性値
 * @returns 正規化後の rel 配列
 */
export function normalizeRel(rel: unknown): string[] {
	if (typeof rel === "string") {
		return rel.split(/\s+/).filter((value) => value.length > 0);
	}
	if (Array.isArray(rel)) {
		return rel.filter((value): value is string => typeof value === "string");
	}
	return [];
}

/**
 * <a> 要素の属性から、付与すべき target / rel を算出する。
 * 既存の rel は保持し、新規タブ用の値だけを重複なく追加する。
 * @param properties - <a> 要素の属性（hast の表現）
 * @returns 付与する属性（外部リンクでなければ undefined）
 */
export function externalLinkAttributes(
	properties: { href?: unknown; rel?: unknown } | undefined,
): { target: string; rel: string[] } | undefined {
	const href = properties?.href;
	if (typeof href !== "string" || !isExternalHref(href)) {
		return undefined;
	}

	const rel = normalizeRel(properties?.rel);
	return {
		target: "_blank",
		rel: [
			...rel,
			...NEW_TAB_REL_VALUES.filter((value) => !rel.includes(value)),
		],
	};
}

/**
 * Markdown 本文の外部リンクを新しいタブで開く Sätteri の HAST プラグイン。
 * astro.config.mjs の `markdown.processor`（`satteri()`）へ渡して使用する。
 */
export const externalLinksPlugin = defineHastPlugin({
	name: "external-links",
	element: {
		/** 対象は <a> 要素のみ */
		filter: ["a"],
		/**
		 * 外部リンクなら target / rel を設定する。
		 * @param node - 走査対象の <a> 要素
		 * @param ctx - 属性操作コンテキスト
		 */
		visit(node, ctx) {
			const attributes = externalLinkAttributes(node.properties);
			if (!attributes) return;
			ctx.setProperty(node, "target", attributes.target);
			ctx.setProperty(node, "rel", attributes.rel);
		},
	},
});

/**
 * カテゴリカードのリンクを新しいタブで開くかどうかを判定する。
 * `external: true` が明示されていれば新規タブ、未指定でも絶対 URL なら新規タブとする。
 * @param link - カードリンク（href / external は任意）
 * @returns 新規タブで開くなら true
 */
export function shouldOpenInNewTab(link: {
	href?: string;
	external?: boolean;
}): boolean {
	if (link.external) return true;
	return link.href !== undefined && isExternalHref(link.href);
}
