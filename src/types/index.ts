// src/types/index.ts
export type Role = 'user' | 'admin'

export interface User {
  id: string
  name?: string
  phone: string
  role: Role
  email?: string
  createdAt: string
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface Booking {
  id: string
  carId: string
  userId: string
  userName: string
  phone: string
  startDate: string
  endDate: string
  totalPrice: number
  status: BookingStatus
  createdAt: string
  address?: string
  collateral?: string
}

export interface Car {
  id: string
  name: string
  pricePerDay: number
  image: string
  seats: number
  transmission: string
  brand?: string
  description?: string
  available?: boolean
  features?: string[]
  fuelType?: string
  mileage?: number
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface VerificationRequest {
  phone: string
  code: string
}

export interface BookingRequest {
  carId: string
  startDate: string
  endDate: string
  userName: string
  phone: string
  address: string
  collateral: string
}
export interface Activity {
  type: 'booking' | 'car'
  message: string
  time: string
  color: 'primary' | 'success' | 'warning' | 'error'
}