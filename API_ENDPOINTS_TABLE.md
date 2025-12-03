# APIエンドポイント一覧表

## エクセルに貼り付け用（タブ区切り）

以下のテキストをコピーして、エクセルに貼り付けてください。

```
パス	メソッド	コントローラーファイル名	アクション	認証必須	説明	リクエストボディ	クエリパラメータ	パスパラメータ
/api/posts	GET	PostController.php	index	要	投稿一覧を取得（いいね数・コメント数・いいね状態を含む）		user_id	-
/api/posts	POST	PostController.php	store	要	新しい投稿を作成	{"user_id": "string", "user_name": "string", "content": "string(最大120文字)"}	-	-
/api/posts/{id}	DELETE	PostController.php	destroy	要	投稿を削除（投稿者のみ）		user_id	id
/api/posts/{id}/like	POST	PostController.php	like	要	いいねの追加/削除（トグル）	{"user_id": "string"}	-	id
/api/posts/{postId}/comments	GET	CommentController.php	index	不要	指定された投稿のコメント一覧を取得		-	postId
/api/posts/{postId}/comments	POST	CommentController.php	store	要	新しいコメントを作成	{"user_id": "string", "user_name": "string", "content": "string(最大120文字)"}	-	postId
```

## エクセルに貼り付け用（CSV形式）

CSV形式でも提供します。

```
パス,メソッド,コントローラーファイル名,アクション,認証必須,説明,リクエストボディ,クエリパラメータ,パスパラメータ
/api/posts,GET,PostController.php,index,要,投稿一覧を取得（いいね数・コメント数・いいね状態を含む）,,user_id,-
/api/posts,POST,PostController.php,store,要,新しい投稿を作成,"{""user_id"": ""string"", ""user_name"": ""string"", ""content"": ""string(最大120文字)""}",-,-
/api/posts/{id},DELETE,PostController.php,destroy,要,投稿を削除（投稿者のみ）,,user_id,id
/api/posts/{id}/like,POST,PostController.php,like,要,いいねの追加/削除（トグル）,"{""user_id"": ""string""}",-,id
/api/posts/{postId}/comments,GET,CommentController.php,index,不要,指定された投稿のコメント一覧を取得,,-,postId
/api/posts/{postId}/comments,POST,CommentController.php,store,要,新しいコメントを作成,"{""user_id"": ""string"", ""user_name"": ""string"", ""content"": ""string(最大120文字)""}",-,postId
```

## 表形式（Markdown）

| パス | メソッド | コントローラーファイル名 | アクション | 認証必須 | 説明 | リクエストボディ | クエリパラメータ | パスパラメータ |
|------|---------|----------------------|-----------|---------|------|----------------|----------------|--------------|
| /api/posts | GET | PostController.php | index | 要 | 投稿一覧を取得（いいね数・コメント数・いいね状態を含む） | - | user_id | - |
| /api/posts | POST | PostController.php | store | 要 | 新しい投稿を作成 | {"user_id": "string", "user_name": "string", "content": "string(最大120文字)"} | - | - |
| /api/posts/{id} | DELETE | PostController.php | destroy | 要 | 投稿を削除（投稿者のみ） | - | user_id | id |
| /api/posts/{id}/like | POST | PostController.php | like | 要 | いいねの追加/削除（トグル） | {"user_id": "string"} | - | id |
| /api/posts/{postId}/comments | GET | CommentController.php | index | 不要 | 指定された投稿のコメント一覧を取得 | - | - | postId |
| /api/posts/{postId}/comments | POST | CommentController.php | store | 要 | 新しいコメントを作成 | {"user_id": "string", "user_name": "string", "content": "string(最大120文字)"} | - | postId |

## 詳細説明

### 1. GET /api/posts

- **説明**: すべての投稿を取得します。各投稿には、いいね数、コメント数、現在のユーザーがいいねしたかどうかの情報が含まれます。
- **クエリパラメータ**:
  - `user_id` (必須): Firebase認証のユーザーID（UID）。いいね状態を判定するために使用されます。
- **レスポンス**: 投稿オブジェクトの配列

### 2. POST /api/posts

- **説明**: 新しい投稿を作成します。
- **リクエストボディ**:
  - `user_id` (必須): Firebase認証のユーザーID（UID）
  - `user_name` (必須): 投稿者の名前
  - `content` (必須): 投稿内容（最大120文字）
- **レスポンス**: 作成された投稿オブジェクト（201 Created）

### 3. DELETE /api/posts/{id}

- **説明**: 指定されたIDの投稿を削除します。投稿の作成者のみが削除できます。
- **パスパラメータ**:
  - `id` (必須): 削除する投稿のID
- **クエリパラメータ**:
  - `user_id` (必須): Firebase認証のユーザーID（UID）。投稿の所有者かどうかを確認するために使用されます。
- **レスポンス**: 成功メッセージ（200 OK）またはエラーメッセージ（403 Forbidden）

### 4. POST /api/posts/{id}/like

- **説明**: 指定された投稿にいいねを追加または削除します（トグル機能）。既にいいねしている場合は削除、していない場合は追加されます。
- **パスパラメータ**:
  - `id` (必須): いいねする投稿のID
- **リクエストボディ**:
  - `user_id` (必須): Firebase認証のユーザーID（UID）
- **レスポンス**: いいね状態といいね数を含むオブジェクト

### 5. GET /api/posts/{postId}/comments

- **説明**: 指定された投稿に付けられたコメントの一覧を取得します。
- **パスパラメータ**:
  - `postId` (必須): コメントを取得する投稿のID
- **レスポンス**: コメントオブジェクトの配列

### 6. POST /api/posts/{postId}/comments

- **説明**: 指定された投稿に新しいコメントを追加します。
- **パスパラメータ**:
  - `postId` (必須): コメントを追加する投稿のID
- **リクエストボディ**:
  - `user_id` (必須): Firebase認証のユーザーID（UID）
  - `user_name` (必須): コメントした人の名前
  - `content` (必須): コメント内容（最大120文字）
- **レスポンス**: 作成されたコメントオブジェクト（201 Created）

## 注意事項

- 現在の実装では、認証はFirebase認証を使用していますが、バックエンドでのFirebase IDトークンの検証は実装されていません。
- `user_id`は、リクエストボディまたはクエリパラメータとして送信されます。
- 本番環境では、Firebase認証ミドルウェアを実装して、トークンから`user_id`を取得することを推奨します。

