# Astro SSR サイト用マルチステージ Dockerfile
# ビルドステージ: Bun で Astro のビルド（SSR standalone）を実行
# 実行ステージ: Node で dist/server/entry.mjs を起動（Keystatic 管理画面・GitHub モード対応）

FROM oven/bun:1 AS builder
WORKDIR /app

# 依存関係のインストール
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ソースコードのコピーとビルド
COPY . .
RUN bun run build

# 実行ステージ
FROM node:22-alpine AS runner
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
