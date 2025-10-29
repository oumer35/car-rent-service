import React, { useEffect, useState } from 'react'
import { carService } from '../services/api'
import { Car } from '../types'
import { CarContext } from './CarContext'

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    loadCars()
  }, [])

  const createCar = async (carData: Partial<Car>): Promise<Car> => {
    const newCar = await carService.createCar(carData)
    setCars(prev => [...prev, newCar])
    return newCar
  }

  const updateCar = async (id: string, carData: Partial<Car>): Promise<Car> => {
    const updatedCar = await carService.updateCar(id, carData)
    setCars(prev => prev.map(car => (car.id === id ? updatedCar : car)))
    return updatedCar
  }

  const deleteCar = async (id: string): Promise<void> => {
    await carService.deleteCar(id)
    setCars(prev => prev.filter(car => car.id !== id))
  }

  const refreshCars = async (): Promise<void> => {
    await loadCars()
  }

  const searchCars = async (query: string): Promise<Car[]> => {
    if (!query.trim()) return cars
    return await carService.searchCars(query)
  }

  return (
    <CarContext.Provider
      value={{
        cars,
        loading,
        error,
        createCar,
        updateCar,
        deleteCar,
        refreshCars,
        searchCars,
      }}
    >
      {children}
    </CarContext.Provider>
  )
}
