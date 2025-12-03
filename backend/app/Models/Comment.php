<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /**
     * 一括代入可能な属性
     */
    protected $fillable = [
        'post_id',
        'user_id',
        'user_name',
        'content',
    ];

    /**
     * このコメントが属する投稿を取得
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
