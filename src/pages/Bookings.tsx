import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Container, Typography, Button, TextField, MenuItem, Box } from '@mui/material';
import { useCars } from '../contexts/CarContext';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';

export default function BookingsPage() {
  const { cars } = useCars();
  const { create } = useBookings();
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    carId: cars[0]?.id || '', 
    start: '', 
    end: '', 
    phone: user?.phone || '', 
    name: user?.name || '' 
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.carId) return;
    const car = cars.find(c => c.id === form.carId)!;
    const days = Math.max(1, Math.ceil((new Date(form.end).getTime() - new Date(form.start).getTime()) / (1000 * 60 * 60 * 24)));
    const total = (car.pricePerDay || 0) * days;
    create({ 
      carId: form.carId, 
      userId: user?.id || 'guest', 
      userName: form.name, 
      phone: form.phone, 
      startDate: form.start, 
      endDate: form.end, 
      totalPrice: total 
    });
    alert('Booking created – pending approval.');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Booking
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          select
          name="carId"
          value={form.carId} 
          onChange={handleInputChange}
          label="Select a car"
          required
        >
          <MenuItem value="">Select a car</MenuItem>
          {cars.map(c => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          type="date"
          name="start"
          value={form.start} 
          onChange={handleInputChange}
          label="Start date"
          InputLabelProps={{ shrink: true }}
          required 
        />
        
        <TextField
          type="date"
          name="end"
          value={form.end} 
          onChange={handleInputChange}
          label="End date"
          InputLabelProps={{ shrink: true }}
          required 
        />
        
        <TextField
          name="name"
          value={form.name} 
          onChange={handleInputChange}
          placeholder="Full name" 
          label="Full name"
          required 
        />
        
        <TextField
          name="phone"
          value={form.phone} 
          onChange={handleInputChange}
          placeholder="Phone" 
          label="Phone number"
          required 
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Book Now
        </Button>
      </Box>
    </Container>
  );
}