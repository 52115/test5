# ERR_CONNECTION_REFUSED エラーの解決方法

## このエラーが発生する理由

`ERR_CONNECTION_REFUSED` は、ブラウザが `localhost:3000` に接続しようとしたが、**開発サーバーが起動していない**ことを意味します。

## 解決手順（ステップバイステップ）

### ステップ1: サーバーが起動しているか確認

ターミナルを開いて、以下のコマンドを実行してください：

```bash
# ポート3000で何かが動いているか確認
lsof -i :3000
```

**結果の見方：**
- 何も表示されない → サーバーが起動していません（ステップ2へ）
- プロセスが表示される → サーバーは起動しています（ステップ3へ）

### ステップ2: フロントエンドサーバーを起動

#### 方法A: ターミナルで直接起動（推奨）

1. **新しいターミナルウィンドウを開く**
   - Spotlight検索（`Cmd + Space`）で「ターミナル」と入力
   - または、アプリケーション → ユーティリティ → ターミナル

2. **以下のコマンドを実行：**
   ```bash
   cd /Users/a0913/test5/frontend
   npm run dev
   ```

3. **以下のメッセージが表示されるまで待つ：**
   ```
   ➜ Local:    http://localhost:3000/
   ```

4. **このメッセージが表示されたら、サーバーは正常に起動しています**

#### 方法B: 起動スクリプトを使用

1. ターミナルを開く
2. 以下のコマンドを実行：
   ```bash
   cd /Users/a0913/test5
   ./start-frontend.sh
   ```

### ステップ3: サーバーが起動したことを確認

サーバーが起動すると、ターミナルに以下のようなメッセージが表示されます：

```
Nuxt 3.20.1 (with Nitro 2.12.9, Vite 7.2.6 and Vue 3.5.25)

  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose

✔ Vite client built in 15ms
✔ Vite server built in 158ms
✔ Nuxt Nitro server built in 209ms
```

### ステップ4: ブラウザでアクセス

サーバーが起動したら、ブラウザで以下のURLにアクセス：

- http://localhost:3000/register
- http://localhost:3000/login
- http://localhost:3000/

## よくある問題と解決方法

### 問題1: "port 3000 is already in use"

ポート3000が既に使用されている場合：

```bash
# ポート3000を使用しているプロセスを終了
lsof -ti:3000 | xargs kill -9

# その後、再度サーバーを起動
cd /Users/a0913/test5/frontend
npm run dev
```

### 問題2: "command not found: npm"

npmがインストールされていない場合：

```bash
# Node.jsをインストール（Homebrewを使用）
brew install node

# または、公式サイトからインストール
# https://nodejs.org/
```

### 問題3: "npm run dev" でエラーが発生する

依存関係がインストールされていない可能性があります：

```bash
cd /Users/a0913/test5/frontend
npm install
npm run dev
```

### 問題4: サーバーは起動しているが、ページが表示されない

1. **ブラウザをリロード**（F5 または Cmd+R）
2. **ブラウザのキャッシュをクリア**
3. **別のブラウザで試す**（Chrome、Firefox、Safariなど）
4. **ターミナルのエラーメッセージを確認**

## 重要な注意事項

⚠️ **サーバーを起動したターミナルウィンドウは閉じないでください**

サーバーは、ターミナルウィンドウが開いている間だけ動作します。ターミナルを閉じると、サーバーも停止します。

### サーバーを停止する方法

サーバーを停止したい場合は、ターミナルで `Ctrl + C` を押してください。

## 両方のサーバーが必要です

このアプリケーションを使用するには、**2つのサーバー**を起動する必要があります：

1. **フロントエンドサーバー**（Nuxt.js）- ポート3000
2. **バックエンドサーバー**（Laravel）- ポート8000

### バックエンドサーバーの起動方法

別のターミナルウィンドウを開いて：

```bash
cd /Users/a0913/test5/backend
php artisan serve
```

バックエンドサーバーが起動すると、以下のメッセージが表示されます：
```
INFO  Server running on [http://127.0.0.1:8000]
```

## まとめ

1. ✅ ターミナルを開く
2. ✅ `cd /Users/a0913/test5/frontend` を実行
3. ✅ `npm run dev` を実行
4. ✅ `➜ Local:    http://localhost:3000/` というメッセージが表示されるまで待つ
5. ✅ ブラウザで `http://localhost:3000/register` にアクセス

これで接続できるはずです！

