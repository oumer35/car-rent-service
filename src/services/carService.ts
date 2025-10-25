import { type Car } from '../types/Car';
import { read, write } from './storage';
import apiRequest from './api'

const CAR_KEY = 'cr_cars';

export function seedCars() {
  const existing = read<Car[]>(CAR_KEY, []);
  if (existing.length) return;
  
  const sample: Car[] = [
    {
      id: '1',
      name: 'Toyota Corolla',
      pricePerDay: 30,
      image: 'https://picsum.photos/id/1011/600/400',
      seats: 5,
      transmission: 'Auto',
      brand: 'Toyota',
      description: 'Reliable and fuel efficient',
      available: true
    },
    {
      id: '2',
      name: 'Honda Civic',
      pricePerDay: 35,
      image: 'https://picsum.photos/id/1012/600/400',
      seats: 5,
      transmission: 'Auto',
      brand: 'Honda',
      description: 'Comfortable and modern',
      available: true
    },
    {
      id: '3',
      name: 'Ford Escape',
      pricePerDay: 60,
      image: 'https://picsum.photos/id/1013/600/400',
      seats: 5,
      transmission: 'Auto',
      brand: 'Ford',
      description: 'Spacious SUV for family trips',
      available: true
    },
    {
      id: '4',
      name: 'BMW 3 Series',
      pricePerDay: 120,
      image: 'https://picsum.photos/id/1005/600/400',
      seats: 5,
      transmission: 'Auto',
      brand: 'BMW',
      description: 'Luxury and performance',
      available: true
    }
  ];
  write(CAR_KEY, sample);
}

export function listCars(): Car[] {
  return read<Car[]>(CAR_KEY, []);
}

export function getCar(id: string): Car | undefined {
  return listCars().find(c => c.id === id);
}

export function createCar(payload: Partial<Car>): Car {
  const cars = listCars();
  const car: Car = {
    id: 'c_' + Date.now(),
    name: payload.name || 'Untitled',
    pricePerDay: payload.pricePerDay || 10,
    image: payload.image || 'https://picsum.photos/id/1/600/400',
    seats: payload.seats || 4,
    transmission: payload.transmission || 'Auto',
    brand: payload.brand,
    description: payload.description,
    available: payload.available !== false
  };
  cars.push(car);
  write(CAR_KEY, cars);
  return car;
}

export function updateCar(id: string, payload: Partial<Car>): Car | undefined {
  const cars = listCars();
  const idx = cars.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  cars[idx] = { ...cars[idx], ...payload };
  write(CAR_KEY, cars);
  return cars[idx];
}

export function deleteCar(id: string) {
  const cars = listCars().filter(c => c.id !== id);
  write(CAR_KEY, cars);
}

export const carService = {
  async listCars(): Promise<Car[]> {
    const response = await apiRequest('/cars');
    return response;
  },

  async getCar(id: string): Promise<Car> {
    const response = await apiRequest(`/cars/${id}`);
    return response;
  },

  async createCar(carData: Partial<Car>): Promise<Car> {
    const response = await apiRequest('/cars', {
      method: 'POST',
      body: carData
    });
    return response;
  },

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const response = await apiRequest(`/cars/${id}`, {
      method: 'PUT',
      body: carData
    });
    return response;
  },

  async deleteCar(id: string): Promise<void> {
    await apiRequest(`/cars/${id}`, {
      method: 'DELETE'
    });
  },

  async seedCars(): Promise<string> {
    // This would be called from admin panel to seed sample data
    const response = await apiRequest('/seed', {
      method: 'POST'
    });
    return response;
  }
};