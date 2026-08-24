<script lang="ts">
/**
 * 汎用コンテンツ一覧コンポーネント。
 * 各コレクションのインデックスページで使用する。
 * エントリのカード一覧（タイトル・日付・説明）を表示し、groupByYear 時は年別にグループ化する。
 */

/** 一覧表示用のエントリ型 */
interface ContentIndexEntry {
	/** エントリのスラッグ */
	slug: string;
	/** エントリのメタデータ */
	data: {
		title: string;
		date?: string;
		description?: string;
	};
}

interface Props {
	/** 表示するコンテンツエントリの配列 */
	entries: ContentIndexEntry[];
	/** コレクションのベース URL（例: "/blog", "/game"） */
	baseHref: string;
	/** 年別にグループ化するか */
	groupByYear?: boolean;
}

let { entries, baseHref, groupByYear = false }: Props = $props();

/** 年別にグループ化したエントリ */
const grouped = $derived(
	groupByYear
		? entries.reduce(
				(acc, entry) => {
					const year = entry.data.date
						? new Date(entry.data.date).getFullYear().toString()
						: "その他";
					if (!acc[year]) acc[year] = [];
					acc[year].push(entry);
					return acc;
				},
				{} as Record<string, ContentIndexEntry[]>,
			)
		: {},
);

/** 年別グループのキー（降順） */
const years = $derived(
	Object.keys(grouped).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)),
);

/** エントリの日付を降順（新しい順）で比較する */
function compareByDateDesc(a: ContentIndexEntry, b: ContentIndexEntry): number {
	return (
		new Date(b.data.date ?? 0).getTime() - new Date(a.data.date ?? 0).getTime()
	);
}

/** 各年グループ内を新しい記事順に並べたエントリ */
const sortedGrouped = $derived(
	Object.fromEntries(
		years.map((year) => [
			year,
			[...(grouped[year] ?? [])].sort(compareByDateDesc),
		]),
	) as Record<string, ContentIndexEntry[]>,
);

/** 日付を ja-JP 形式（YYYY/MM/DD）に整形する */
function formatDate(date: string): string {
	return new Date(date).toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}
</script>

<div class="space-y-10">
	{#if groupByYear}
		{#each years as year (year)}
			<section class="space-y-4">
				<h2 class="text-xl font-semibold text-black dark:text-white">
					{year}
				</h2>
				<ul class="flex flex-col gap-4 not-prose">
					{#each sortedGrouped[year] ?? [] as entry (entry.slug)}
						<li>
							<a
								href={`${baseHref}/${entry.slug}`}
								class="block rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
							>
								<div class="flex items-center gap-2 text-base text-neutral-500">
									{#if entry.data.date}
										<time datetime={entry.data.date}>
											{formatDate(entry.data.date)}
										</time>
									{/if}
								</div>
								<div class="font-medium text-black dark:text-white">
									{entry.data.title}
								</div>
								{#if entry.data.description}
									<div class="mt-1 text-base text-neutral-500">
										{entry.data.description}
									</div>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{:else}
		<ul class="flex flex-col gap-4 not-prose">
			{#each entries as entry (entry.slug)}
				<li>
					<a
						href={`${baseHref}/${entry.slug}`}
						class="block rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
					>
						<div class="font-medium text-black dark:text-white">
							{entry.data.title}
						</div>
						{#if entry.data.description}
							<div class="mt-1 text-base text-neutral-500">
								{entry.data.description}
							</div>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
