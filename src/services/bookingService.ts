import { type Booking } from '../types/Booking';
import { read, write } from './storage';
import apiRequest from './api'

const KEY = 'cr_bookings';

export function listBookings(): Booking[] {
  return read<Booking[]>(KEY, []);
}

export function createBooking(b: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const items = listBookings();
  const booking: Booking = {
    ...b,
    id: 'b_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  items.push(booking);
  write(KEY, items);
  return booking;
}

export function updateBookingStatus(id: string, status: Booking['status']) {
  const items = listBookings();
  const idx = items.findIndex(x => x.id === id);
  if (idx === -1) return undefined;
  items[idx].status = status;
  write(KEY, items);
  return items[idx];
}

export const bookingService = {
  async listBookings(): Promise<Booking[]> {
    const response = await apiRequest('/bookings');
    return response;
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    const response = await apiRequest('/bookings', {
      method: 'POST',
      body: bookingData
    });
    return response;
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
    return response;
  }
};