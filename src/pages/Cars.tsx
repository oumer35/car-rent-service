import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardMedia,
  Box,
  TextField
} from '@mui/material';
import { useCars } from '../contexts/CarContext';
import { useSearchParams } from 'react-router-dom';

export default function Cars() {
  const { cars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCarId = searchParams.get('select');
  const [agreementForm, setAgreementForm] = useState({
    fullname: '',
    phone: '',
    address: '',
    collateral: '',
    start: '',
    end: ''
  });

  const handleAgreementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(agreementForm.start);
    const endDate = new Date(agreementForm.end);
    
    if (endDate < startDate) {
      alert('End date must be after start date');
      return;
    }
    
    alert('Agreement submitted. Our admin will contact you.');
    setAgreementForm({ fullname: '', phone: '', address: '', collateral: '', start: '', end: '', });
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Model Cars
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cars.map(car => (
          <Grid size={{xs:12, sm:6, md:4}} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={car.image}
                alt={car.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Per day: ${car.pricePerDay}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  A reliable car for city and highway.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setSearchParams({ select: car.id })}
                  >
                    Agreement
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => window.location.href = `/#/tariffs?car=${car.id}`}
                  >
                    Calculate
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedCarId && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              የውል ስምምነት<br></br> Rental Agreement — {cars.find(c => c.id === selectedCarId)?.name}
            </Typography>
            <Box component="form" onSubmit={handleAgreementSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Full name"
                    value={agreementForm.fullname}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={agreementForm.phone}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    inputProps={{ pattern: '\\d{9,15}' }}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={agreementForm.address}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, address: e.target.value }))}
                    required
                     
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="collateral"
                    value={agreementForm.collateral}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, collateral: e.target.value }))}
                    required
                     
                  />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                  <TextField
                    fullWidth
                    label="Start date"
                    type="date"
                    value={agreementForm.start}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid size={{xs:12, sm:6}}>
                  <TextField
                    fullWidth
                    label="End date"
                    type="date"
                    value={agreementForm.end}
                    onChange={(e) => setAgreementForm(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <Button type="submit" variant="contained">
                    Submit Agreement
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}