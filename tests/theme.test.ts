import { describe, expect, it, vi } from 'vitest';
import {
	applyTheme,
	getStoredTheme,
	resolveTheme,
	setStoredTheme,
} from '../src/lib/theme';

/**
 * テーマ切替ロジック（src/lib/theme.ts）の検証テスト。
 * data-model.md エンティティ 4 の検証ルールを確認する。
 */

/** テスト用のメディアクエリモックを作成する */
function createMediaQuery(matches: boolean): MediaQueryList {
	return {
		matches,
		media: '(prefers-color-scheme: dark)',
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	} as unknown as MediaQueryList;
}

/** classList を持つ最小限の要素モックを作成する（node 環境のため document を使用しない） */
function createRootElement(): HTMLElement {
	const classes = new Set<string>();
	return {
		classList: {
			add: (name: string) => classes.add(name),
			remove: (name: string) => classes.delete(name),
			contains: (name: string) => classes.has(name),
		},
	} as unknown as HTMLElement;
}

/** テスト用の Storage モックを作成する */
function createStorage(initial: Record<string, string> = {}): Storage {
	const store = new Map(Object.entries(initial));
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value);
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => store.clear(),
		key: (index: number) => [...store.keys()][index] ?? null,
		get length() {
			return store.size;
		},
	} as Storage;
}

describe('resolveTheme（保存値の検証）', () => {
	it('有効な 3 値（light / dark / system）をそのまま返す', () => {
		expect(resolveTheme('light')).toBe('light');
		expect(resolveTheme('dark')).toBe('dark');
		expect(resolveTheme('system')).toBe('system');
	});

	it('不正な保存値は system にフォールバックする', () => {
		expect(resolveTheme('blue')).toBe('system');
		expect(resolveTheme('')).toBe('system');
	});

	it('null（未保存）は system を返す', () => {
		expect(resolveTheme(null)).toBe('system');
	});
});

describe('applyTheme（dark クラスの付与/除去）', () => {
	it('dark は html に dark クラスを付与する', () => {
		const root = createRootElement();
		applyTheme('dark', root, createMediaQuery(false));
		expect(root.classList.contains('dark')).toBe(true);
	});

	it('light は dark クラスを除去する', () => {
		const root = createRootElement();
		root.classList.add("dark");
		applyTheme('light', root, createMediaQuery(true));
		expect(root.classList.contains('dark')).toBe(false);
	});

	it('system は OS 設定が dark なら付与する', () => {
		const root = createRootElement();
		applyTheme('system', root, createMediaQuery(true));
		expect(root.classList.contains('dark')).toBe(true);
	});

	it('system は OS 設定が light なら除去する', () => {
		const root = createRootElement();
		root.classList.add("dark");
		applyTheme('system', root, createMediaQuery(false));
		expect(root.classList.contains('dark')).toBe(false);
	});
});

describe('getStoredTheme（localStorage からの読み込み）', () => {
	it('保存値が有効ならその値を返す', () => {
		const storage = createStorage({ theme: 'dark' });
		expect(getStoredTheme(storage)).toBe('dark');
	});

	it('未保存なら system を返す', () => {
		const storage = createStorage();
		expect(getStoredTheme(storage)).toBe('system');
	});

	it('不正な保存値は system にフォールバックする', () => {
		const storage = createStorage({ theme: 'blue' });
		expect(getStoredTheme(storage)).toBe('system');
	});
});

describe('setStoredTheme（localStorage への保存）', () => {
	it('選択したテーマを localStorage["theme"] に保存する', () => {
		const storage = createStorage();
		setStoredTheme('dark', storage);
		expect(storage.getItem('theme')).toBe('dark');
	});

	it('system も保存できる', () => {
		const storage = createStorage();
		setStoredTheme('system', storage);
		expect(storage.getItem('theme')).toBe('system');
	});
});
