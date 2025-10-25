// import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useCars } from '../../contexts/CarContext';
import { useBookings } from '../../contexts/BookingContext';
import { read } from '../../services/storage';

export default function AdminDashboard() {
  const { cars } = useCars();
  const { bookings } = useBookings();
  const users = read('cr_users', []);

  const stats = [
    { label: 'Cars', value: cars.length },
    { label: 'Bookings', value: bookings.length },
    { label: 'Users', value: users.length },
    { label: 'Revenue', value: `$${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}` }
  ];

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid size={{xs:12, sm:6, md:3}} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="div" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}