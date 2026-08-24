import { defineConfig, presetTypography, presetWind3, transformerDirectives } from 'unocss';

/**
 * UnoCSS 設定ファイル。
 * Astro の Tailwind CSS から移行したスタイルを提供する。
 * - presetUno: Tailwind CSS 互換のユーティリティクラス
 * - presetTypography: prose クラスによるリッチテキスト表示
 * - transformerDirectives: @apply ディレクティブのサポート
 */
export default defineConfig({
	presets: [
		presetWind3({
			theme: {
				fontFamily: {
					sans: [
						'Noto Sans CJK JP',
						'Noto Sans JP',
						'Hiragino Sans',
						'Hiragino Kaku Gothic ProN',
						'Yu Gothic',
						'Yu Gothic UI',
						'Meiryo',
						'ui-sans-serif',
						'system-ui',
						'sans-serif',
						'Apple Color Emoji',
						'Segoe UI Emoji',
						'Segoe UI Symbol',
						'Noto Color Emoji',
					],
					mono: [
						'Source Han Code JP',
						'Noto Sans Mono',
						'ui-monospace',
						'Menlo',
						'Monaco',
						'Consolas',
						'Liberation Mono',
						'Courier New',
						'MS Gothic',
						'monospace',
					],
				},
			},
		}),
		presetTypography({
			cssExtend: {
				img: {
					'margin-left': 'auto',
					'margin-right': 'auto',
					'margin-top': 'auto',
					'margin-bottom': 'auto',
					'max-width': '100%',
					'height': 'auto',
				},
			},
		}),
	],
	transformers: [transformerDirectives()],
	rules: [
		// 旧 global.css の .btn-game 相当
		[
			'btn-game',
			{
				margin: '0.25rem auto',
				width: '100%',
				'border-radius': '9999px',
				'background-color': '#374151',
				padding: '0.75rem 0',
				'text-align': 'center',
				'font-size': '1.5rem',
				color: 'white',
				display: 'block',
			},
		],
		['btn-game:hover', { 'background-color': '#6b7280' }],
		// .btn-lily 相当
		[
			'btn-lily',
			{
				margin: '0.25rem auto',
				width: '100%',
				'border-radius': '9999px',
				'background-color': '#be185d',
				padding: '0.75rem 0',
				'text-align': 'center',
				'font-size': '1.5rem',
				color: 'white',
				display: 'block'
			},
		],
		['btn-lily:hover', { 'background-color': '#ec4899' }],
	],
	preflights: [
		{
			getCSS: () => `
        html {
          overflow-y: auto;
          color-scheme: light;
          scroll-padding-top: 100px;
        }
        html.dark {
          color-scheme: dark;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
        }
        body {
          font-family: inherit;
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          background-color: #f5f5f5;
          color: rgba(0, 0, 0, 0.75);
        }
        .dark body {
          background-color: #171717;
          color: white;
        }
        body.lily-page {
          background-color: #fdf2f8;
          color: #1c1917;
        }
        .dark body.lily-page {
          background-color: #4c0519;
          color: white;
        }
        h1, h2, h3 {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        header {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 50;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          background-color: rgba(245, 245, 245, 0.75);
        }
        .dark header {
          background-color: rgba(23, 23, 23, 0.75);
        }
        main {
          flex: 1;
          padding: 8rem 1rem 8rem;
        }
        img {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        footer {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        pre {
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding-top: 1.25rem;
          padding-bottom: 1.25rem;
          overflow-x: auto;
        }
        .dark pre {
          border-color: rgba(255, 255, 255, 0.2);
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        article a {
          font-family: inherit;
          color: currentColor;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(0, 0, 0, 0.3);
          transition: color 300ms ease-in-out;
        }
        .dark article a {
          text-decoration-color: rgba(255, 255, 255, 0.3);
        }
        article a:hover {
          color: black;
          text-decoration-color: rgba(0, 0, 0, 0.5);
        }
        .dark article a:hover {
          color: white;
          text-decoration-color: rgba(255, 255, 255, 0.5);
        }
        .animate-fade {
          opacity: 0;
          transform: translateY(-0.75rem);
          transition: all 300ms ease-out;
        }
        .animate-fade.show {
          opacity: 1;
          transform: translateY(0);
        }
        .hidden-link {
          display: inline-block;
        }
      `,
		},
	],
});
