<script lang="ts">
import type { SearchIndexEntry } from "../lib/search";

/**
 * 検索モーダルコンポーネント。
 * バックドロップ + モーダルで全コンテンツの一覧を表示する。
 * キーワード検索ロジックは仕様範囲外のため実装しない（初期リリースは一覧表示のみ）。
 * 閉じるボタン / バックドロップクリック / Esc キーで閉じる。
 */

interface Props {
	/** モーダルの表示状態（bindable、Header から制御） */
	open?: boolean;
	/** ビルド時に生成した検索一覧 */
	entries: SearchIndexEntry[];
}

let { open = $bindable(false), entries }: Props = $props();

/** 検索入力欄の DOM 要素参照（auto-focus 用） */
let inputEl: HTMLInputElement | undefined = $state(undefined);

/** モーダルが開かれた際に検索フォームへフォーカスする */
$effect(() => {
	if (open) {
		inputEl?.focus();
	}
});

/** モーダルを閉じる */
function close(): void {
	open = false;
}

/** Esc キーでモーダルを閉じる */
function handleKeydown(e: KeyboardEvent): void {
	if (e.key === "Escape") {
		close();
	}
}

/** バックドロップクリック（背景部分）でモーダルを閉じる */
function handleBackdropClick(e: MouseEvent): void {
	if (e.target === e.currentTarget) {
		close();
	}
}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- バックドロップ（背景） -->
	<button
		type="button"
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm appearance-none border-0 p-0 cursor-pointer"
		onclick={handleBackdropClick}
		aria-label="検索を閉じる"
		tabindex="-1"
	></button>

	<!-- モーダル本体 -->
	<div
		class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none"
	>
		<div
			class="pointer-events-auto w-full max-w-xl mx-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
		>
			<!-- 検索入力エリア -->
			<div
				class="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700"
			>
				<svg
					height="20"
					width="20"
					viewBox="0 0 16 16"
					class="text-neutral-400 shrink-0"
					style="color: currentcolor"
				>
					<title>search</title>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M3.5 7C3.5 5.067 5.067 3.5 7 3.5C8.933 3.5 10.5 5.067 10.5 7C10.5 7.88461 10.1718 8.69256 9.63058 9.30876L9.30876 9.63058C8.69256 10.1718 7.88461 10.5 7 10.5C5.067 10.5 3.5 8.933 3.5 7ZM9.96544 11.0261C9.13578 11.6382 8.11014 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7C12 8.11014 11.6382 9.13578 11.0261 9.96544L14.0303 12.9697L14.5607 13.5L13.5 14.5607L12.9697 14.0303L9.96544 11.0261Z"
						fill="currentColor"
					></path>
				</svg>
				<input
					bind:this={inputEl}
					type="text"
					placeholder="検索..."
					class="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none text-base"
					aria-label="検索クエリを入力"
				>
				<button
					type="button"
					onclick={close}
					class="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-150"
					aria-label="閉じる"
				>
					<svg
						height="20"
						width="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<title>閉じる</title>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- コンテンツ一覧エリア -->
			<div class="max-h-96 overflow-y-auto">
				{#if entries.length > 0}
					<ul class="divide-y divide-neutral-200 dark:divide-neutral-700">
						{#each entries as entry (entry.url)}
							<li>
								<a
									href={entry.url}
									class="block w-full text-left px-4 py-3 transition-colors duration-150 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
								>
									<div class="flex items-center gap-2 mb-1 min-w-0">
										<span
											class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate"
											>{entry.title}</span
										>
										<span
											class="text-xs px-1.5 py-0.5 rounded-sm bg-neutral-300 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 shrink-0"
											>{entry.collection}</span
										>
									</div>
									{#if entry.description}
										<div
											class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2"
										>
											{entry.description}
										</div>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<!-- 空状態: コンテンツ 0 件 -->
					<div
						class="px-4 py-12 text-center text-neutral-400 dark:text-neutral-500"
					>
						コンテンツがありません
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
