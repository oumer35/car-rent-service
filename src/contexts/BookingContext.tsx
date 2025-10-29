import { createContext, useContext } from 'react'
import type { Booking, BookingStatus } from '../types'

export interface BookingContextValue {
  bookings: Booking[]
  userBookings: Booking[]
  loading: boolean
  error: string | null
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<Booking>
  cancelBooking: (id: string) => Promise<void>
  refreshBookings: () => Promise<void>
  calculatePrice: (
    carId: string,
    startDate: string,
    endDate: string,
    option: string
  ) => Promise<{ days: number; basePrice: number; optionPrice: number; total: number }>
}

export const BookingContext = createContext<BookingContextValue | undefined>(undefined)

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within a BookingProvider')
  return context
}
