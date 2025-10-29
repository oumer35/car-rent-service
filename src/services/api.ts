// // src/services/api.ts
// import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('cr_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('cr_token')
//       localStorage.removeItem('cr_user')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// // Auth Services
// export const authService = {
//   async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
//     const response = await api.post('/auth/send-code', { phone })
//     return response.data
//   },

//   async verifyCode(phone: string, code: string): Promise<{ token: string; user: User }> {
//     const response = await api.post('/auth/verify-code', { phone, code })
//     return response.data
//   },

//   async signUp(userData: { phone: string; name: string; email?: string }): Promise<{ token: string; user: any }> {
//     const response = await api.post('/auth/signup', userData)
//     return response.data
//   },

//   async signIn(phone: string): Promise<{ token: string; user: any }> {
//     const response = await api.post('/auth/signin', { phone })
//     return response.data
//   },

//   async getProfile(): Promise<any> {
//     const response = await api.get('/auth/profile')
//     return response.data
//   },

//   signOut(): void {
//     localStorage.removeItem('cr_token')
//     localStorage.removeItem('cr_user')
//   },

//   currentToken(): string | null {
//     return localStorage.getItem('cr_token')
//   },

//   currentUser(): any {
//     const user = localStorage.getItem('cr_user')
//     return user ? JSON.parse(user) : null
//   }
// }

// // Car Services
// export const carService = {
//   async getAllCars(): Promise<any[]> {
//     const response = await api.get('/cars')
//     return response.data
//   },

//   async getCarById(id: string): Promise<any> {
//     const response = await api.get(`/cars/${id}`)
//     return response.data
//   },

//   async createCar(carData: Partial<any>): Promise<any> {
//     const response = await api.post('/cars', carData)
//     return response.data
//   },

//   async updateCar(id: string, carData: Partial<any>): Promise<any> {
//     const response = await api.put(`/cars/${id}`, carData)
//     return response.data
//   },

//   async deleteCar(id: string): Promise<void> {
//     await api.delete(`/cars/${id}`)
//   },

//   async searchCars(query: string): Promise<any[]> {
//     const response = await api.get(`/cars/search?q=${query}`)
//     return response.data
//   }
// }

// // Booking Services
// export const bookingService = {
//   async getAllBookings(): Promise<any[]> {
//     const response = await api.get('/bookings')
//     return response.data
//   },

//   async getUserBookings(userId: string): Promise<any[]> {
//     const response = await api.get(`/bookings/user/${userId}`)
//     return response.data
//   },

//   async createBooking(bookingData: Partial<any>): Promise<any> {
//     const response = await api.post('/bookings', bookingData)
//     return response.data
//   },

//   async updateBookingStatus(id: string, status: string): Promise<any> {
//     const response = await api.patch(`/bookings/${id}/status`, { status })
//     return response.data
//   },

//   async cancelBooking(id: string): Promise<void> {
//     await api.delete(`/bookings/${id}`)
//   },

//   async calculatePrice(carId: string, startDate: string, endDate: string, options: any): Promise<number> {
//     const response = await api.post('/bookings/calculate-price', {
//       carId,
//       startDate,
//       endDate,
//       options
//     })
//     return response.data.totalPrice
//   }
// }

// // User Services
// export const userService = {
//   async getAllUsers(): Promise<any[]> {
//     const response = await api.get('/users')
//     return response.data
//   },

//   async updateUserRole(id: string, role: string): Promise<any> {
//     const response = await api.patch(`/users/${id}/role`, { role })
//     return response.data
//   },

//   async deleteUser(id: string): Promise<void> {
//     await api.delete(`/users/${id}`)
//   }
// }

// // Storage utilities (for backward compatibility)
// export const storage = {
//   read<T>(key: string, defaultValue: T): T {
//     try {
//       const item = localStorage.getItem(key)
//       return item ? JSON.parse(item) : defaultValue
//     } catch {
//       return defaultValue
//     }
//   },

//   write<T>(key: string, value: T): void {
//     localStorage.setItem(key, JSON.stringify(value))
//   }
// }

// export default api

import axios from 'axios'
import type { User, Car, Booking } from '../types/index'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// 🔹 Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 🔹 Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cr_token')
      localStorage.removeItem('cr_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ------------------- Auth Services -------------------
export const authService = {
  sendVerificationCode: async (phone: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/send-code`, { phone })
    return res.data
  },

  verifyCode: async (phone: string, code: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/verify`, { phone, code })
    return res.data
  },

  async signUp(userData: Pick<User, 'phone' | 'name' | 'email'>): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/signup', userData)
    return data
  },

  async signIn(phone: string): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/signin', { phone })
    return data
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get('/auth/profile')
    return data
  },

  signOut(): void {
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_user')
  },

  currentToken(): string | null {
    return localStorage.getItem('cr_token')
  },

  currentUser(): User | null {
    const user = localStorage.getItem('cr_user')
    return user ? JSON.parse(user) : null
  },
}

// ------------------- Car Services -------------------
export const carService = {
  
  async getAllCars(): Promise<Car[]> {
    const { data } = await api.get('/cars')
    return data
  },

  async getCarById(id: string): Promise<Car> {
    const { data } = await api.get(`/cars/${id}`)
    return data
  },

  async createCar(carData: Partial<Car>): Promise<Car> {
    const { data } = await api.post('/cars', carData)
    return data
  },

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const { data } = await api.put(`/cars/${id}`, carData)
    return data
  },

  async deleteCar(id: string): Promise<void> {
    await api.delete(`/cars/${id}`)
  },

  async searchCars(query: string): Promise<Car[]> {
    const { data } = await api.get(`/cars/search?q=${query}`)
    return data
  },
}

// ------------------- Booking Services -------------------
export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    const { data } = await api.get('/bookings')
    return data
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data } = await api.get(`/bookings/user/${userId}`)
    return data
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const { data } = await api.post('/bookings', bookingData)
    return data
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const { data } = await api.patch(`/bookings/${id}/status`, { status })
    return data
  },

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`)
  },

  async calculatePrice(carId: string, startDate: string, endDate: string, options: Record<string, unknown>): Promise<number> {
    const { data } = await api.post('/bookings/calculate-price', { carId, startDate, endDate, options })
    return data.totalPrice
  },
}

// ------------------- User Services -------------------
export const userService = {
  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get('/users')
    return data
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    const { data } = await api.patch(`/users/${id}/role`, { role })
    return data
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}

// ------------------- Storage Helper -------------------
export const storage = {
  read<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

export default api
