# トラブルシューティングガイド

## TypeScript設定エラーについて

### エラーメッセージ
```
ERROR Pre-transform error: parsing /Users/a0913/test5/frontend/.nuxt/tsconfig.app.json failed: Error: ENOENT: no such file or directory
```

### 原因
Nuxt.jsが自動生成するTypeScript設定ファイルが不足している可能性があります。

### 解決方法

#### 方法1: ブラウザで動作確認（まず試してください）
このエラーは警告の可能性が高いです。サーバーが起動していれば、実際に動作している可能性があります。

1. ブラウザで `http://localhost:3000/register` にアクセス
2. ページが表示されれば問題ありません
3. エラーは無視して開発を続行できます

#### 方法2: 設定ファイルを再生成（エラーを解決したい場合）

1. **開発サーバーを停止**
   - ターミナルで `Ctrl + C` を押してサーバーを停止

2. **.nuxtフォルダを削除して再生成**
   ```bash
   cd frontend
   rm -rf .nuxt
   npm run dev
   ```

3. **または、nuxt prepareを実行**
   ```bash
   cd frontend
   npx nuxt prepare
   npm run dev
   ```

### その他のよくある問題

#### Firebase設定エラー
- `frontend/plugins/firebase.client.ts` の設定情報が正しく入力されているか確認
- Firebase Consoleでプロジェクトが作成されているか確認

#### ポートが使用中
```bash
# ポート3000が使用中の場合
lsof -ti:3000 | xargs kill -9
```

#### 依存関係のエラー
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

