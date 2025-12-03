<template>
  <div class="register-page">
    <!-- ヘッダー -->
    <header class="header">
      <div class="logo">SHARE</div>
      <nav class="nav">
        <NuxtLink to="/register" class="nav-link active">新規登録</NuxtLink>
        <NuxtLink to="/login" class="nav-link">ログイン</NuxtLink>
      </nav>
    </header>

    <!-- 新規登録フォーム -->
    <main class="main-content">
      <div class="form-card">
        <h1 class="form-title">新規登録</h1>
        
        <form @submit.prevent="handleRegister" class="form" novalidate>
          <!-- ユーザーネーム -->
          <div class="form-group">
            <label for="username" class="form-label">ユーザーネーム</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              :class="{ 'error': errors.username }"
              placeholder="ユーザーネームを入力（20文字以内）"
              maxlength="20"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            <span class="char-count">{{ username.length }}/20</span>
          </div>

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
              placeholder="パスワードを入力（6文字以上）"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- エラーメッセージ -->
          <div v-if="errorMessage" class="error-message-container">
            {{ errorMessage }}
          </div>

          <!-- 新規登録ボタン -->
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? '登録中...' : '新規登録' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const router = useRouter()

// フォームデータ
const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({
  username: '',
  email: '',
  password: ''
})

// バリデーション
const validate = () => {
  errors.value = { username: '', email: '', password: '' }
  let isValid = true

  // ユーザーネーム：必須、20文字以内
  if (!username.value) {
    errors.value.username = 'ユーザーネームは必須です'
    isValid = false
  } else if (username.value.length > 20) {
    errors.value.username = 'ユーザーネームは20文字以内で入力してください'
    isValid = false
  }

  // メールアドレス：必須、メール形式
  if (!email.value) {
    errors.value.email = 'メールアドレスは必須です'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errors.value.email = '正しいメールアドレスを入力してください'
      isValid = false
    }
  }

  // パスワード：必須、6文字以上
  if (!password.value) {
    errors.value.password = 'パスワードは必須です'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'パスワードは6文字以上で入力してください'
    isValid = false
  }

  return isValid
}

// 新規登録処理
const handleRegister = async () => {
  // バリデーション
  if (!validate()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { user, error } = await register(email.value, password.value)
    
    if (error) {
      errorMessage.value = error
      return
    }

    if (user) {
      // ユーザーネームをローカルストレージに保存
      localStorage.setItem('userName', username.value)
      
      // 登録成功：ログインページへ遷移
      await router.push('/login')
    }
  } catch (error: any) {
    // エラーの詳細をコンソールに出力（デバッグ用）
    console.error('Registration error:', error)
    
    // エラーメッセージを日本語で表示
    const errorCode = error?.code || error?.errorCode
    const errorMsg = error?.message || error?.error?.message || ''
    
    // エラーコード-102の処理
    if (errorCode === -102 || errorCode === '-102' || errorMsg.includes('-102')) {
      errorMessage.value = 'ネットワーク接続エラーが発生しました。インターネット接続とFirebase設定を確認してください'
    } else if (errorCode) {
      // Firebaseエラーの場合、エラーコードから日本語メッセージを取得
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
        'auth/invalid-email': 'メールアドレスの形式が正しくありません',
        'auth/weak-password': 'パスワードが弱すぎます。6文字以上にしてください',
        'auth/network-request-failed': 'ネットワークエラーが発生しました。インターネット接続を確認してください',
      }
      errorMessage.value = errorMessages[errorCode] || errorMsg || '登録に失敗しました'
    } else {
      errorMessage.value = errorMsg || '登録に失敗しました'
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
.register-page {
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

.char-count {
  font-size: 12px;
  color: #666666;
  text-align: right;
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

