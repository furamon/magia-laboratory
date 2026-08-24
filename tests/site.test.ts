import { describe, expect, it } from 'vitest';
import { NAVI, SITE, TOP_CATEGORY_LINKS } from '../src/lib/site';

/**
 * サイト定数（SITE / NAVI / TOP_CATEGORY_LINKS）の検証テスト。
 * data-model.md エンティティ 1〜3 の検証ルールを確認する。
 */
describe('SITE（エンティティ 1: サイトメタ情報）', () => {
	it('TITLE / DESCRIPTION / AUTHOR がすべて非空文字列である', () => {
		expect(SITE.TITLE).toBe('Magia Laboratory');
		expect(SITE.DESCRIPTION).toBe('ゲーム攻略、百合作品などのサイト。');
		expect(SITE.AUTHOR).toBe('Furamon');
		expect(SITE.TITLE.length).toBeGreaterThan(0);
		expect(SITE.DESCRIPTION.length).toBeGreaterThan(0);
		expect(SITE.AUTHOR.length).toBeGreaterThan(0);
	});
});

describe('NAVI（エンティティ 2: ナビゲーション項目）', () => {
	it('5 項目が定義順（Game / Lily / Creation / Diary / RSS）で並ぶ', () => {
		expect(NAVI.map((item) => item.label)).toEqual([
			'Game',
			'Lily',
			'Creation',
			'Diary',
			'RSS',
		]);
	});

	it('各項目の href が / で始まる', () => {
		for (const item of NAVI) {
			expect(item.href.startsWith('/')).toBe(true);
		}
	});

	it('各項目のラベルが非空である', () => {
		for (const item of NAVI) {
			expect(item.label.length).toBeGreaterThan(0);
		}
	});

	it('RSS の href が /rss.xml である', () => {
		const rss = NAVI.find((item) => item.label === 'RSS');
		expect(rss?.href).toBe('/rss.xml');
	});
});

describe('TOP_CATEGORY_LINKS（エンティティ 3: トップページ用カテゴリリンク）', () => {
	it('5 カテゴリが定義順（Game / Creation / Lily / etc. / Some Links）で並ぶ', () => {
		expect(TOP_CATEGORY_LINKS.map((category) => category.label)).toEqual([
			'Game',
			'Creation',
			'Lily',
			'etc.',
			'Some Links',
		]);
	});

	it('各カテゴリのラベルが非空である', () => {
		for (const category of TOP_CATEGORY_LINKS) {
			expect(category.label.length).toBeGreaterThan(0);
		}
	});

	it('外部リンクは https:// で始まり、内部リンクは / で始まる', () => {
		for (const category of TOP_CATEGORY_LINKS) {
			for (const link of category.links) {
				expect(link.label.length).toBeGreaterThan(0);
				if (link.external) {
					expect(link.href.startsWith('https://')).toBe(true);
				} else {
					expect(link.href.startsWith('/')).toBe(true);
				}
			}
		}
	});

	it('Game カテゴリのリンクが定義値どおりである', () => {
		const game = TOP_CATEGORY_LINKS.find((c) => c.label === 'Game');
		expect(game?.links.map((l) => l.label)).toEqual([
			'PlayGuide',
			'PlayDiary',
			'TalkRoom',
			'GameList',
		]);
		expect(game?.links[0]).toMatchObject({ href: '/game/guide' });
		expect(game?.links[0].external ?? false).toBe(false);
		expect(game?.links[3]).toMatchObject({
			href: 'https://gamelist.magialabs.blog',
			external: true,
		});
	});

	it('Creation カテゴリのリンクが定義値どおりである', () => {
		const creation = TOP_CATEGORY_LINKS.find((c) => c.label === 'Creation');
		expect(creation?.links.map((l) => l.label)).toEqual([
			'Dear Claudias',
			'Lightning Rubellum',
		]);
		expect(creation?.links[0]).toMatchObject({
			href: '/creation/dearclaudias',
		});
		expect(creation?.links[0].external ?? false).toBe(false);
	});

	it('Lily カテゴリはリンクなしのプレースホルダーである', () => {
		const lily = TOP_CATEGORY_LINKS.find((c) => c.label === 'Lily');
		expect(lily?.links).toEqual([]);
	});

	it('etc. カテゴリのリンクが定義値どおりである', () => {
		const etc = TOP_CATEGORY_LINKS.find((c) => c.label === 'etc.');
		expect(etc?.links.map((l) => l.label)).toEqual([
			'Infomation',
			'Text',
			'Diary',
			'BBS',
			'Mastodon Server',
		]);
		expect(etc?.links[3]).toMatchObject({
			href: 'https://alliera.magialabs.blog/',
			external: true,
		});
		expect(etc?.links[4]).toMatchObject({
			href: 'https://claudias.magialabs.blog/',
			external: true,
		});
	});

	it('Some Links カテゴリのリンクが定義値どおりである', () => {
		const someLinks = TOP_CATEGORY_LINKS.find((c) => c.label === 'Some Links');
		expect(someLinks?.links.map((l) => l.label)).toEqual([
			'Pixiv',
			'YouTube',
			'Github',
			'X (Twitter)',
		]);
		expect(someLinks?.links[0]).toMatchObject({
			href: 'https://www.pixiv.net/users/74381242',
			external: true,
		});
		expect(someLinks?.links[3]).toMatchObject({
			href: 'https://twitter.com/FuramonMagia',
			external: true,
		});
	});
});
