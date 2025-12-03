# サーバー起動手順

## 簡単な起動方法

このアプリケーションを使用するには、2つのサーバーを起動する必要があります。

### 1. バックエンドサーバー（Laravel）の起動

新しいターミナルウィンドウを開いて、以下のコマンドを実行してください：

```bash
cd /Users/a0913/test5/backend
php artisan serve
```

サーバーが起動すると、以下のメッセージが表示されます：
```
INFO  Server running on [http://127.0.0.1:8000]
```

### 2. フロントエンドサーバー（Nuxt.js）の起動

**別の新しいターミナルウィンドウ**を開いて、以下のコマンドを実行してください：

```bash
cd /Users/a0913/test5/frontend
npm run dev
```

サーバーが起動すると、以下のメッセージが表示されます：
```
➜ Local:    http://localhost:3000/
```

## アクセス方法

両方のサーバーが起動したら、ブラウザで以下のURLにアクセスしてください：

- **新規登録**: http://localhost:3000/register
- **ログイン**: http://localhost:3000/login
- **タイムライン**: http://localhost:3000/

## サーバーを停止する方法

各ターミナルで `Ctrl + C` を押すと、サーバーが停止します。

## トラブルシューティング

### ポートが既に使用されている場合

```bash
# ポート8000が使用中の場合
lsof -ti:8000 | xargs kill -9

# ポート3000が使用中の場合
lsof -ti:3000 | xargs kill -9
```

### サーバーが起動しない場合

1. 依存関係をインストールしているか確認：
   ```bash
   # バックエンド
   cd /Users/a0913/test5/backend
   composer install
   
   # フロントエンド
   cd /Users/a0913/test5/frontend
   npm install
   ```

2. 開発サーバーを再起動してみる

