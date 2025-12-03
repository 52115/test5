<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * 投稿一覧を取得
     * いいね数とコメント数も含めて返す
     */
    public function index(Request $request)
    {
        $posts = Post::withCount(['likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 現在のユーザーがいいねした投稿IDのリストを取得
        $userId = $request->user_id; // フロントエンドから送られてくるFirebase UID
        $likedPostIds = [];
        
        if ($userId) {
            $likedPostIds = Like::where('user_id', $userId)
                ->pluck('post_id')
                ->toArray();
        }

        // 各投稿に、現在のユーザーがいいねしたかどうかを追加
        $posts = $posts->map(function ($post) use ($likedPostIds) {
            $post->is_liked = in_array($post->id, $likedPostIds);
            return $post;
        });

        return response()->json($posts);
    }

    /**
     * 新しい投稿を作成
     */
    public function store(StorePostRequest $request)
    {
        $post = Post::create([
            'user_id' => $request->user_id, // Firebase UID
            'user_name' => $request->user_name,
            'content' => $request->content,
        ]);

        return response()->json($post, 201);
    }

    /**
     * 投稿を削除
     */
    public function destroy(string $id, Request $request)
    {
        $post = Post::findOrFail($id);
        
        // 投稿の作成者のみ削除可能
        if ($post->user_id !== $request->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully'], 200);
    }

    /**
     * いいねの追加/削除（トグル）
     */
    public function like(string $id, Request $request)
    {
        $post = Post::findOrFail($id);
        $userId = $request->user_id; // Firebase UID

        // 既にいいねしているか確認
        $existingLike = Like::where('post_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            // いいねを削除
            $existingLike->delete();
            $isLiked = false;
        } else {
            // いいねを追加
            Like::create([
                'post_id' => $id,
                'user_id' => $userId,
            ]);
            $isLiked = true;
        }

        // いいね数を取得
        $likeCount = Like::where('post_id', $id)->count();

        return response()->json([
            'is_liked' => $isLiked,
            'like_count' => $likeCount,
        ]);
    }
}
