import { useContext } from "react";
import {BookingContext} from "../contexts/BookingContext";

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};
