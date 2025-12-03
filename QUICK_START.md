# 🚀 クイックスタートガイド

## ERR_CONNECTION_REFUSED エラーが表示された場合

このエラーは、**開発サーバーが起動していない**ことを意味します。

## 解決方法（簡単3ステップ）

### ステップ1: ターミナルを開く

macOSでターミナルを開く方法：

1. **Spotlight検索を使う（最も簡単）**
   - `Cmd + Space` キーを同時に押す
   - 「ターミナル」または「Terminal」と入力
   - Enterキーを押す

2. **Finderから開く**
   - Finderを開く
   - アプリケーション → ユーティリティ → ターミナル

### ステップ2: フロントエンドサーバーを起動

ターミナルが開いたら、以下のコマンドを**1行ずつ**入力してEnterキーを押してください：

```bash
cd /Users/a0913/test5/frontend
```

次に：

```bash
npm run dev
```

### ステップ3: サーバーが起動するまで待つ

以下のようなメッセージが表示されるまで**待ってください**（30秒〜1分程度かかる場合があります）：

```
Nuxt 3.20.1 (with Nitro 2.12.9, Vite 7.2.6 and Vue 3.5.25)

  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose

✔ Vite client built in 15ms
✔ Vite server built in 158ms
✔ Nuxt Nitro server built in 209ms
```

**重要**: `➜ Local:    http://localhost:3000/` というメッセージが表示されたら、サーバーは正常に起動しています！

### ステップ4: ブラウザでアクセス

サーバーが起動したら、ブラウザで以下のURLにアクセスしてください：

**http://localhost:3000/register**

または

**http://localhost:3000/login**

## ⚠️ 重要な注意事項

1. **ターミナルウィンドウを閉じないでください**
   - ターミナルを閉じると、サーバーも停止します
   - サーバーはターミナルが開いている間だけ動作します

2. **サーバーを停止したい場合**
   - ターミナルで `Ctrl + C` を押してください

3. **エラーメッセージが表示された場合**
   - ターミナルに表示されたエラーメッセージを確認してください
   - エラーメッセージをコピーして、サポートに連絡してください

## よくある問題

### 問題1: "command not found: npm"

Node.jsがインストールされていません。

**解決方法:**
1. [Node.js公式サイト](https://nodejs.org/) からインストール
2. または、Homebrewを使用：
   ```bash
   brew install node
   ```

### 問題2: "port 3000 is already in use"

ポート3000が既に使用されています。

**解決方法:**
ターミナルで以下のコマンドを実行：

```bash
lsof -ti:3000 | xargs kill -9
```

その後、再度 `npm run dev` を実行してください。

### 問題3: サーバーは起動したが、ページが表示されない

1. ブラウザをリロード（F5 または Cmd+R）
2. 別のブラウザで試す（Chrome、Firefox、Safari）
3. ターミナルのエラーメッセージを確認

## バックエンドサーバーも必要です

このアプリケーションを完全に動作させるには、バックエンドサーバーも起動する必要があります。

**別のターミナルウィンドウ**を開いて、以下のコマンドを実行してください：

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
4. ✅ `➜ Local:    http://localhost:3000/` が表示されるまで待つ
5. ✅ ブラウザで `http://localhost:3000/register` にアクセス

これで接続できるはずです！🎉

