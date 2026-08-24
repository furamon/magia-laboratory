import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE } from "../lib/site";

/**
 * RSS フィード生成エンドポイント。
 * blog コレクションの公開エントリ（最新 20 件）を RSS 2.0 形式で配信する。
 */
export async function GET() {
	const posts = await getCollection("blog", ({ data }) => !data.draft);

	const sortedPosts = posts
		.sort((a, b) => {
			const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
			const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
			return dateB - dateA;
		})
		.slice(0, 20);

	return rss({
		title: SITE.TITLE,
		description: SITE.DESCRIPTION,
		site: "https://magialabs.blog",
		items: sortedPosts.map((post) => ({
			title: post.data.title,
			link: `/blog/${post.id}/`,
			pubDate: post.data.date ? new Date(post.data.date) : new Date(),
			description: post.data.description ?? "",
		})),
		customData: "<language>ja</language>",
	});
}
