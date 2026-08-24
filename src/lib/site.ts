/**
 * サイト全体の定数定義。
 * サイトメタ情報・ナビゲーション項目・トップページ用カテゴリリンクを一元管理する（FR-008）。
 */

/** サイトメタ情報（data-model.md エンティティ 1） */
export const SITE = {
	TITLE: "Magia Laboratory",
	DESCRIPTION: "ゲーム攻略、百合作品などのサイト。",
	AUTHOR: "Furamon",
} as const;

/** ナビゲーション項目（data-model.md エンティティ 2）。表示順は配列順を正とする */
export const NAVI = [
	{ href: "/game", label: "Game" },
	{ href: "/lily", label: "Lily" },
	{ href: "/creation", label: "Creation" },
	{ href: "/blog", label: "Diary" },
	{ href: "/rss.xml", label: "RSS" },
] as const;

/**
 * トップページ用カテゴリリンク（data-model.md エンティティ 3）。
 * ヘッダーのナビゲーション項目（NAVI）とは別エンティティとして管理する。
 * external: true のリンクは target="_blank" + rel="noopener noreferrer" で表示する。
 */
export interface TopCategoryLinkItem {
	/** ボタン表示ラベル */
	label: string;
	/** リンク先 URL */
	href: string;
	/** 外部リンクかどうか（true なら target="_blank" + rel="noopener noreferrer"） */
	external?: boolean;
}

export interface TopCategoryLink {
	/** カテゴリ見出し */
	label: string;
	/** カテゴリ内のリンクボタン群 */
	links: TopCategoryLinkItem[];
}

export const TOP_CATEGORY_LINKS: TopCategoryLink[] = [
	{
		label: "Game",
		links: [
			{ label: "PlayGuide", href: "/game/guide" },
			{ label: "PlayDiary", href: "/game/playdiary" },
			{ label: "TalkRoom", href: "/game/talk" },
			{
				label: "GameList",
				href: "https://gamelist.magialabs.blog",
				external: true,
			},
		],
	},
	{
		label: "Creation",
		links: [
			{ label: "Dear Claudias", href: "/creation/dearclaudias" },
			{ label: "Lightning Rubellum", href: "/creation/lightningrubellum" },
		],
	},
	{
		label: "Lily",
		links: [],
	},
	{
		label: "etc.",
		links: [
			{ label: "Infomation", href: "/text/infomation" },
			{ label: "Text", href: "/text" },
			{ label: "Diary", href: "/blog" },
			{ label: "BBS", href: "https://alliera.magialabs.blog/", external: true },
			{
				label: "Mastodon Server",
				href: "https://claudias.magialabs.blog/",
				external: true,
			},
		],
	},
	{
		label: "Some Links",
		links: [
			{
				label: "Pixiv",
				href: "https://www.pixiv.net/users/74381242",
				external: true,
			},
			{
				label: "YouTube",
				href: "https://m.youtube.com/channel/UCmoakOUjAai3AW1d2Ip_wxg",
				external: true,
			},
			{ label: "Github", href: "https://github.com/Furamon", external: true },
			{
				label: "X (Twitter)",
				href: "https://twitter.com/FuramonMagia",
				external: true,
			},
		],
	},
];
