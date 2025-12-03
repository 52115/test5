# SHARE - Twitter風SNSアプリケーション

## 概要

**SHARE**は、Twitterのような機能を持つSNSアプリケーションです。ユーザーは投稿を作成し、他のユーザーの投稿にいいねを付けたり、コメントを残したりすることができます。

主な機能：
- ユーザー認証（Firebase Authentication）
- 投稿の作成・表示・削除
- いいね機能（トグル式）
- コメント機能
- 日本語対応のバリデーションとエラーメッセージ

< --- トップ画面の画像 ---- >

## 作成した目的

このアプリケーションは、以下の技術を学習するために作成されました：

- **フロントエンド開発**: Nuxt.js 3を使用したモダンなWebアプリケーション開発
- **バックエンド開発**: Laravel 11を使用したRESTful APIの構築
- **認証システム**: Firebase Authenticationを利用したセキュアな認証実装
- **API連携**: フロントエンドとバックエンドの連携方法の理解
- **データベース設計**: リレーショナルデータベースの設計と実装

初心者でも理解しやすいよう、段階的な実装と詳細なコメントを心がけています。

## アプリケーションURL

※ 現在、本アプリケーションはローカル環境でのみ動作しています。デプロイについては今後の予定です。

## 他のリポジトリ

このプロジェクトは、フロントエンドとバックエンドが同一リポジトリ内に配置されています：

```
test5/
├── frontend/    # Nuxt.js（フロントエンド）
├── backend/     # Laravel（バックエンド）
└── README.md
```

## 機能一覧

### 認証機能
- ✅ 新規ユーザー登録（メールアドレス・パスワード）
- ✅ ログイン・ログアウト
- ✅ 認証状態の管理と自動リダイレクト

### 投稿機能
- ✅ 投稿の一覧表示（タイムライン）
- ✅ 投稿の作成（最大120文字）
- ✅ 投稿の削除（投稿者のみ）
- ✅ リアルタイムでの投稿更新

### いいね機能
- ✅ いいねの追加・削除（トグル式）
- ✅ いいね数の表示
- ✅ 1ユーザー1投稿につき1回のみいいね可能

### コメント機能
- ✅ コメントの一覧表示
- ✅ コメントの追加（最大120文字）
- ✅ コメント数の表示

### バリデーション機能
- ✅ ログイン時のバリデーション（メールアドレス、パスワード必須）
- ✅ 新規登録時のバリデーション（ユーザーネーム20文字以内、メール形式、パスワード6文字以上）
- ✅ 投稿・コメントのバリデーション（必須、120文字以内）
- ✅ 日本語エラーメッセージの表示

### UI/UX
- ✅ レスポンシブデザイン
- ✅ ダークテーマ
- ✅ リアルタイム更新（ページリロード不要）

## 使用技術（実行環境）

### フロントエンド
- **Nuxt.js** 3.13.0
- **Vue.js** 3.5.25
- **TypeScript**
- **Firebase SDK** 10.13.0（認証用）
- **Node.js** v25.1.0以上
- **npm** 11.6.2以上

### バックエンド
- **Laravel** 12.0
- **PHP** 8.2以上
- **MySQL**（本番環境）または **SQLite**（開発環境）

### 認証
- **Firebase Authentication**
  - Email/Password認証

### 開発ツール
- **Composer** 2.9.2以上（PHP依存関係管理）
- **npm**（JavaScript依存関係管理）

### データベース設計ツール
- Laravel Migrations
- Eloquent ORM

## テーブル設計

このアプリケーションでは、以下の3つのテーブルを使用しています：

### posts テーブル
投稿情報を格納するテーブルです。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | BIGINT (Primary Key) | 投稿ID |
| user_id | VARCHAR | Firebase認証のユーザーID（UID） |
| user_name | VARCHAR | 投稿者の名前 |
| content | VARCHAR(120) | 投稿内容（最大120文字） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### likes テーブル
いいね情報を格納するテーブルです。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | BIGINT (Primary Key) | いいねID |
| post_id | BIGINT (Foreign Key) | 投稿ID（postsテーブル参照） |
| user_id | VARCHAR | Firebase認証のユーザーID（UID） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

**制約:**
- `post_id`と`user_id`の組み合わせでユニーク制約（1ユーザー1投稿につき1回のみ）
- `post_id`に外部キー制約（投稿削除時に関連するいいねも削除）

### comments テーブル
コメント情報を格納するテーブルです。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | BIGINT (Primary Key) | コメントID |
| post_id | BIGINT (Foreign Key) | 投稿ID（postsテーブル参照） |
| user_id | VARCHAR | Firebase認証のユーザーID（UID） |
| user_name | VARCHAR | コメントした人の名前 |
| content | VARCHAR(120) | コメント内容（最大120文字） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

**制約:**
- `post_id`に外部キー制約（投稿削除時に関連するコメントも削除）

< --- 作成したテーブル設計の画像 ---- >

## ER図

```
posts
  ├── id (PK)
  ├── user_id
  ├── user_name
  ├── content
  └── timestamps
      │
      ├─→ likes (1:N)
      │     ├── id (PK)
      │     ├── post_id (FK)
      │     ├── user_id
      │     └── timestamps
      │
      └─→ comments (1:N)
            ├── id (PK)
            ├── post_id (FK)
            ├── user_id
            ├── user_name
            ├── content
            └── timestamps
```

**リレーションシップ:**
- `posts` と `likes`: 1対多（1つの投稿に複数のいいね）
- `posts` と `comments`: 1対多（1つの投稿に複数のコメント）

< --- 作成したER図の画像 ---- >

## 環境構築

