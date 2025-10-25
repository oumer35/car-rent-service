export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name?: string;
  phone: string;
  role: Role;
}