#!/bin/bash
# バックエンドサーバーを起動するスクリプト

echo "バックエンドサーバーを起動しています..."
cd "$(dirname "$0")/backend"
php artisan serve


