import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { supabase } from './supabase'

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
const LOGIN_URL = '/auth?mode=signin'

const config: AxiosRequestConfig = {
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500 // Allow 400-level responses to be handled
}

const apiInstance: AxiosInstance = axios.create(config)

// Track token refresh attempts to prevent infinite loops
let tokenRefreshAttempts = 0
let isRedirecting = false
const MAX_REFRESH_ATTEMPTS = 2
const REFRESH_COOLDOWN = 1000 // 1 second between refresh attempts

// Helper function to handle login redirects
const redirectToLogin = () => {
  if (typeof window !== 'undefined' && !isRedirecting) {
    isRedirecting = true
    console.log('[API] Redirecting to login page')
    window.location.href = LOGIN_URL
  }
}

// Add request interceptor to handle API URL and auth token
apiInstance.interceptors.request.use(
  async (config) => {
    // Ensure we're using the correct API URL
    if (config.url?.startsWith('/api/')) {
      config.baseURL = typeof window !== 'undefined' ? window.location.origin : '';
    }

    const { data: { session } } = await supabase.auth.getSession()
    console.log('[API] Auth session check:', {
      hasSession: !!session,
      hasToken: !!session?.access_token,
      url: config.url
    })

    if (session?.access_token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${session.access_token}`
      console.log('[API] Added auth token to request:', {
        url: config.url,
        tokenPrefix: session.access_token.substring(0, 10) + '...'
      })
    } else {
      console.warn('[API] No auth token available for request:', config.url)
    }
    return config
  },
  (error) => {
    console.error('[API] Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
apiInstance.interceptors.response.use(
  (response) => {
    // Reset refresh attempts on successful response
    tokenRefreshAttempts = 0
    return response
  },
  async (error: AxiosError) => {
    console.log('[API] Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    })

    if (error.response?.status === 401 && error.config) {
      // Check if we're not already on the login/auth pages
      if (typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/auth')) {
            
        // Check if we've exceeded refresh attempts
        if (tokenRefreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          console.log('[API] Max token refresh attempts reached, redirecting to login')
          redirectToLogin()
          return Promise.reject(error)
        }

        // Check if we have a session first
        const { data: { session } } = await supabase.auth.getSession()
        console.log('[API] Session check after 401:', {
          hasSession: !!session,
          hasToken: !!session?.access_token,
          path: window.location.pathname,
          refreshAttempts: tokenRefreshAttempts
        })
        
        if (!session) {
          console.log('[API] No session found, redirecting to login')
          redirectToLogin()
          return Promise.reject(error)
        }

        console.log('[API] Session exists but got 401, attempting token refresh')
        tokenRefreshAttempts++

        try {
          // Add delay between refresh attempts
          await new Promise(resolve => setTimeout(resolve, REFRESH_COOLDOWN))
          
          const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession()
          if (newSession && !refreshError) {
            console.log('[API] Token refreshed successfully')
            // Retry the original request with new token
            const retryConfig = {
              ...error.config,
              headers: {
                ...error.config.headers,
                Authorization: `Bearer ${newSession.access_token}`
              }
            }
            return apiInstance(retryConfig)
          } else {
            console.error('[API] Token refresh failed:', refreshError)
            if (tokenRefreshAttempts >= MAX_REFRESH_ATTEMPTS) {
              redirectToLogin()
            }
            return Promise.reject(error)
          }
        } catch (refreshError) {
          console.error('[API] Token refresh error:', refreshError)
          if (tokenRefreshAttempts >= MAX_REFRESH_ATTEMPTS) {
            redirectToLogin()
          }
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(error)
  }
)

export type ApiResponse<T> = {
  data: T
  error?: string
  status: number
}

export const api = apiInstance
export default apiInstance
