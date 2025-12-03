<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /**
     * 一括代入可能な属性
     */
    protected $fillable = [
        'user_id',
        'user_name',
        'content',
    ];

    /**
     * この投稿に付いたいいねを取得
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    /**
     * この投稿に付いたコメントを取得
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
