# ADR 0008: パッケージマネージャ・ランタイムを npm/Node から bun へ移行

**Status**: 採用（2026-09-16）

## 決定事項

依存管理とランタイム実行を npm + Node.js から bun に一本化する。ロックファイルは `package-lock.json` を廃止し `bun.lock` を使用する。systemd ユニットと `deploy.sh` は `/usr/local/bin/bun` を直接実行する。

## 背景と理由

- デプロイ先サーバー（Ubuntu 22.04）に Node.js / npm が入っておらず、入っていた Node は `astro bin/astro.mjs` の `module.enableCompileCache?.()` で `SyntaxError` になるほど古かった。Node の導入自体が手間。
- bun は単一バイナリで install・実行・TypeScript 実行を兼ね、`bun buildHooks.ts` のように `.ts` を直接実行できる（旧 `ts-node`/`tsx` 相当が不要）。
- Astro / vitest / biome はいずれも bun 上で動作確認済み（`bun run build` 成功、`bun ./dist/server/entry.mjs` で HTTP 200、`bun buildHooks.ts` 起動確認）。

## 代替案

- **Node を正規導入して npm 継続**: Node のバージョン管理（mise/nvm/apt）とデプロイ先への配布が追加作業になるため不採用。
- **bun を `/home` 配下に置いたまま**: `deploy/*.service` の `ProtectHome=true` により `/home` 配下の実体・symlink が解決できず `status=203/EXEC` になる（過去に `bun -> npm` へ差し戻した原因）。不採用。

## 影響

- **ユニット**: `ExecStart` を `/usr/local/bin/bun` に変更。bun の実体は `/home` 配下ではなく `/usr/local/bin/bun` に配置する。
- **実行ユーザー**: `User=furamon` を明示する。デプロイ先ホストは NAS 構成で、`furamon` が実質の管理者（`/opt`・`/etc/systemd/system` を所有）であり、逆に literal な `root`（uid 9999）は capability を持たず `/opt` も `/etc` も書けない。そのため `sudo` は操作権限の**降格**になり、`deploy.sh` の `systemctl restart` からは `sudo` を外した。
- **`HOME`**: `ProtectHome=true` で `/root`・`/home` が読めないため、両ユニットとも `HOME=/opt/magia-laboratory` を設定する（`/opt` は `ProtectSystem=full` でも書き込み可能）。
- **`deploy.sh`**: `npm ci` → `rm -rf node_modules && bun install --frozen-lockfile`、`npm run build` → `bun run build`。`BUN_INSTALL_CACHE_DIR=/opt/magia-laboratory/.bun-cache` を設定。
- **ロックファイル**: `package-lock.json` を削除、`bun.lock` を追加。
- **`.gitignore`**: npm キャッシュ系（`.npm-cache/` / `.npm-logs/`）を `.bun-cache/` と `.bun/` に置換。
- **ドキュメント**: `README.md` / `AGENTS.md` のコマンド表記を `bun` に統一。憲章の品質ゲートは元々 `bun run totalcheck` 表記のため変更なし。
- **Node 非依存**: ローカル開発・デプロイ環境ともに Node.js のインストールは不要になる。
