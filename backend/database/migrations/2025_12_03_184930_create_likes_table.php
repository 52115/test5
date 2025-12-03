<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // 投稿ID（外部キー）
            $table->string('user_id'); // Firebase UID
            $table->timestamps(); // created_at, updated_at
            $table->unique(['post_id', 'user_id']); // 1つの投稿に1ユーザーは1回だけいいね可能
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
