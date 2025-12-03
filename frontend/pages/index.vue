<template>
  <div class="timeline-page">
    <!-- 左サイドバー -->
    <Sidebar />

    <!-- 右メインコンテンツ -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">ホーム</h1>
        <div class="header-divider"></div>
      </div>

      <div class="posts-container">
        <div v-if="loading" class="loading">読み込み中...</div>
        <div v-else-if="posts.length === 0" class="empty-state">
          まだ投稿がありません。最初の投稿をしてみましょう！
        </div>
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :current-user-id="currentUserId"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, loading: authLoading } = useAuth()
const { get } = useApi()

const posts = ref([])
const loading = ref(true)
const currentUserId = ref('')

// 認証チェック（認証状態の読み込みが完了してからチェック）
const router = useRouter()
const checkAuth = () => {
  // 認証状態の読み込みが完了するまで待つ
  if (authLoading.value) {
    return null // まだ読み込み中
  }
  
  if (!user.value) {
    router.push('/login')
    return false
  }
  return true
}

// 投稿一覧を取得
const fetchPosts = async () => {
  // 認証状態の読み込みが完了するまで待つ
  if (authLoading.value) {
    // 認証状態が読み込まれるまで待機
    await new Promise<void>((resolve) => {
      const unwatch = watch(authLoading, (loading) => {
        if (!loading) {
          unwatch()
          resolve()
        }
      })
      
      // タイムアウトを設定（5秒）
      setTimeout(() => {
        unwatch()
        resolve()
      }, 5000)
    })
  }

  const authResult = checkAuth()
  if (authResult === null) {
    // まだ読み込み中
    return
  }
  if (!authResult) {
    // 認証失敗
    return
  }

  loading.value = true
  currentUserId.value = user.value?.uid || ''

  try {
    const response = await get(`/posts?user_id=${currentUserId.value}`)
    posts.value = response
  } catch (error: any) {
    console.error('投稿の取得に失敗しました:', error)
    // 認証エラーの場合はログイン画面にリダイレクトしない
    if (error.message && error.message.includes('認証')) {
      console.error('認証エラー:', error)
    } else {
      alert('投稿の取得に失敗しました')
    }
  } finally {
    loading.value = false
  }
}

// 投稿を再取得する関数（外部から呼び出し可能）
const refreshPosts = () => {
  fetchPosts()
}

// ページ読み込み時に投稿を取得
onMounted(() => {
  fetchPosts()
  
  // 投稿更新イベントをリスン
  if (process.client) {
    window.addEventListener('refresh-posts', fetchPosts)
  }
})

// クリーンアップ
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('refresh-posts', fetchPosts)
  }
})

// 投稿更新用のイベントを定義（Sidebarから呼び出し可能）
defineExpose({
  refreshPosts
})

// メタ情報
definePageMeta({
  layout: false
})
</script>

<style scoped>
.timeline-page {
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
  height: 2px;
  background-color: #3b82f6;
  width: 100%;
}

.posts-container {
  display: flex;
  flex-direction: column;
}

.loading,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
}
</style>

