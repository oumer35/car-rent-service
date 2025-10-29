import React, { createContext, useState, useEffect, useContext } from 'react'
import { authService } from '../services/api'
import type { User } from '../types'

// ✅ Define what your AuthContext will provide to components
export interface AuthContextValue {
  user: User | null
  token: string | null
  signIn: (phone: string) => Promise<void>
  signOut: () => void
  sendVerificationCode: (phone: string) => Promise<{ success: boolean; message: string }>
  verifyCode: (phone: string, code: string) => Promise<{ token: string; user: User }>
  loading: boolean
}

// ✅ Create the context
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user/token from localStorage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('cr_token')
    const savedUser = localStorage.getItem('cr_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // ✅ Sign in with phone (e.g. one-step auth)
  const signIn = async (phone: string) => {
    setLoading(true)
    try {
      const res = await authService.signIn(phone)
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('cr_token', res.token)
      localStorage.setItem('cr_user', JSON.stringify(res.user))
    } finally {
      setLoading(false)
    }
  }

  // ✅ Sign out
  const signOut = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_user')
  }

  // ✅ Send verification code (for 2-step auth)
  const sendVerificationCode = async (phone: string) => {
    // call your API
    const res = await authService.sendVerificationCode(phone)
    return res
  }

  // ✅ Verify the code and store credentials
  const verifyCode = async (phone: string, code: string) => {
    const res = await authService.verifyCode(phone, code)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem('cr_token', res.token)
    localStorage.setItem('cr_user', JSON.stringify(res.user))
    return res
  }

  // ✅ Provide context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        sendVerificationCode,
        verifyCode,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
