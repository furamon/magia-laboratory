import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	// Global ignores
	{
		ignores: ['dist/', 'node_modules/', '.github/', '.changeset/']
	},

	// TypeScriptの推奨設定を適用します。
	// これには `eslint:recommended` のルールも含まれています。
	...tseslint.configs.recommended,

	// Astroの推奨設定を適用します。
	// これにより .astro ファイルのパーサーが正しく設定されます。
	...eslintPluginAstro.configs['flat/recommended'],

	// Override for Astro files
	{
		files: ['**/*.astro'],
		rules: {
			'astro/no-set-html-directive': 'error'
		}
	}
)
