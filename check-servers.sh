#!/bin/bash
# サーバーの起動状態を確認するスクリプト

echo "=== サーバー起動状態の確認 ==="
echo ""

# フロントエンドサーバー（ポート3000）の確認
echo "【フロントエンドサーバー（ポート3000）】"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ 起動中"
    echo "   アクセス: http://localhost:3000"
else
    echo "❌ 停止中"
    echo "   起動方法: cd frontend && npm run dev"
fi
echo ""

# バックエンドサーバー（ポート8000）の確認
echo "【バックエンドサーバー（ポート8000）】"
if lsof -i :8000 > /dev/null 2>&1; then
    echo "✅ 起動中"
    echo "   アクセス: http://localhost:8000"
else
    echo "❌ 停止中"
    echo "   起動方法: cd backend && php artisan serve"
fi
echo ""

echo "=== 確認完了 ==="

