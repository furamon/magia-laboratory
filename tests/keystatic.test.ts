import { describe, expect, it } from 'vitest';
import keystaticConfig from '../keystatic.config';

/**
 * Keystatic 設定（keystatic.config.ts）の検証テスト。
 * 5 コレクション（blog / game / creation / lily / text）が
 * GitHub モード・Markdoc 形式で正しく定義されていることを確認する。
 */

/** 期待するコレクション名（data-model.md エンティティ 5 と一致） */
const EXPECTED_COLLECTIONS = ['blog', 'game', 'creation', 'lily', 'text'] as const;

/** コレクション定義の型（keystaticConfig.collections の要素） */
type Collections = NonNullable<(typeof keystaticConfig)['collections']>;
type CollectionDef = Collections[keyof Collections];

/** 指定したコレクション定義を取得する */
function getCollection(name: (typeof EXPECTED_COLLECTIONS)[number]): CollectionDef {
	const collection = keystaticConfig.collections?.[name];
	if (!collection) {
		throw new Error(`コレクション ${name} が定義されていません`);
	}
	return collection;
}

describe('keystatic.config（Keystatic 設定）', () => {
	it('storage が GitHub モードで furamon/magia-laboratory を指す', () => {
		expect(keystaticConfig.storage).toMatchObject({
			kind: 'github',
			repo: 'furamon/magia-laboratory',
		});
	});

	it('5 コレクション（blog / game / creation / lily / text）が定義されている', () => {
		const collectionNames = Object.keys(keystaticConfig.collections ?? {});
		expect(collectionNames).toEqual(EXPECTED_COLLECTIONS);
	});

	it('各コレクションが Markdoc 本文（contentField: content）を単一ファイルで出力する', () => {
		for (const name of EXPECTED_COLLECTIONS) {
			const collection = getCollection(name);
			expect(collection.format).toMatchObject({ contentField: 'content' });
		}
	});

	it('各コレクションの path が src/content/{collection}/** を指す（サブディレクトリ再帰対応）', () => {
		for (const name of EXPECTED_COLLECTIONS) {
			const collection = getCollection(name);
			expect(collection.path).toBe(`src/content/${name}/**`);
		}
	});

	it('各コレクションのスキーマが title / date / description / draft / content を持つ', () => {
		for (const name of EXPECTED_COLLECTIONS) {
			const collection = getCollection(name);
			const schema = collection.schema as Record<string, unknown>;
			expect(Object.keys(schema)).toEqual([
				'title',
				'date',
				'description',
				'draft',
				'content',
			]);
		}
	});

	it('各コレクションの slugField が title である', () => {
		for (const name of EXPECTED_COLLECTIONS) {
			const collection = getCollection(name);
			expect(collection.slugField).toBe('title');
		}
	});
});
