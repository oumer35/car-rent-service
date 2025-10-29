// src/contexts/BookingContext.tsx
import React, { createContext, useEffect, useState, useCallback } from 'react'
import { bookingService } from '../services/api'
import { Booking, BookingStatus} from '../types' 
import { useAuth } from './useAuth'

interface BookingContextValue {
  bookings: Booking[]
  userBookings: Booking[]
  loading: boolean
  error: string | null
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  refreshBookings: () => Promise<void>
  calculatePrice: (carId: string, startDate: string, endDate: string, options: Record<string, unknown>) => Promise<number>
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()
  const user = auth?.user ?? null

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      if (user?.role === 'admin') {
        const allBookings = await bookingService.getAllBookings()
        setBookings(allBookings)
      }
      
      if (user) {
        const userBookingsData = await bookingService.getUserBookings(user.id)
        setUserBookings(userBookingsData)
      }
      
      setError(null)
    } catch (err) {
      setError('Failed to load bookings')
      console.error('Error loading bookings:', err)
    } finally {
      setLoading(false)
    }
  }, [user]) // Dependency array for useCallback

  useEffect(() => {
    loadBookings()
  }, [loadBookings]) // Dependency array for useEffect

  const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const newBooking = await bookingService.createBooking(bookingData)
      setBookings(prev => [...prev, newBooking])
      setUserBookings(prev => [...prev, newBooking])
      return newBooking
    } catch (err) {
      console.error('Error creating booking:', err)
      throw err
    }
  }

  const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking> => {
    try {
      const updatedBooking = await bookingService.updateBookingStatus(id, status)
      setBookings(prev => prev.map(booking => 
        booking.id === id ? updatedBooking : booking
      ))
      setUserBookings(prev => prev.map(booking => 
        booking.id === id ? updatedBooking : booking
      ))
      return updatedBooking
    } catch (err) {
      console.error('Error updating booking status:', err)
      throw err
    }
  }

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      await bookingService.cancelBooking(id)
      setBookings(prev => prev.filter(booking => booking.id !== id))
      setUserBookings(prev => prev.filter(booking => booking.id !== id))
    } catch (err) {
      console.error('Error canceling booking:', err)
      throw err
    }
  }

  const refreshBookings = async (): Promise<void> => {
    await loadBookings()
  }

  const calculatePrice = async (
    carId: string, 
    startDate: string, 
    endDate: string, 
    options: Record<string, unknown>
  ): Promise<number> => {
    return await bookingService.calculatePrice(carId, startDate, endDate, options)
  }

  return (
    <BookingContext.Provider value={{
      bookings,
      userBookings,
      loading,
      error,
      createBooking,
      updateBookingStatus,
      cancelBooking,
      refreshBookings,
      calculatePrice
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBookings = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider')
  }
  return context
}
