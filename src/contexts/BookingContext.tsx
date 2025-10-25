import React, { createContext, useContext, useEffect, useState } from 'react';
import * as bookingService from '../services/bookingService';
import { type Booking } from '../types/Booking';

type BCtx = {
  bookings: Booking[];
  create: (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  updateStatus: (id: string, status: Booking['status']) => Booking | undefined;
  refresh: () => void;
}

const Ctx = createContext<BCtx | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => setBookings(bookingService.listBookings()), []);

  const create = (b: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const nb = bookingService.createBooking(b);
    setBookings(bookingService.listBookings());
    return nb;
  };

  const updateStatus = (id: string, status: Booking['status']) => {
    const u = bookingService.updateBookingStatus(id, status);
    setBookings(bookingService.listBookings());
    return u;
  };

  const refresh = () => setBookings(bookingService.listBookings());

  return (
    <Ctx.Provider value={{ bookings, create, updateStatus, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBookings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}