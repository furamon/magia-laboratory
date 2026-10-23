import { markdownToHtml } from 'satteri';
import { describe, expect, it } from 'vitest';
import {
	externalLinkAttributes,
	externalLinksPlugin,
	isExternalHref,
	normalizeRel,
	shouldOpenInNewTab,
} from '../src/lib/external-links';

/**
 * 外部リンクの新規タブ表示ロジック（src/lib/external-links.ts）の検証テスト。
 * Markdown 由来の <a>（Sätteri の HAST プラグイン）とカードリンクの両方で
 * target="_blank" + rel が付くことを確認する。
 */

/** テスト用の属性オブジェクトを作成する */
function props(href?: unknown, rel?: unknown): { href?: unknown; rel?: unknown } {
	const properties: { href?: unknown; rel?: unknown } = {};
	if (href !== undefined) properties.href = href;
	if (rel !== undefined) properties.rel = rel;
	return properties;
}

describe('isExternalHref（外部 URL 判定）', () => {
	it('http / https の絶対 URL を外部と判定する', () => {
		expect(isExternalHref('https://example.com/')).toBe(true);
		expect(isExternalHref('http://example.com/a/b')).toBe(true);
		expect(isExternalHref('HTTPS://EXAMPLE.COM')).toBe(true);
	});

	it('サイト内の相対リンク・アンカー・mailto は外部ではない', () => {
		expect(isExternalHref('/game/guide')).toBe(false);
		expect(isExternalHref('#section')).toBe(false);
		expect(isExternalHref('mailto:furamon@example.com')).toBe(false);
		expect(isExternalHref('example.com')).toBe(false);
	});
});

describe('normalizeRel（rel 属性の正規化）', () => {
	it('未指定・非文字列の要素は除外する', () => {
		expect(normalizeRel(undefined)).toEqual([]);
		expect(normalizeRel(123)).toEqual([]);
		expect(normalizeRel(['noopener', 1, null])).toEqual(['noopener']);
	});

	it('文字列の rel を空白区切りで配列にする', () => {
		expect(normalizeRel('nofollow  external')).toEqual(['nofollow', 'external']);
	});
});

describe('externalLinkAttributes（新規タブ用属性の算出）', () => {
	it('外部リンクには target と rel を返す', () => {
		expect(externalLinkAttributes(props('https://example.com/'))).toEqual({
			target: '_blank',
			rel: ['noopener', 'noreferrer'],
		});
	});

	it('内部リンク・href なし・href が文字列以外なら undefined を返す', () => {
		expect(externalLinkAttributes(props('/game/guide'))).toBeUndefined();
		expect(externalLinkAttributes(props())).toBeUndefined();
		expect(externalLinkAttributes(props(42))).toBeUndefined();
		expect(externalLinkAttributes(undefined)).toBeUndefined();
	});

	it('既存の rel を保持したまま noopener / noreferrer を重複なく追加する', () => {
		expect(externalLinkAttributes(props('https://example.com/', 'nofollow'))).toEqual({
			target: '_blank',
			rel: ['nofollow', 'noopener', 'noreferrer'],
		});
		expect(
			externalLinkAttributes(props('https://example.com/', ['noopener', 'external'])),
		).toEqual({
			target: '_blank',
			rel: ['noopener', 'external', 'noreferrer'],
		});
	});
});

describe('externalLinksPlugin（Sätteri の HAST プラグイン）', () => {
	it('a 要素のみを対象にする', () => {
		expect(externalLinksPlugin.name).toBe('external-links');
		expect(externalLinksPlugin.element.filter).toEqual(['a']);
	});

	it('Markdown 本文の外部リンクだけを新しいタブで開く HTML を生成する', () => {
		const html = renderMarkdown(
			'[外部](https://example.com/a) [内部](/game/guide) [アンカー](#section)',
		);
		expect(html).toContain(
			'<a href="https://example.com/a" target="_blank" rel="noopener noreferrer">外部</a>',
		);
		expect(html).toContain('<a href="/game/guide">内部</a>');
		expect(html).toContain('<a href="#section">アンカー</a>');
	});

	it('タイトル付きリンクでも target / rel を付与し、既存属性を保つ', () => {
		const html = renderMarkdown('[外部](https://example.com "タイトル")');
		expect(html).toContain(
			'<a href="https://example.com" title="タイトル" target="_blank" rel="noopener noreferrer">外部</a>',
		);
	});
});

/**
 * Sätteri で Markdown を HTML に変換する（プラグインの実挙動の検証用）。
 * @param markdown - 変換対象の Markdown
 * @returns 変換後の HTML
 */
function renderMarkdown(markdown: string): string {
	return markdownToHtml(markdown, { hastPlugins: [externalLinksPlugin] }).html;
}

describe('shouldOpenInNewTab（カードリンクの新規タブ判定）', () => {
	it('external: true のリンクを新規タブにする', () => {
		expect(shouldOpenInNewTab({ href: '/internal', external: true })).toBe(true);
	});

	it('external 未指定でも絶対 URL なら新規タブにする', () => {
		expect(shouldOpenInNewTab({ href: 'https://example.com/' })).toBe(true);
	});

	it('サイト内リンクは同一タブのまま', () => {
		expect(shouldOpenInNewTab({ href: '/game/guide' })).toBe(false);
		expect(shouldOpenInNewTab({})).toBe(false);
	});
});
