import React, { createContext, useContext, useEffect, useState } from 'react';
import * as carService from '../services/carService';
import { type Car } from '../types/Car';

type CarCtx = {
  cars: Car[];
  create: (c: Partial<Car>) => Car;
  update: (id: string, p: Partial<Car>) => Car | undefined;
  remove: (id: string) => void;
  refresh: () => void;
}

const Ctx = createContext<CarCtx | undefined>(undefined);

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    carService.seedCars();
    setCars(carService.listCars());
  }, []);

  const create = (p: Partial<Car>) => { 
    const c = carService.createCar(p); 
    setCars(carService.listCars()); 
    return c; 
  };

  const update = (id: string, p: Partial<Car>) => { 
    const c = carService.updateCar(id, p); 
    setCars(carService.listCars()); 
    return c; 
  };

  const remove = (id: string) => { 
    carService.deleteCar(id); 
    setCars(carService.listCars()); 
  };

  const refresh = () => setCars(carService.listCars());

  return (
    <Ctx.Provider value={{ cars, create, update, remove, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCars() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCars must be used within CarProvider');
  return ctx;
}