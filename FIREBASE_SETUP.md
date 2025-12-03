# Firebaseプロジェクトのセットアップ手順

このガイドでは、Firebaseプロジェクトを作成し、認証機能を有効化する手順を説明します。

## ステップ1: Firebaseプロジェクトの作成

1. **Firebase Consoleにアクセス**
   - ブラウザで [Firebase Console](https://console.firebase.google.com/) を開きます
   - Googleアカウントでログインします

2. **新しいプロジェクトを作成**
   - 「プロジェクトを追加」または「Add project」をクリックします
   - プロジェクト名を入力します（例: `share-sns-app`）
   - 「続行」をクリックします

3. **Google Analyticsの設定（オプション）**
   - Google Analyticsを使用するか選択できます
   - このプロジェクトでは不要なので、「このプロジェクトでGoogle Analyticsを有効にする」のチェックを外しても構いません
   - 「プロジェクトを作成」をクリックします

4. **プロジェクトの作成を待つ**
   - 数秒でプロジェクトが作成されます
   - 「続行」をクリックしてFirebase Consoleに入ります

## ステップ2: 認証（Authentication）の有効化

1. **Authenticationを開く**
   - 左側のメニューから「Authentication」（認証）をクリックします
   - 「始める」をクリックします

2. **サインイン方法を有効化**
   - 「Sign-in method」タブをクリックします
   - 「メール/パスワード」（Email/Password）をクリックします
   - 「有効にする」をクリックして、メール/パスワード認証を有効化します
   - 「保存」をクリックします

## ステップ3: Webアプリの追加

1. **Webアプリを追加**
   - Firebase Consoleのホーム画面に戻ります
   - プロジェクトの概要にある「</>」（ウェブアイコン）をクリックします
   - または、左側のメニューから「プロジェクトの設定」（歯車アイコン）→「全般」タブを開き、「マイアプリ」セクションで「</>」アイコンをクリックします

2. **アプリの登録情報を入力**
   - アプリのニックネームを入力します（例: `Share SNS App`）
   - 「このアプリ用にFirebase Hostingを設定します」のチェックは外しておきます（必要に応じて後で設定可能）
   - 「アプリを登録」をクリックします

3. **Firebase SDKの追加方法を選択**
   - 次の画面で、Firebase SDKの追加方法が2つ表示されます：
     - **「npm を使用する」** ← **こちらを選択してください** ✅
     - 「`<script>` タグを使用する」
   
   **重要：**
   - Nuxt.jsプロジェクトでは、**「npm を使用する」を選択**してください
   - 理由：Nuxt.jsはモダンなJavaScriptフレームワークで、npmパッケージとしてFirebase SDKを管理します
   - `<script>`タグを使用する方法は、通常のHTMLファイル向けです（Nuxt.jsでは使用しません）
   
   **注意：**
   - このプロジェクトでは、すでにFirebase SDKがインストール済みです（`npm install firebase`を実行済み）
   - そのため、設定情報のみをコピーすればOKです

4. **設定情報をコピー**
   - 設定情報の画面が表示されます
   - 以下の形式で表示されます：
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
   - この設定情報をコピーします（次のステップで使用します）
   - 「設定を完了しました」などのボタンをクリックして、次のステップに進みます

## ステップ4: フロントエンドの設定ファイルを更新

1. **設定ファイルを開く**
   - `frontend/plugins/firebase.client.ts` を開きます

2. **設定情報を貼り付け**
   - コピーしたFirebase設定情報を、`firebaseConfig` オブジェクトに貼り付けます
   - 以下のように更新します：

   ```typescript
   const firebaseConfig = {
     apiKey: "実際のAPIキー",
     authDomain: "実際のAuthドメイン",
     projectId: "実際のプロジェクトID",
     storageBucket: "実際のストレージバケット",
     messagingSenderId: "実際のMessaging Sender ID",
     appId: "実際のアプリID"
   }
   ```

3. **ファイルを保存**
   - ファイルを保存します

## ステップ5: 動作確認

1. **フロントエンドサーバーを起動**
   ```bash
   cd frontend
   npm run dev
   ```

2. **ブラウザで確認**
   - `http://localhost:3000/register` にアクセスします
   - 新規登録ページが表示されることを確認します

## トラブルシューティング

### 認証エラーが発生する場合
- Firebase Consoleで認証が有効になっているか確認してください
- 設定情報が正しくコピーされているか確認してください
- ブラウザのコンソールでエラーメッセージを確認してください

### 設定情報が見つからない場合
- Firebase Consoleの「プロジェクトの設定」→「全般」タブで確認できます
- 「マイアプリ」セクションに登録したアプリが表示されます

## 次のステップ

Firebase設定が完了したら、以下を実施してください：

1. CORS設定の追加
2. Firebase認証ミドルウェアの実装（バックエンド）
3. 動作確認とテスト

