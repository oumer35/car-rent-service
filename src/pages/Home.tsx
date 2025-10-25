import { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardMedia,
  Box
} from '@mui/material';
import { useCars } from '../contexts/CarContext';
import { Link } from 'react-router-dom';
import { read } from '../services/storage';

export default function Home() {
  const { cars } = useCars();
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const currentVisitors = Number(read('visitors', 0)) + 1;
    localStorage.setItem('visitors', currentVisitors.toString());
    setVisitors(currentVisitors);
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to Oumer Car Rent Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This prototype demonstrates the basic flows: phone sign-in, models, tariffs, and a rental agreement.
          </Typography>
          <Typography>
            <strong>Visitors count:</strong> {visitors}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {cars.map(car => (
          <Grid size={{xs:12, sm:6, md:3}} key={car.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="160"
                image={car.image}
                alt={car.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Seats: {car.seats} • {car.transmission}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button 
                    component={Link}
                    to={`/cars?select=${car.id}`}
                    variant="outlined" 
                    size="small"
                    fullWidth
                  >
                    View
                  </Button>
                  <Button 
                    component={Link}
                    to={`/tariffs?car=${car.id}`}
                    variant="contained" 
                    size="small"
                    fullWidth
                  >
                    Rent
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}