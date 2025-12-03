import { onMounted } from 'vue'

/**
 * Firebase設定（クライアントサイドでのみ使用）
 */
const firebaseConfig = {
  apiKey: "AIzaSyCvwBar1zWLAv2kTiWLF2Herj0oM1gPWzw",
  authDomain: "test-ea147.firebaseapp.com",
  projectId: "test-ea147",
  storageBucket: "test-ea147.firebasestorage.app",
  messagingSenderId: "337577476032",
  appId: "1:337577476032:web:c5c5333075c06b05fc1225",
}

// Firebase Authインスタンスを取得する関数
const getAuthInstance = async () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getAuth } = await import('firebase/auth')

    // Firebaseを初期化（既に初期化されている場合はスキップ）
    let app
    const apps = getApps()
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig)
    } else {
      app = apps[0]
    }

    return getAuth(app)
  } catch (error) {
    console.error('Firebase Auth initialization error:', error)
    return null
  }
}

/**
 * Firebaseエラーメッセージを日本語に変換
 */
const getErrorMessage = (error: any): string => {
  if (!error) {
    return 'エラーが発生しました'
  }

  // エラーをコンソールに出力（デバッグ用）
  console.error('Firebase Auth Error:', error)

  // エラーコードを取得（Firebaseエラーの場合）
  const errorCode = error.code || error.error?.code || error.errorCode
  
  // エラーメッセージに-102が含まれている場合
  const errorMessageStr = error.message || error.error?.message || ''
  if (errorMessageStr.includes('-102') || errorCode === -102 || errorCode === '-102') {
    return 'ネットワーク接続エラーが発生しました。インターネット接続とFirebase設定を確認してください'
  }
  
  if (!errorCode) {
    // エラーコードがない場合、メッセージをそのまま返すか、デフォルトメッセージ
    return errorMessageStr || 'エラーが発生しました'
  }

  const errorMessages: Record<string, string> = {
    // 認証エラー
    'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
    'auth/user-not-found': 'このメールアドレスは登録されていません',
    'auth/wrong-password': 'パスワードが正しくありません',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-disabled': 'このアカウントは無効になっています',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/weak-password': 'パスワードが弱すぎます。6文字以上にしてください',
    'auth/operation-not-allowed': 'この認証方法は許可されていません',
    'auth/requires-recent-login': 'セキュリティのため、再度ログインしてください',
    
    // ネットワークエラー
    'auth/network-request-failed': 'ネットワークエラーが発生しました。インターネット接続を確認してください',
    '-102': 'ネットワーク接続エラーが発生しました。インターネット接続とFirebase設定を確認してください',
    
    // レート制限
    'auth/too-many-requests': 'リクエストが多すぎます。しばらくしてから再試行してください',
    
    // その他のエラー
    'auth/internal-error': '内部エラーが発生しました。しばらくしてから再試行してください',
    'auth/invalid-action-code': '無効なアクションコードです',
    'auth/expired-action-code': 'アクションコードの有効期限が切れています',
    'auth/invalid-verification-code': '検証コードが正しくありません',
    'auth/invalid-verification-id': '検証IDが正しくありません',
  }
  
  // エラーコードが数値の場合（-102など）
  if (typeof errorCode === 'number' || (!errorCode && error.message?.includes('-102'))) {
    return errorMessages['-102'] || 'ネットワーク接続エラーが発生しました'
  }

  // エラーコードに一致するメッセージを返す、なければ元のメッセージまたはデフォルト
  return errorMessages[errorCode] || error.message || 'エラーが発生しました。詳細: ' + errorCode
}

/**
 * Firebase認証を扱うComposable
 * ログイン、新規登録、ログアウト機能を提供
 */
export const useAuth = () => {
  // 現在のユーザー状態（型は動的に取得）
  const user = useState<any>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  // クライアントサイドでのみFirebase Authを初期化
  if (process.client) {
    // クライアントサイドでのみ実行されるようにonMountedを使用
    onMounted(async () => {
      try {
        const auth = await getAuthInstance()
        if (auth) {
          const { onAuthStateChanged } = await import('firebase/auth')
          // 認証状態の監視
          onAuthStateChanged(auth, (firebaseUser) => {
            user.value = firebaseUser
            loading.value = false
          })
        } else {
          loading.value = false
        }
      } catch (error) {
        console.error('Firebase Auth initialization error:', error)
        loading.value = false
      }
    })
  } else {
    // サーバーサイドではローディングをfalseに
    loading.value = false
  }
  

  /**
   * ログイン
   */
  const login = async (email: string, password: string) => {
    if (!process.client) {
      return { user: null, error: 'Client side only' }
    }
    
    try {
      const auth = await getAuthInstance()
      if (!auth) {
        return { user: null, error: 'Firebase Auth is not initialized' }
      }
      
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error: any) {
      return { user: null, error: getErrorMessage(error) }
    }
  }

  /**
   * 新規登録
   */
  const register = async (email: string, password: string) => {
    if (!process.client) {
      return { user: null, error: 'Client side only' }
    }
    
    try {
      const auth = await getAuthInstance()
      if (!auth) {
        return { user: null, error: 'Firebase Auth is not initialized' }
      }
      
      const { createUserWithEmailAndPassword } = await import('firebase/auth')
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error: any) {
      return { user: null, error: getErrorMessage(error) }
    }
  }

  /**
   * ログアウト
   */
  const logout = async () => {
    if (!process.client) {
      return { error: 'Client side only' }
    }
    
    try {
      const auth = await getAuthInstance()
      if (!auth) {
        return { error: 'Firebase Auth is not initialized' }
      }
      
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
      return { error: null }
    } catch (error: any) {
      return { error: getErrorMessage(error) }
    }
  }

  /**
   * 認証トークンを取得（APIリクエスト時に使用）
   */
  const getIdToken = async (): Promise<string | null> => {
    if (user.value) {
      return await user.value.getIdToken()
    }
    return null
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    register,
    logout,
    getIdToken
  }
}

