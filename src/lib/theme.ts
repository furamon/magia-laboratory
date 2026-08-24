/**
 * テーマ切替ロジック（data-model.md エンティティ 4）。
 * ライト / ダーク / システムの 3 テーマを適用・判定・永続化する純粋関数群。
 */

/** テーマの値型 */
export type Theme = "light" | "dark" | "system";

/** localStorage の保存キー */
const STORAGE_KEY = "theme";

/**
 * 保存値を検証し、不正値は system にフォールバックする。
 * @param stored - localStorage から読み取った保存値（未保存は null）
 * @returns 検証済みのテーマ値
 */
export function resolveTheme(stored: string | null): Theme {
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "system";
}

/**
 * <html> の dark クラスを付与/除去する。
 * @param theme - 適用するテーマ
 * @param root - 対象の <html> 要素
 * @param media - prefers-color-scheme のメディアクエリ（system 時の判定に使用）
 */
export function applyTheme(
	theme: Theme,
	root: HTMLElement,
	media: MediaQueryList,
): void {
	root.classList.remove("dark");
	if (theme === "dark" || (theme === "system" && media.matches)) {
		root.classList.add("dark");
	}
}

/**
 * localStorage["theme"] を読み込み検証する。
 * @param storage - 読み込み対象の Storage
 * @returns 検証済みのテーマ値（未保存・不正値は system）
 */
export function getStoredTheme(storage: Storage): Theme {
	return resolveTheme(storage.getItem(STORAGE_KEY));
}

/**
 * localStorage["theme"] にテーマを保存する。
 * @param theme - 保存するテーマ
 * @param storage - 保存先の Storage
 */
export function setStoredTheme(theme: Theme, storage: Storage): void {
	storage.setItem(STORAGE_KEY, theme);
}
