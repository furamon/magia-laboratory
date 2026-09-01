<script lang="ts">
/**
 * SSGform を利用したお問い合わせフォーム。
 * 送信先 URL は環境変数 PUBLIC_SSGFORM_URL から取得する（.env.example 参照）。
 */
const formUrl = import.meta.env.PUBLIC_SSGFORM_URL;

function autoResize(event: Event) {
	const el = event.currentTarget as HTMLTextAreaElement;
	el.style.height = "auto";
	el.style.height = `${el.scrollHeight - 16}px`;
}
</script>

<form
	action={formUrl}
	method="post"
	class="flex flex-col items-center justify-center gap-4 w-full"
>
	<div class="flex flex-col gap-1 w-full">
		<label for="contact-name" class="font-medium">お名前</label>
		<input
			id="contact-name"
			type="text"
			name="お名前"
			required
			class="border-2 border-neutral-500 rounded px-3 py-2 bg-white dark:bg-neutral-800 text-black dark:text-white"
		>
	</div>
	<div class="flex flex-col gap-1 w-full">
		<label for="contact-email" class="font-medium">メールアドレス</label>
		<input
			id="contact-email"
			type="email"
			name="メールアドレス"
			required
			class="border-2 border-neutral-500 rounded px-3 py-2 bg-white dark:bg-neutral-800 text-black dark:text-white"
		>
	</div>
	<div class="flex flex-col gap-1 w-full">
		<label for="contact-message" class="font-medium">お問い合わせ内容</label>
		<textarea
			id="contact-message"
			name="お問い合わせ内容"
			rows="5"
			required
			on:input={autoResize}
			class="border-2 border-neutral-500 rounded px-3 py-2 bg-white dark:bg-neutral-800 text-black dark:text-white resize-none overflow-hidden"
		></textarea>
	</div>
	<div>
		<button
			type="submit"
			class="px-6 py-0 rounded bg-neutral-900 dark:bg-white text-white dark:text-black font-medium"
		>
			送信する
		</button>
	</div>
</form>
