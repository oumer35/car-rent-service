import { createContext, useContext } from 'react'
import type { Car } from '../types'

interface CarContextValue {
  cars: Car[]
  loading: boolean
  error: string | null
  createCar: (carData: Partial<Car>) => Promise<Car>
  updateCar: (id: string, carData: Partial<Car>) => Promise<Car>
  deleteCar: (id: string) => Promise<void>
  refreshCars: () => Promise<void>
  searchCars: (query: string) => Promise<Car[]>
}

export const CarContext = createContext<CarContextValue | undefined>(undefined)

export const useCars = () => {
  const context = useContext(CarContext)
  if (!context) {
    throw new Error('useCars must be used within a CarProvider')
  }
  return context
}
