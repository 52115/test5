<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * 指定された投稿のコメント一覧を取得
     */
    public function index(string $postId)
    {
        $post = Post::findOrFail($postId);
        $comments = Comment::where('post_id', $postId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comments);
    }

    /**
     * 新しいコメントを作成
     */
    public function store(string $postId, StoreCommentRequest $request)
    {
        $post = Post::findOrFail($postId);

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $request->user_id, // Firebase UID
            'user_name' => $request->user_name,
            'content' => $request->content,
        ]);

        return response()->json($comment, 201);
    }
}
