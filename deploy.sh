#!/bin/sh
# systemd 用デプロイスクリプト
# Webhookサーバーから呼び出され、git pull後 ビルドして systemd サービスを再起動する
set -e

echo "[deploy] リポジトリを更新中..."
cd /opt/magia-laboratory
# デプロイを root で実行するため、所有者が別ユーザーのリポジトリを安全に扱えるよう -c で許可する
# （設定ファイルを書き込まないので ProtectSystem 等の read-only 環境でも動作する）
git -c safe.directory=/opt/magia-laboratory remote set-url origin https://${GITHUB_TOKEN}@github.com/furamon/magia-laboratory.git
git -c safe.directory=/opt/magia-laboratory pull origin main

echo "[deploy] 依存関係をインストール中..."
# bun は /usr/local/bin/bun の実体を使う。/home 配下の実体や symlink は ProtectHome=true の
# サービスからは解決できないため、ユニットと同じ絶対パスに固定する。
# ProtectHome=true で /root も読めないため、bun のキャッシュを /opt 配下に逃がす。
export BUN_INSTALL_CACHE_DIR=/opt/magia-laboratory/.bun-cache
# 別パッケージマネージャ由来の node_modules が残っていると壊れるため、事前に削除する
rm -rf node_modules
bun install --frozen-lockfile

echo "[deploy] ビルド中..."
# ProtectSystem=full で /root が read-only のため、Astro telemetry の設定書き込みを無効化する
export ASTRO_TELEMETRY_DISABLED=1
bun run build

echo "[deploy] systemd サービスを再起動中..."
sudo systemctl restart magia-laboratory

echo "[deploy] デプロイ完了"
