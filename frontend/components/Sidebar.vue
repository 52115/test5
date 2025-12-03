<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">SHARE</h1>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span>ホーム</span>
      </NuxtLink>
      <button @click="handleLogout" class="nav-item logout">
        <span class="nav-icon">→</span>
        <span>ログアウト</span>
      </button>
    </nav>

    <div class="divider"></div>

    <div class="share-section">
      <h2 class="share-title">シェア</h2>
      <textarea
        v-model="postContent"
        class="share-input"
        placeholder="何を考えていますか？"
        maxlength="120"
        rows="4"
      ></textarea>
      <div class="char-count">{{ postContent.length }}/120</div>
      <button @click="handlePost" class="share-button" :disabled="loading || !postContent.trim()">
        {{ loading ? '投稿中...' : 'シェアする' }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()
const { post } = useApi()
const router = useRouter()
const postContent = ref('')
const loading = ref(false)
const userName = ref('')

// ローカルストレージからユーザーネームを取得
onMounted(() => {
  if (process.client) {
    userName.value = localStorage.getItem('userName') || 'User'
  }
})

// 投稿処理
const handlePost = async () => {
  if (!postContent.value.trim() || loading.value) {
    return
  }

  loading.value = true

  try {
    await post('/posts', {
      content: postContent.value.trim(),
      user_id: user.value?.uid || '',
      user_name: userName.value
    })

    // 投稿成功：フォームをクリア
    postContent.value = ''
    
    // ページをリロードせずに投稿を更新
    // 現在のページがタイムラインの場合のみ更新
    if (window.location.pathname === '/') {
      // イベントを発火して投稿リストを更新
      window.dispatchEvent(new CustomEvent('refresh-posts'))
    } else {
      // タイムラインページに遷移
      await navigateTo('/')
    }
  } catch (error: any) {
    alert('投稿に失敗しました: ' + error.message)
  } finally {
    loading.value = false
  }
}

// ログアウト処理
const handleLogout = async () => {
  const { error } = await logout()
  
  if (!error) {
    localStorage.removeItem('userName')
    await router.push('/login')
  }
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  min-height: 100vh;
  background-color: #282c34;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-header {
  margin-bottom: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: #ffffff;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  text-align: left;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.nav-icon {
  font-size: 20px;
}

.divider {
  height: 1px;
  background-color: #4a5568;
  margin: 10px 0;
}

.share-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-title {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 10px;
}

.share-input {
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

.share-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.share-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.char-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.share-button {
  padding: 12px;
  background-color: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.share-button:hover:not(:disabled) {
  background-color: #6d28d9;
}

.share-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

