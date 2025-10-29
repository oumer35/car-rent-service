import React, { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/api'
import type { User } from '../types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cr_token')
    const savedUser = localStorage.getItem('cr_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

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

  const signOut = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_user')
  }

  const sendVerificationCode = async (phone: string) => {
    return await authService.sendVerificationCode(phone)
  }

  const verifyCode = async (phone: string, code: string) => {
    const res = await authService.verifyCode(phone, code)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem('cr_token', res.token)
    localStorage.setItem('cr_user', JSON.stringify(res.user))
    return res
  }

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
