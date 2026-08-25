<script lang="ts">
import { onMount } from "svelte";
import { SITE } from "../lib/site";
import {
	applyTheme,
	getStoredTheme,
	setStoredTheme,
	type Theme,
} from "../lib/theme";

/**
 * サイト共通フッターコンポーネント。
 * コピーライト、プライバシーポリシーリンク、テーマ切替ボタン（ライト / ダーク / システム）、
 * トップへ戻るボタンを表示する。
 */

/** 現在選択されているテーマ（localStorage の保存値を初期値とする） */
let theme = $state<Theme>("system");

/** 現在の年（コピーライト用） */
const currentYear = new Date().getFullYear();

// localStorage はブラウザ環境でのみ利用可能なため、マウント後に読み込む
// （テーマの初期適用は Layout.astro のインラインスクリプトが担う）
onMount(() => {
	theme = getStoredTheme(localStorage);
});

/**
 * テーマを切り替え、<html> の dark クラスを更新し、localStorage に保存する。
 * @param t - 新しいテーマ
 */
function setTheme(t: Theme) {
	theme = t;
	setStoredTheme(t, localStorage);
	applyTheme(
		t,
		document.documentElement,
		window.matchMedia("(prefers-color-scheme: dark)"),
	);
}

/** ページトップへスムーズにスクロールする */
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<footer class="border-t border-neutral-200 dark:border-neutral-800 py-0">
	<div class="mx-auto max-w-full px-4 py-8">
		<div class="flex flex-wrap items-center justify-between gap-4 text-sm">
			<!-- 左: コピーライト -->
			<div class="flex items-center gap-2 text-neutral-500">
				<span>&copy; {currentYear} {SITE.TITLE}</span>
				<img src="/favicon.svg" alt="favicon" class="h-4 w-4" loading="lazy">
			</div>
			<!-- 中央: プライバシーポリシーリンク -->
			<a
				href="/privacy-policy"
				class="text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
			>
				Privacy Policy
			</a>
			<!-- 右: テーマ切り替え -->
			<div class="flex items-center gap-2">
				<button
					type="button"
					aria-label="Light theme"
					class="rounded-xl py-2 px-3 transition-colors duration-300 {theme === 'light' ? 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					onclick={() => setTheme('light')}
				>
					<svg
						height="24"
						width="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<title>Light theme</title>
						<circle cx="12" cy="12" r="4" />
						<path
							d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
						/>
					</svg>
				</button>
				<button
					type="button"
					aria-label="Dark theme"
					class="rounded-xl py-2 px-3 transition-colors duration-300 {theme === 'dark' ? 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					onclick={() => setTheme('dark')}
				>
					<svg
						height="24"
						width="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<title>Dark theme</title>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				</button>
				<button
					type="button"
					aria-label="System theme"
					class="rounded-xl py-2 px-3 transition-colors duration-300 {theme === 'system' ? 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					onclick={() => setTheme('system')}
				>
					<svg
						height="24"
						width="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<title>System theme</title>
						<rect x="2" y="3" width="20" height="14" rx="2" />
						<path d="M8 21h8M12 17v4" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- ページトップへ戻るボタン -->
	<button
		type="button"
		aria-label="Back to top"
		class="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors duration-300 hover:bg-neutral-100 hover:text-black dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-white"
		onclick={scrollToTop}
	>
		<svg height="20" width="20" viewBox="0 0 20 20" fill="currentColor">
			<title>Back to top</title>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M9.47 5.22a.75.75 0 0 1 1.06 0l5 5a.75.75 0 1 1-1.06 1.06L10 6.81l-4.47 4.47a.75.75 0 0 1-1.06-1.06l5-5Z"
			/>
		</svg>
	</button>
</footer>
