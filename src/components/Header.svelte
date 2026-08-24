<script lang="ts">
import type { SearchIndexEntry } from "../lib/search";
import { NAVI, SITE } from "../lib/site";
import Search from "./Search.svelte";

/**
 * サイト共通ヘッダーコンポーネント。
 * サイトタイトル、ナビゲーションリンク（NAVI の 5 項目を / 区切りで表示）、検索ボタンを表示する。
 * 画面上部に固定表示（fixed + z-50）。
 * 検索ボタンクリックで検索モーダル（Search.svelte）を開く。
 */

interface Props {
	/** ビルド時に生成した検索一覧（Search.svelte へ渡す） */
	entries: SearchIndexEntry[];
}

let { entries }: Props = $props();

/** 検索モーダルの表示状態 */
let searchOpen = $state(false);
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 py-6 bg-neutral-100/75 dark:bg-neutral-900/75"
>
	<div class="mx-auto max-w-full px-4">
		<div class="flex flex-wrap justify-between gap-y-2">
			<!-- 左: サイトタイトル -->
			<a
				href="/"
				class="flex items-center gap-2 text-2xl font-semibold no-underline"
			>
				<span class="text-black dark:text-white">{SITE.TITLE}</span>
				<img src="/favicon.svg" alt="favicon" class="h-6 w-6" loading="lazy">
			</a>
			<!-- 右: ナビゲーション -->
			<nav class="flex flex-wrap items-center gap-1 text-base">
				{#each NAVI as item, i (item.href)}
					{#if i > 0}
						<span class="text-black/30 dark:text-white/30">/</span>
					{/if}
					<a
						href={item.href}
						class="text-black/75 dark:text-white/75 hover:text-black dark:hover:text-white"
					>
						{item.label}
					</a>
				{/each}
				<span class="text-black/30 dark:text-white/30">/</span>
				<!-- 検索ボタン -->
				<button
					type="button"
					aria-label="Search"
					onclick={() => (searchOpen = true)}
					class="flex items-center rounded-sm border border-black/15 bg-neutral-100 px-2 py-1 text-xs transition-colors duration-300 hover:bg-black/5 hover:text-black dark:border-white/20 dark:bg-neutral-900 dark:hover:bg-white/5 dark:hover:text-white"
				>
					<svg
						height="16"
						stroke-linejoin="round"
						viewBox="0 0 16 16"
						width="16"
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
					&nbsp;Search
				</button>
			</nav>
		</div>
	</div>

	<Search bind:open={searchOpen} {entries} />
</header>
