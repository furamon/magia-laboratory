#!/bin/sh
# Docker Compose 用デプロイスクリプト
# Webhookサーバーから呼び出され、git pull後 docker compose up --build -d を実行する
set -e

echo "[deploy] リポジトリを更新中..."
cd /app
git remote set-url origin https://${GITHUB_TOKEN}@github.com/furamon/magia-laboratory.git
git pull origin main

echo "[deploy] Dockerコンテナを再ビルド・起動中..."
# app サービスのみ再ビルド・再起動する
# （webhook サービス自身は再起動しない。ポート競合を防ぐため）
docker compose -f /app/docker-compose.yml up --build -d app

echo "[deploy] デプロイ完了"
