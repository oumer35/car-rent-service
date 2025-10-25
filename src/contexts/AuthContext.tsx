import React, { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/authService';
import { type User } from '../types/User';

type AuthContextValue = {
  user: User | null;
  signUp: (phone: string, name?: string) => void;
  signIn: (phone: string) => boolean;
  signOut: () => void;
  token: string | null;
  sendCode: (phone: string) => string;
  verifyCode: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = auth.currentToken();
    const u = auth.currentUser();
    setToken(t);
    setUser(u);
  }, []);

  const signUp = (phone: string, name?: string) => {
    const res = auth.signUp(phone, name);
    setToken(res.token);
    setUser(res.user);
  };

  const signIn = (phone: string) => {
    const res = auth.signIn(phone);
    if (!res) return false;
    setToken(res.token);
    setUser(res.user);
    return true;
  };

  const signOut = () => {
    auth.signOut();
    setToken(null);
    setUser(null);
  };

  const sendCode = (phone: string) => {
    return auth.sendCode(phone);
  };

  const verifyCode = (code: string) => {
    const result = auth.verifyCode(code);
    if (result) {
      const u = auth.currentUser();
      setUser(u);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp, 
      signIn, 
      signOut, 
      token,
      sendCode,
      verifyCode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}