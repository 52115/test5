#!/bin/bash
# フロントエンドサーバーを起動するスクリプト

echo "フロントエンドサーバーを起動しています..."
cd "$(dirname "$0")/frontend"
npm run dev


