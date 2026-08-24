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
# bun をやめ npm に統一。npm は /usr/lib 配下の実体で、ProtectHome=true でも解決できる。
# ProtectSystem=full で /root が read-only のため、npm のキャッシュ/ログを /opt 配下に置く。
export npm_config_cache=/opt/magia-laboratory/.npm-cache
export npm_config_logs_dir=/opt/magia-laboratory/.npm-logs
# bun 由来の node_modules が残っていると npm ci が壊れるため、事前に削除する
rm -rf node_modules
npm ci

echo "[deploy] ビルド中..."
# ProtectSystem=full で /root が read-only のため、Astro telemetry の設定書き込みを無効化する
export ASTRO_TELEMETRY_DISABLED=1
npm run build

echo "[deploy] systemd サービスを再起動中..."
sudo systemctl restart magia-laboratory

echo "[deploy] デプロイ完了"
