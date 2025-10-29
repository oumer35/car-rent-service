import { createContext, useContext } from 'react'
import type { User } from '../types'

export interface AuthContextValue {
  user: User | null
  token: string | null
  signIn: (phone: string) => Promise<void>
  signOut: () => void
  sendVerificationCode: (phone: string) => Promise<{ success: boolean; message: string }>
  verifyCode: (phone: string, code: string) => Promise<{ token: string; user: User }>
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
