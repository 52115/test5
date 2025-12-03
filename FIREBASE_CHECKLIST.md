# Firebase設定チェックリスト

Firebase設定が正しく完了しているか確認するためのチェックリストです。

## ✅ 設定確認項目

### 1. Firebaseプロジェクトの作成
- [ ] Firebase Consoleでプロジェクトが作成されている
- [ ] プロジェクト名を確認できた

### 2. 認証（Authentication）の設定
- [ ] Authenticationが有効になっている
- [ ] メール/パスワード認証が有効になっている
- [ ] 「Sign-in method」タブで確認済み

### 3. Webアプリの登録
- [ ] Webアプリが登録されている
- [ ] Firebase設定情報をコピーした

### 4. フロントエンド設定ファイルの更新
- [ ] `frontend/plugins/firebase.client.ts` を開いた
- [ ] 以下の項目が実際の値に置き換えられている：
  - [ ] `apiKey` - "AIza..." で始まる文字列
  - [ ] `authDomain` - "your-project.firebaseapp.com" 形式
  - [ ] `projectId` - プロジェクトID
  - [ ] `storageBucket` - "your-project.appspot.com" 形式
  - [ ] `messagingSenderId` - 数字の文字列
  - [ ] `appId` - "1:..." で始まる文字列
- [ ] "YOUR_..." というプレースホルダーが残っていない
- [ ] ファイルを保存した

### 5. 動作確認
- [ ] フロントエンドサーバーを起動した（`npm run dev`）
- [ ] ブラウザで `http://localhost:3000/register` にアクセスした
- [ ] 新規登録ページが表示される
- [ ] エラーが表示されない（ブラウザのコンソールを確認）

## 🔍 設定情報の確認方法

### Firebase Consoleで確認する手順

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 作成したプロジェクトを選択
3. 左側のメニューから「⚙️ プロジェクトの設定」をクリック
4. 「全般」タブを選択
5. 「マイアプリ」セクションで、登録したWebアプリを探す
6. 「</>」アイコンをクリックして設定情報を確認

### 設定情報のサンプル形式

```javascript
{
  apiKey: "AIzaSy...",  // 39文字程度の文字列
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",  // プロジェクト名（小文字、ハイフン付き）
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",  // 12桁の数字
  appId: "1:123456789012:web:abcdef123456"  // 長い文字列
}
```

## ⚠️ よくある間違い

- ❌ 設定情報をコピーする際に、引用符（"）を削除してしまった
- ❌ 設定情報が不完全（一部の項目が欠けている）
- ❌ 別のプロジェクトの設定情報を使っている
- ❌ ファイルを保存していない

## 📝 次のステップ

すべてのチェック項目が完了したら：

1. CORS設定を追加します
2. Firebase認証ミドルウェアを実装します（バックエンド）
3. 動作確認とテストを行います

