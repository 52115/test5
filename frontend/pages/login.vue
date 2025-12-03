<template>
  <div class="login-page">
    <!-- ヘッダー -->
    <header class="header">
      <div class="logo">SHARE</div>
      <nav class="nav">
        <NuxtLink to="/register" class="nav-link">会員登録</NuxtLink>
        <NuxtLink to="/login" class="nav-link active">ログイン</NuxtLink>
      </nav>
    </header>

    <!-- ログインフォーム -->
    <main class="main-content">
      <div class="form-card">
        <h1 class="form-title">ログイン</h1>
        
        <form @submit.prevent="handleLogin" class="form" novalidate>
          <!-- メールアドレス -->
          <div class="form-group">
            <label for="email" class="form-label">メールアドレス</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="メールアドレスを入力"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- パスワード -->
          <div class="form-group">
            <label for="password" class="form-label">パスワード</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="パスワードを入力"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="errorMessage" class="error-message-container">
            {{ errorMessage }}
          </div>

          <!-- ログインボタン -->
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'ログイン中...' : 'ログイン' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

// フォームデータ
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({
  email: '',
  password: ''
})

// バリデーション
const validate = () => {
  errors.value = { email: '', password: '' }
  
  if (!email.value) {
    errors.value.email = 'メールアドレスは必須です'
    return false
  }
  
  if (!password.value) {
    errors.value.password = 'パスワードは必須です'
    return false
  }
  
  return true
}

// ログイン処理
const handleLogin = async () => {
  // バリデーション
  if (!validate()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { user, error } = await login(email.value, password.value)
    
    if (error) {
      errorMessage.value = error
      return
    }

    if (user) {
      // ログイン成功：投稿一覧ページへ遷移
      await router.push('/')
    }
  } catch (error: any) {
    // エラーの詳細をコンソールに出力（デバッグ用）
    console.error('Login error:', error)
    
    // エラーメッセージを日本語で表示
    const errorCode = error?.code || error?.errorCode
    const errorMsg = error?.message || error?.error?.message || ''
    
    // エラーコード-102の処理
    if (errorCode === -102 || errorCode === '-102' || errorMsg.includes('-102')) {
      errorMessage.value = 'ネットワーク接続エラーが発生しました。インターネット接続とFirebase設定を確認してください'
    } else if (errorCode) {
      // Firebaseエラーの場合、エラーコードから日本語メッセージを取得
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
        'auth/user-not-found': 'このメールアドレスは登録されていません',
        'auth/wrong-password': 'パスワードが正しくありません',
        'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      }
      errorMessage.value = errorMessages[errorCode] || errorMsg || 'ログインに失敗しました'
    } else {
      errorMessage.value = errorMsg || 'ログインに失敗しました'
    }
  } finally {
    loading.value = false
  }
}

// メタ情報
definePageMeta({
  layout: false
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #282c34;
  color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.active {
  font-weight: bold;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 30px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

.form-input {
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  font-size: 12px;
  color: #ef4444;
}

.error-message-container {
  padding: 12px;
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 4px;
  color: #dc2626;
  font-size: 14px;
}

.submit-button {
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

.submit-button:hover:not(:disabled) {
  background-color: #6d28d9;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

