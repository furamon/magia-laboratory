/**
 * 検索一覧ロジック。
 * 全コレクションの公開エントリから検索モーダル用の一覧を生成する純粋関数。
 * キーワード検索ロジックは仕様範囲外のため実装しない（YAGNI）。
 */

/** 検索一覧の 1 件 */
export interface SearchIndexEntry {
	/** エントリの URL（/{collection}/{id} 形式） */
	url: string;
	/** エントリのタイトル */
	title: string;
	/** エントリの説明文（任意） */
	description?: string;
	/** 所属コレクション名 */
	collection: string;
}

/** buildSearchIndex の入力コレクション型 */
export interface SearchIndexCollection {
	/** コレクション名 */
	name: string;
	/** コレクションのエントリ一覧 */
	entries: {
		/** エントリ ID */
		id: string;
		/** エントリのメタデータ */
		data: {
			title: string;
			description?: string;
			draft?: boolean;
		};
	}[];
}

/**
 * 全コレクションの公開エントリから検索一覧を生成する。
 * draft: true のエントリは除外し、URL を /{collection}/{id} 形式に整形する。
 * @param collections - 検索対象のコレクション群
 * @returns 検索一覧（公開エントリのみ）
 */
export function buildSearchIndex(
	collections: SearchIndexCollection[],
): SearchIndexEntry[] {
	return collections.flatMap((collection) =>
		collection.entries
			.filter((entry) => !entry.data.draft)
			.map((entry) => ({
				url: `/${collection.name}/${entry.id}`,
				title: entry.data.title,
				...(entry.data.description
					? { description: entry.data.description }
					: {}),
				collection: collection.name,
			})),
	);
}
