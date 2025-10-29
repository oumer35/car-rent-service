// src/contexts/CarContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { carService } from '../services/api'
import { Car } from '../types'

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

const CarContext = createContext<CarContextValue | undefined>(undefined)

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      setLoading(true)
      const carData = await carService.getAllCars()
      setCars(carData)
      setError(null)
    } catch (err) {
      setError('Failed to load cars')
      console.error('Error loading cars:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCar = async (carData: Partial<Car>): Promise<Car> => {
    try {
      const newCar = await carService.createCar(carData)
      setCars(prev => [...prev, newCar])
      return newCar
    } catch (err) {
      console.error('Error creating car:', err)
      throw err
    }
  }

  const updateCar = async (id: string, carData: Partial<Car>): Promise<Car> => {
    try {
      const updatedCar = await carService.updateCar(id, carData)
      setCars(prev => prev.map(car => car.id === id ? updatedCar : car))
      return updatedCar
    } catch (err) {
      console.error('Error updating car:', err)
      throw err
    }
  }

  const deleteCar = async (id: string): Promise<void> => {
    try {
      await carService.deleteCar(id)
      setCars(prev => prev.filter(car => car.id !== id))
    } catch (err) {
      console.error('Error deleting car:', err)
      throw err
    }
  }

  const refreshCars = async (): Promise<void> => {
    await loadCars()
  }

  const searchCars = async (query: string): Promise<Car[]> => {
    if (!query.trim()) {
      return cars
    }
    return await carService.searchCars(query)
  }

  return (
    <CarContext.Provider value={{
      cars,
      loading,
      error,
      createCar,
      updateCar,
      deleteCar,
      refreshCars,
      searchCars
    }}>
      {children}
    </CarContext.Provider>
  )
}

export const useCars = () => {
  const context = useContext(CarContext)
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider')
  }
  return context
}