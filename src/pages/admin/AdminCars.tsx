import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Box
} from '@mui/material';
import { useCars } from '../../contexts/CarContext';

export default function AdminCars() {
  const { cars, create, remove } = useCars();
  const [form, setForm] = useState({ 
    name: '', 
    pricePerDay: 0,
    image: '',
    seats: 5,
    transmission: 'Auto'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      name: form.name,
      pricePerDay: form.pricePerDay,
      image: form.image || 'https://picsum.photos/id/1/600/400',
      seats: form.seats,
      transmission: form.transmission
    });
    setForm({ name: '', pricePerDay: 0, image: '', seats: 5, transmission: 'Auto' });
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Cars
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Car
          </Typography>
          <Box component="form" onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Price per day"
                  type="number"
                  value={form.pricePerDay}
                  onChange={(e) => setForm(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={form.image}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://picsum.photos/id/1/600/400"
                />
              </Grid>
              <Grid size={{xs:12}}>
                <Button type="submit" variant="contained">
                  Create Car
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {cars.map(car => (
          <Grid size={{xs:12, sm:6, md:4}} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={car.image}
                alt={car.name}
              />
              <CardContent>
                <Typography variant="h6">{car.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${car.pricePerDay}/day
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => remove(car.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}