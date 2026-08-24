/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

/**
 * Vitest 設定。
 * Astro 公式の getViteConfig() ヘルパーで Astro の Vite 設定を継承する。
 * テスト対象は src/lib/** の純粋関数とし、カバレッジ目標 95% を設定する。
 */
export default getViteConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/lib/**/*.ts'],
			thresholds: {
				lines: 95,
				functions: 95,
				statements: 95,
				branches: 95,
			},
		},
	},
});
