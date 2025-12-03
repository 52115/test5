#!/bin/bash
# TypeScript設定ファイルを再生成するスクリプト

echo "TypeScript設定ファイルを再生成します..."

cd "$(dirname "$0")"

# .nuxtフォルダを削除
echo "1. .nuxtフォルダを削除中..."
rm -rf .nuxt

# Nuxt.jsの設定ファイルを準備
echo "2. Nuxt.jsの設定ファイルを準備中..."
npx nuxt prepare

echo "✅ 完了しました！"
echo "次に 'npm run dev' を実行してください。"

