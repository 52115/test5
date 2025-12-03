import { useAuth } from './useAuth'

/**
 * APIリクエストを送信するComposable
 */
export const useApi = () => {
  // setup関数内で useRuntimeConfig を呼び出す
  const { apiBase } = useRuntimeConfig().public
  const { getIdToken } = useAuth()

  /**
   * APIリクエストを送信
   */
  const request = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = await getIdToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // 認証トークンがある場合、ヘッダーに追加
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    })

    // レスポンスがJSONの場合、パース
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }
      
      return data
    }

    if (!response.ok) {
      throw new Error('API request failed')
    }

    return response
  }

  /**
   * GETリクエスト
   */
  const get = (endpoint: string) => {
    return request(endpoint, { method: 'GET' })
  }

  /**
   * POSTリクエスト
   */
  const post = (endpoint: string, data: any) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETEリクエスト
   */
  const del = (endpoint: string) => {
    return request(endpoint, { method: 'DELETE' })
  }

  return {
    get,
    post,
    delete: del,
  }
}

