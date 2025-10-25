export interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
  seats: number;
  transmission: string;
  brand?: string;
  description?: string;
  available?: boolean;
}