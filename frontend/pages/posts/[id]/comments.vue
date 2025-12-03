<template>
  <div class="comments-page">
    <!-- 左サイドバー -->
    <Sidebar />

    <!-- 右メインコンテンツ -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">コメント</h1>
        <div class="header-divider"></div>
      </div>

      <!-- 投稿表示 -->
      <div v-if="post" class="post-section">
        <div class="post-container">
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
            </div>
          </div>
          <div class="post-content">{{ post.content }}</div>
        </div>
        <div class="post-divider"></div>
      </div>

      <!-- コメントセクション -->
      <div class="comments-section">
        <h2 class="comments-title">コメント</h2>
        <div class="header-divider"></div>

        <!-- コメント一覧 -->
        <div class="comments-list">
          <div v-if="loadingComments" class="loading">読み込み中...</div>
          <div v-else-if="comments.length === 0" class="empty-state">
            まだコメントがありません。
          </div>
          <CommentCard
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
          />
        </div>

        <!-- コメント入力フォーム -->
        <div class="comment-form">
          <textarea
            v-model="commentContent"
            class="comment-input"
            placeholder="コメントを入力..."
            maxlength="120"
            rows="3"
          ></textarea>
          <div class="comment-actions">
            <span class="char-count">{{ commentContent.length }}/120</span>
            <button @click="handleSubmitComment" class="comment-button" :disabled="loading || !commentContent.trim()">
              {{ loading ? '投稿中...' : 'コメント' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { get, post: postApi, delete: del } = useApi()

const postId = route.params.id as string
const post = ref(null)
const comments = ref([])
const commentContent = ref('')
const loading = ref(false)
const loadingComments = ref(true)
const isLiked = ref(false)
const likeCount = ref(0)
const currentUserId = ref('')
const userName = ref('')

// 削除可能かどうか
const canDelete = computed(() => {
  return currentUserId.value && post.value?.user_id === currentUserId.value
})

// 認証チェック
const checkAuth = () => {
  if (!user.value) {
    router.push('/login')
    return false
  }
  return true
}

// 投稿を取得
const fetchPost = async () => {
  if (!checkAuth()) return

  currentUserId.value = user.value?.uid || ''
  userName.value = localStorage.getItem('userName') || 'User'

  try {
    const posts = await get(`/posts?user_id=${currentUserId.value}`)
    const foundPost = posts.find((p: any) => p.id.toString() === postId)
    
    if (!foundPost) {
      router.push('/')
      return
    }

    post.value = foundPost
    isLiked.value = foundPost.is_liked || false
    likeCount.value = foundPost.likes_count || 0
  } catch (error: any) {
    console.error('投稿の取得に失敗しました:', error)
    router.push('/')
  }
}

// コメント一覧を取得
const fetchComments = async () => {
  loadingComments.value = true

  try {
    const response = await get(`/posts/${postId}/comments`)
    comments.value = response
  } catch (error: any) {
    console.error('コメントの取得に失敗しました:', error)
    alert('コメントの取得に失敗しました')
  } finally {
    loadingComments.value = false
  }
}

// いいね処理
const handleLike = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const response = await postApi(`/posts/${postId}/like`, {
      user_id: currentUserId.value
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
    await del(`/posts/${postId}?user_id=${currentUserId.value}`)
    router.push('/')
  } catch (error: any) {
    alert('削除に失敗しました: ' + error.message)
  } finally {
    loading.value = false
  }
}

// コメント投稿
const handleSubmitComment = async () => {
  if (!commentContent.value.trim() || loading.value) {
    return
  }

  loading.value = true

  try {
    await postApi(`/posts/${postId}/comments`, {
      content: commentContent.value.trim(),
      user_id: currentUserId.value,
      user_name: userName.value
    })

    // コメント投稿成功：フォームをクリアしてコメント一覧を再取得
    commentContent.value = ''
    await fetchComments()
  } catch (error: any) {
    alert('コメントの投稿に失敗しました: ' + error.message)
  } finally {
    loading.value = false
  }
}

// ページ読み込み時にデータを取得
onMounted(async () => {
  await fetchPost()
  await fetchComments()
})

// メタ情報
definePageMeta({
  layout: false
})
</script>

<style scoped>
.comments-page {
  display: flex;
  min-height: 100vh;
  background-color: #282c34;
}

.main-content {
  flex: 1;
  padding: 20px;
  color: #ffffff;
}

.content-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.header-divider {
  height: 1px;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: 20px;
}

.post-section {
  margin-bottom: 30px;
}

.post-container {
  padding: 20px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  margin-bottom: 10px;
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
}

.action-button:hover {
  opacity: 0.7;
}

.action-button.liked .icon {
  color: #ef4444;
}

.post-content {
  color: #ffffff;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-divider {
  height: 1px;
  background-color: #4a5568;
}

.comments-section {
  margin-top: 30px;
}

.comments-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.comments-list {
  margin-bottom: 30px;
}

.loading,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  background-color: transparent;
  color: #ffffff;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.comment-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.comment-button {
  padding: 10px 20px;
  background-color: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.comment-button:hover:not(:disabled) {
  background-color: #6d28d9;
}

.comment-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

