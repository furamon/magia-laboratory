interface SiteConfig {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	author: 'ふらもん', // Site author
	title: 'Magia Laboratory', // Site title.
	description: 'CGとかゲームとかのふらもんの部屋。', // Description to display in the meta tags
	lang: 'ja-JP',
	ogLocale: 'ja_JP',
	shareMessage: 'Share', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
