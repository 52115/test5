<template>
  <div class="post-card">
    <div class="post-header">
      <span class="post-username">{{ post.user_name }}</span>
      <div class="post-actions">
        <button @click="handleLike" class="action-button" :class="{ 'liked': isLiked }">
          <span class="icon">❤️</span>
          <span class="count">{{ likeCount }}</span>
        </button>
        <button v-if="canDelete" @click="handleDelete" class="action-button delete">
          <span class="icon">×</span>
        </button>
        <NuxtLink :to="`/posts/${post.id}/comments`" class="action-button">
          <span class="icon">→</span>
          <span v-if="commentCount > 0" class="comment-badge">{{ commentCount }}</span>
        </NuxtLink>
      </div>
    </div>
    <div class="post-content">{{ post.content }}</div>
    <div class="post-divider"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: any
  currentUserId?: string
}>()

const { get, delete: del, post: postApi } = useApi()
const isLiked = ref(props.post.is_liked || false)
const likeCount = ref(props.post.likes_count || 0)
const commentCount = ref(props.post.comments_count || 0)
const loading = ref(false)

// 削除可能かどうか（投稿者が現在のユーザーの場合）
const canDelete = computed(() => {
  return props.currentUserId && props.post.user_id === props.currentUserId
})

// いいね処理
const handleLike = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const response = await postApi(`/posts/${props.post.id}/like`, {
      user_id: props.currentUserId || ''
    })
    
    isLiked.value = response.is_liked
    likeCount.value = response.like_count
  } catch (error: any) {
    alert('いいねに失敗しました: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 削除処理
const handleDelete = async () => {
  if (!confirm('この投稿を削除しますか？')) {
    return
  }
  
  loading.value = true
  
  try {
    await del(`/posts/${props.post.id}?user_id=${props.currentUserId || ''}`)
    
    // ページをリロードせずに投稿リストを更新
    window.dispatchEvent(new CustomEvent('refresh-posts'))
  } catch (error: any) {
    alert('削除に失敗しました: ' + error.message)
  } finally {
    loading.value = false
  }
}

// コメント数を更新（親コンポーネントから呼び出される可能性があるため）
defineExpose({
  updateCommentCount: (count: number) => {
    commentCount.value = count
  }
})
</script>

<style scoped>
.post-card {
  padding: 20px;
  border-bottom: 1px solid #4a5568;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-username {
  font-weight: bold;
  color: #ffffff;
}

.post-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  transition: opacity 0.3s;
  text-decoration: none;
  position: relative;
}

.action-button:hover {
  opacity: 0.7;
}

.action-button.liked .icon {
  color: #ef4444;
}

.comment-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.post-content {
  color: #ffffff;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-divider {
  height: 1px;
  background-color: #4a5568;
  margin-top: 10px;
}
</style>

