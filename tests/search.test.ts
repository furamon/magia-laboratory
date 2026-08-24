import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from '../src/lib/search';

/**
 * 検索一覧ロジック（src/lib/search.ts）の検証テスト。
 * contracts/components.md の buildSearchIndex シグネチャに従う。
 */

/** テスト用のコレクション入力を作成する */
function createCollections() {
	return [
		{
			name: 'blog',
			entries: [
				{ id: 'post-1', data: { title: '日記1', description: '説明1' } },
				{ id: 'draft-post', data: { title: '下書き', draft: true } },
			],
		},
		{
			name: 'game',
			entries: [
				{ id: 'guide', data: { title: '攻略', description: '攻略メモ' } },
			],
		},
	];
}

describe('buildSearchIndex（検索一覧の生成）', () => {
	it('全コレクションの公開エントリから一覧を生成する', () => {
		const index = buildSearchIndex(createCollections());
		expect(index).toHaveLength(2);
		expect(index[0]).toMatchObject({
			url: '/blog/post-1',
			title: '日記1',
			description: '説明1',
			collection: 'blog',
		});
		expect(index[1]).toMatchObject({
			url: '/game/guide',
			title: '攻略',
			description: '攻略メモ',
			collection: 'game',
		});
	});

	it('draft: true のエントリを除外する', () => {
		const index = buildSearchIndex(createCollections());
		expect(index.some((entry) => entry.title === '下書き')).toBe(false);
	});

	it('URL を /{collection}/{id} 形式に整形する', () => {
		const index = buildSearchIndex(createCollections());
		expect(index[0].url).toBe('/blog/post-1');
		expect(index[1].url).toBe('/game/guide');
	});

	it('description が無いエントリは description を省略する', () => {
		const index = buildSearchIndex([
			{
				name: 'text',
				entries: [{ id: 'note', data: { title: 'メモ' } }],
			},
		]);
		expect(index[0]).toMatchObject({ url: '/text/note', title: 'メモ' });
		expect(index[0].description).toBeUndefined();
	});

	it('空のコレクション群では空配列を返す', () => {
		expect(buildSearchIndex([])).toEqual([]);
	});

	it('空のコレクションは一覧に含めない', () => {
		const index = buildSearchIndex([
			{ name: 'blog', entries: [] },
			{ name: 'game', entries: [{ id: 'x', data: { title: 'X' } }] },
		]);
		expect(index).toHaveLength(1);
		expect(index[0].url).toBe('/game/x');
	});
});
