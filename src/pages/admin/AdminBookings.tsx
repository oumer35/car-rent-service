// import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Box,
  Chip
} from '@mui/material';
import { useBookings } from '../../contexts/BookingContext';

export default function AdminBookings() {
  const { bookings, updateStatus } = useBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Bookings
      </Typography>
      
      {bookings.map(booking => (
        <Card key={booking.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography variant="h6">
                  {booking.userName} ({booking.phone})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.startDate} → {booking.endDate} • ${booking.totalPrice}
                </Typography>
                <Chip 
                  label={booking.status} 
                  color={getStatusColor(booking.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {booking.status === 'pending' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    color="success"
                    size="small"
                    onClick={() => updateStatus(booking.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    size="small"
                    onClick={() => updateStatus(booking.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}