import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardMedia,
  Box,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { useCars } from '../contexts/CarContext';
import { useSearchParams } from 'react-router-dom';

export default function Tariffs() {
  const { cars } = useCars();
  const [searchParams] = useSearchParams();
  const carId = searchParams.get('car') || cars[0]?.id;
  const car = cars.find(c => c.id === carId) || cars[0];
  
  const [form, setForm] = useState({
    start: '',
    end: '',
    option: 'none'
  });
  const [calculation, setCalculation] = useState<{ days: number; total: number } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start || !form.end) return;

    const start = new Date(form.start);
    const end = new Date(form.end);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    let price = (car?.pricePerDay || 0) * days;
    if (form.option === 'gps') price += 5 * days;
    if (form.option === 'child') price += 3 * days;

    setCalculation({ days, total: price });
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Tariffs & Calculator
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{xs:12, md:6}}>
              <CardMedia
                component="img"
                height="200"
                image={car?.image}
                alt={car?.name}
                sx={{ objectFit: 'cover', borderRadius: 1 }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {car?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price per day: ${car?.pricePerDay}
              </Typography>
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Box component="form" onSubmit={handleCalculate}>
                <TextField
                  fullWidth
                  label="Start date"
                  type="date"
                  value={form.start}
                  onChange={(e) => setForm(prev => ({ ...prev, start: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="End date"
                  type="date"
                  value={form.end}
                  onChange={(e) => setForm(prev => ({ ...prev, end: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  select
                  label="Extra options"
                  value={form.option}
                  onChange={(e) => setForm(prev => ({ ...prev, option: e.target.value }))}
                  margin="normal"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="gps">GPS (+$5/day)</MenuItem>
                  <MenuItem value="child">Child seat (+$3/day)</MenuItem>
                </TextField>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Calculate
                </Button>
              </Box>
              
              {calculation && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Days: {calculation.days} • Total: ${calculation.total}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}