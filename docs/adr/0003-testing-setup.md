# ADR 0003: Vitest 基盤とカバレッジ方針

**Status**: 採用（2026-08-24）

## 決定事項

- `vitest` と `@vitest/coverage-v8` を devDependency に追加する。
- `vitest.config.ts` を Astro 公式の `getViteConfig()` ヘルパーで構成する。
- テスト対象は `src/lib/**/*.ts` の純粋関数（site / theme / search）とし、カバレッジ目標 95% を設定する。
- `package.json` に `test` / `coverage` / `check` / `totalcheck` スクリプトを追加する。

## 背景と理由

- Astro 公式ドキュメント（guides/testing）が `getViteConfig()` による Vitest 構成を推奨している。
- 旧プロジェクトも Vitest を使用しており、ロジックを純粋関数に分離するテスト戦略を踏襲する。
- Svelte コンポーネント自体のテストはブラウザ環境が必要で複雑になるため、ロジック分離で代替する（旧プロジェクトの VRMCanvas.test.ts と同じ方針）。
- 憲章の品質ゲート（`bun run totalcheck`・カバレッジ 95%）を満たすため。

## 代替案

- `@vitest/browser-playwright` によるコンポーネントテスト: セットアップが重く、KISS 原則に反するため不採用。
- Playwright E2E: 初期リリースでは不要（quickstart の目視確認で代替）。

## 影響

- テストは `tests/**/*.test.ts` に配置し、`bun run test` / `bun run coverage` で実行する。
- カバレッジ閾値（lines / functions / statements / branches 95%）を vitest.config.ts に設定し、未達時は失敗する。
