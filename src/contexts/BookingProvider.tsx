import React, { useState, useEffect, useCallback } from 'react'
import { BookingContext, BookingContextValue } from './BookingContext'
import { Booking, BookingStatus, Car } from '../types'
import { useAuth } from './useAuth'
import { useCars } from './CarContext'
import { extraOptions } from '../constants/bookingOptions'
import { bookingService } from '../services/api'

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cars } = useCars()
  const auth = useAuth()
  const user = auth?.user ?? null

  const [bookings, setBookings] = useState<Booking[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
    const newBooking = await bookingService.createBooking(bookingData)
    setBookings(prev => [...prev, newBooking])
    setUserBookings(prev => [...prev, newBooking])
    return newBooking
  }

  const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking> => {
    const updated = await bookingService.updateBookingStatus(id, status)
    setBookings(prev => prev.map(b => (b.id === id ? updated : b)))
    setUserBookings(prev => prev.map(b => (b.id === id ? updated : b)))
    return updated
  }

  const cancelBooking = async (id: string): Promise<void> => {
    await bookingService.cancelBooking(id)
    setBookings(prev => prev.filter(b => b.id !== id))
    setUserBookings(prev => prev.filter(b => b.id !== id))
  }

  const refreshBookings = async (): Promise<void> => {
    await loadBookings()
  }

  const calculatePrice: BookingContextValue['calculatePrice'] = async (
    carId,
    startDate,
    endDate,
    option
  ) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const car: Car | undefined = cars.find(c => c.id === carId)
    const basePrice = (car?.pricePerDay || 0) * days
    const optionPrice = (extraOptions.find(opt => opt.value === option)?.price || 0) * days
    const total = basePrice + optionPrice

    return { days, basePrice, optionPrice, total }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        userBookings,
        loading,
        error,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        refreshBookings,
        calculatePrice
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}