このプロジェクトをローカル環境で実行するための手順です。

### 前提条件

以下のソフトウェアがインストールされている必要があります：

- **PHP** 8.2以上
- **Composer** 2.0以上
- **Node.js** v25.1.0以上
- **npm** 11.6.2以上
- **MySQL**（または開発時はSQLite）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd test5
```

### 2. バックエンド（Laravel）のセットアップ

```bash
cd backend

# 依存関係のインストール
composer install

# 環境変数ファイルの作成
cp .env.example .env

# アプリケーションキーの生成
php artisan key:generate

# データベース設定（.envファイルを編集）
# DB_CONNECTION=sqlite  # 開発時はSQLite推奨
# または
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# SQLiteを使用する場合、データベースファイルを作成
touch database/database.sqlite

# マイグレーションの実行
php artisan migrate

# 開発サーバーの起動
php artisan serve
```

バックエンドサーバーは `http://localhost:8000` で起動します。

### 3. フロントエンド（Nuxt.js）のセットアップ

新しいターミナルウィンドウを開いて：

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンドサーバーは `http://localhost:3000` で起動します。

### 4. Firebaseプロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. **Authentication** を有効化
   - 認証方法として「Email/Password」を有効化
4. **プロジェクトの設定** → **マイアプリ** から、Webアプリを追加
5. 表示された設定情報をコピー

#### Firebase設定情報の反映

`frontend/composables/useAuth.ts` を開き、以下の部分を編集してください：

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}
```

詳細な手順は `FIREBASE_SETUP.md` を参照してください。

### 5. APIベースURLの設定（オプション）

デフォルトでは、APIベースURLは `http://localhost:8000/api` に設定されています。

変更する場合は、`frontend/nuxt.config.ts` を編集してください：

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
  }
}
```

### 6. 動作確認

1. ブラウザで `http://localhost:3000/register` にアクセス
2. 新規ユーザー登録を行う
3. ログイン後、投稿を作成できることを確認

## APIエンドポイント一覧

### 投稿関連

- `GET /api/posts?user_id={uid}` - 投稿一覧取得
- `POST /api/posts` - 投稿作成
  - リクエストボディ: `{ content: string, user_id: string, user_name: string }`
- `DELETE /api/posts/{id}?user_id={uid}` - 投稿削除

### いいね関連

- `POST /api/posts/{id}/like` - いいね追加/削除（トグル）
  - リクエストボディ: `{ user_id: string }`

### コメント関連

- `GET /api/posts/{postId}/comments` - コメント一覧取得
- `POST /api/posts/{postId}/comments` - コメント追加
  - リクエストボディ: `{ user_id: string, user_name: string, content: string }`

## プロジェクト構造

```
test5/
├── backend/                    # Laravelプロジェクト
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # APIコントローラー
│   │   │   └── Requests/      # バリデーションクラス
│   │   └── Models/            # Eloquentモデル
│   ├── database/
│   │   └── migrations/        # データベースマイグレーション
│   └── routes/
│       └── api.php            # APIルーティング
├── frontend/                   # Nuxt.jsプロジェクト
│   ├── pages/                 # ページコンポーネント
│   │   ├── index.vue          # タイムラインページ
│   │   ├── login.vue          # ログインページ
│   │   ├── register.vue       # 新規登録ページ
│   │   └── posts/
│   │       └── [id]/
│   │           └── comments.vue  # コメントページ
│   ├── components/            # 再利用可能コンポーネント
│   │   ├── Sidebar.vue        # サイドバー
│   │   ├── PostCard.vue       # 投稿カード
│   │   └── CommentCard.vue    # コメントカード
│   └── composables/           # 再利用可能なロジック
│       ├── useAuth.ts         # 認証関連
│       └── useApi.ts          # API呼び出し
├── FIREBASE_SETUP.md          # Firebase設定手順
├── FIX_CONNECTION_ERROR.md    # 接続エラー解決方法
├── START_SERVERS.md           # サーバー起動手順
├── TROUBLESHOOTING.md         # トラブルシューティング
└── README.md                  # このファイル
```

## トラブルシューティング

### 接続エラー（ERR_CONNECTION_REFUSED）

開発サーバーが起動していない可能性があります。詳細は `FIX_CONNECTION_ERROR.md` を参照してください。

### サーバー起動方法

詳細な手順は `START_SERVERS.md` を参照してください。

### その他の問題

`TROUBLESHOOTING.md` を参照してください。

## 開発の流れ

1. ✅ バックエンド（Laravel）のセットアップ
2. ✅ データベース設計とマイグレーション作成
3. ✅ APIエンドポイントの実装
4. ✅ フロントエンド（Nuxt.js）のセットアップ
5. ✅ Firebase認証の統合
6. ✅ 各ページの実装
7. ✅ エラーハンドリングとバリデーション
8. ✅ 動作確認とバグ修正

## 今後の拡張予定（オプション）

以下の機能は、本番環境向けの改善として検討中です：

- **CORS設定**: 本番環境でのクロスオリジンリクエストの適切な設定
- **Firebase認証ミドルウェア**: バックエンドでのFirebase IDトークン検証
- **画像アップロード機能**: 投稿に画像を添付
- **プロフィール機能**: ユーザープロフィールの編集
- **フォロー機能**: 他のユーザーをフォロー

## ライセンス

このプロジェクトは学習目的で作成されています。

## 作成者

- 学習目的で作成されたプロジェクトです

---

**注意**: このアプリケーションは開発環境での使用を想定しています。本番環境で使用する場合は、セキュリティ設定（CORS、認証ミドルウェアなど）を適切に実装してください。
# test5
