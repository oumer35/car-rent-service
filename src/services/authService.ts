import { type User } from '../types/User';
import { read, write } from './storage';
import apiRequest from './api'

const USERS_KEY = 'cr_users';
const TOKEN_KEY = 'cr_token';

export function signUp(phone: string, name?: string): { token: string; user: User } {
  const users = read<User[]>(USERS_KEY, []);
  const id = 'u_' + Date.now();
  const user: User = { 
    id, 
    name: name || ('User ' + phone.slice(-4)), 
    phone, 
    role: 'user' 
  };
  users.push(user);
  write(USERS_KEY, users);
  const token = btoa(JSON.stringify({ sub: id, iat: Date.now() }));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('cr_user', JSON.stringify(user));
  return { token, user };
}

export function signIn(phone: string): { token: string; user: User } | null {
  const users = read<User[]>(USERS_KEY, []);
  const user = users.find(u => u.phone === phone);
  if (!user) return null;
  const token = btoa(JSON.stringify({ sub: user.id, iat: Date.now() }));
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('cr_user', JSON.stringify(user));
  return { token, user };
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('cr_user');
}

export function currentToken() { 
  return localStorage.getItem(TOKEN_KEY); 
}

export function currentUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem('cr_user') || 'null');
  } catch {
    return null;
  }
}

// Phone verification simulation
export function sendCode(phone: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem('cr_code', code);
  localStorage.setItem('cr_phone', phone);
  console.info('DEBUG: verification code', code);
  return code;
}

export function verifyCode(input: string): boolean {
  const code = localStorage.getItem('cr_code');
  const phone = localStorage.getItem('cr_phone');
  if (!code || input !== code) return false;
  
  const users = read<User[]>(USERS_KEY, []);
  const user = users.find(u => u.phone === phone);
  if (user) {
    const token = btoa(JSON.stringify({ sub: user.id, iat: Date.now() }));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('cr_user', JSON.stringify(user));
  }
  
  localStorage.removeItem('cr_code');
  localStorage.removeItem('cr_phone');
  return true;
}

export const authService = {
  async sendCode(phone: string): Promise<{ debugCode: string }> {
    const response = await apiRequest('/auth/send-code', {
      method: 'POST',
      body: { phone }
    });
    return response.debugCode; // Use response.code in production
  },

  async signUp(phone: string, name: string, code: string): Promise<{ token: string; user: User }> {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: { phone, name, code }
    });
    
    localStorage.setItem('cr_token', response.token);
    localStorage.setItem('cr_user', JSON.stringify(response.user));
    
    return response;
  },

  async signIn(phone: string, code: string): Promise<{ token: string; user: User }> {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: { phone, code }
    });
    
    localStorage.setItem('cr_token', response.token);
    localStorage.setItem('cr_user', JSON.stringify(response.user));
    
    return response;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest('/auth/me');
    return response.user;
  },

  signOut(): void {
    localStorage.removeItem('cr_token');
    localStorage.removeItem('cr_user');
  },

  currentToken(): string | null {
    return localStorage.getItem('cr_token');
  },

  currentUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem('cr_user') || 'null');
    } catch {
      return null;
    }
  }
};