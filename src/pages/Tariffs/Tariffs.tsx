// src/pages/Tariffs/Tariffs.tsx
import React, { useState, useEffect } from 'react'
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
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material'
import { 
  Calculate,
  CheckCircle,
  LocalOffer,
  Speed,
  // Security
} from '@mui/icons-material'
import { useCars } from '../../contexts/CarContext'
import { useBookings } from '../../contexts/BookingContext'
import { useSearchParams } from 'react-router-dom'

const extraOptions = [
  { value: 'none', label: 'None', price: 0 },
  { value: 'gps', label: 'GPS Navigation', price: 5 },
  { value: 'child', label: 'Child Seat', price: 3 },
  { value: 'insurance', label: 'Extra Insurance', price: 10 },
  { value: 'chauffeur', label: 'Chauffeur Service', price: 50 }
]

const tariffPlans = [
  {
    name: 'Economy',
    price: 25,
    features: ['Basic Insurance', '24/7 Roadside Assistance', 'Free Cancellation'],
    cars: ['Toyota Corolla', 'Honda Civic', 'Hyundai Accent']
  },
  {
    name: 'Standard',
    price: 45,
    features: ['Comprehensive Insurance', 'GPS Navigation', 'Child Seat', 'Free Cancellation'],
    cars: ['Ford Escape', 'Toyota RAV4', 'Honda CR-V']
  },
  {
    name: 'Premium',
    price: 85,
    features: ['Full Coverage Insurance', 'All Standard Features', 'Priority Service', 'Luxury Vehicles'],
    cars: ['BMW 3 Series', 'Mercedes C-Class', 'Audi A4']
  },
  {
    name: 'Business',
    price: 120,
    features: ['All Premium Features', 'Chauffeur Service', 'Airport Pickup', 'Flexible Rental Periods'],
    cars: ['BMW 5 Series', 'Mercedes E-Class', 'Range Rover']
  }
]

export default function Tariffs() {
  const { cars } = useCars()
  const { calculatePrice } = useBookings()
  const [searchParams] = useSearchParams()
  const carId = searchParams.get('car') || cars[0]?.id
  const car = cars.find(c => c.id === carId) || cars[0]
  
  const [form, setForm] = useState({
    start: '',
    end: '',
    option: 'none'
  })
  


  const [calculation, setCalculation] = useState<{
    days: number
    basePrice: number
    optionPrice: number
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set default dates (tomorrow and day after tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    setForm(prev => ({
      ...prev,
      start: tomorrow.toISOString().split('T')[0],
      end: dayAfter.toISOString().split('T')[0]
    }))
  }, [])

  const handleCalculate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.start || !form.end || !car) return;

  setLoading(true);
  try {
    const { days, basePrice, optionPrice, total } = await calculatePrice(
      car.id,
      form.start,
      form.end,
      form.option
    );
    setCalculation({ days, basePrice, optionPrice, total });
  } catch (error) {
    console.error('Error calculating price:', error);
  } finally {
    setLoading(false);
  }
};


  const getSelectedOption = () => {
    return extraOptions.find(opt => opt.value === form.option)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      {/* Calculator Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calculate color="primary" />
            Tariffs & Calculator
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{xs:12, md:6}}>
              {car && (
                <>
                  <CardMedia
                    component="img"
                    height="240"
                    image={car.image}
                    alt={car.name}
                    sx={{ objectFit: 'cover', borderRadius: 2, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {car.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Base Rate:</strong> {formatCurrency(car.pricePerDay)}/day
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Seats:</strong> {car.seats} • <strong>Transmission:</strong> {car.transmission}
                    </Typography>
                    {car.fuelType && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Fuel Type:</strong> {car.fuelType}
                      </Typography>
                    )}
                    {car.features && car.features.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Features:</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {car.features.slice(0, 4).map((feature, index) => (
                            <Chip key={index} label={feature} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Box component="form" onSubmit={handleCalculate}>
                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={form.start}
                      onChange={(e) => setForm(prev => ({ ...prev, start: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                    />
                  </Grid>
                  
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={form.end}
                      onChange={(e) => setForm(prev => ({ ...prev, end: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                    />
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      select
                      label="Extra Options"
                      value={form.option}
                      onChange={(e) => setForm(prev => ({ ...prev, option: e.target.value }))}
                      margin="normal"
                    >
                      {extraOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label} {option.price > 0 && `(+${formatCurrency(option.price)}/day)`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      disabled={loading || !form.start || !form.end}
                      startIcon={<Calculate />}
                    >
                      {loading ? 'Calculating...' : 'Calculate Total'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              {calculation && (
                <Card sx={{ mt: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.100' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      Price Calculation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Rental Period:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {calculation.days} day{calculation.days > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Base Price:</Typography>
                        <Typography variant="body2">
                          {formatCurrency(car.pricePerDay)} × {calculation.days} = {formatCurrency(calculation.basePrice)}
                        </Typography>
                      </Box>
                      {calculation.optionPrice > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Extra Options:</Typography>
                          <Typography variant="body2">
                            {formatCurrency(getSelectedOption()?.price || 0)} × {calculation.days} = {formatCurrency(calculation.optionPrice)}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body1" fontWeight="bold">Total Amount:</Typography>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          {formatCurrency(calculation.total)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Note:</strong> This is an estimated price. Final amount may vary based on additional services and taxes.
                      </Typography>
                    </Alert>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => window.location.href = `/cars?select=${car.id}`}
                    >
                      Proceed to Rental Agreement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tariff Plans Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <LocalOffer color="primary" />
            Our Rental Plans
          </Typography>
          
          <Grid container spacing={3}>
            {tariffPlans.map((plan, index) => (
              <Grid size={{xs:12, sm:6, md:3}} key={plan.name}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: index === 1 ? '2px solid' : '1px solid',
                    borderColor: index === 1 ? 'primary.main' : 'divider',
                    position: 'relative',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  {index === 1 && (
                    <Chip 
                      label="Most Popular" 
                      color="primary" 
                      size="small"
                      sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}
                    />
                  )}
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom color="primary">
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                      {formatCurrency(plan.price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      per day
                    </Typography>
                    
                    <Box sx={{ mt: 3, mb: 3 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Sample Vehicles:</strong> {plan.cars.join(', ')}
                    </Typography>
                    
                    <Button 
                      variant={index === 1 ? "contained" : "outlined"} 
                      fullWidth
                      onClick={() => window.location.href = '/cars'}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Services Table */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed color="primary" />
            Additional Services & Fees
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Service</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>GPS Navigation</TableCell>
                  <TableCell>Advanced GPS system with live traffic updates</TableCell>
                  <TableCell>{formatCurrency(5)}/day</TableCell>
                  <TableCell>Pre-installed in all vehicles</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Child Safety Seat</TableCell>
                  <TableCell>Standard child safety seat</TableCell>
                  <TableCell>{formatCurrency(3)}/day</TableCell>
                  <TableCell>Available for all age groups</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Additional Insurance</TableCell>
                  <TableCell>Extended coverage with lower deductible</TableCell>
                  <TableCell>{formatCurrency(10)}/day</TableCell>
                  <TableCell>Recommended for new drivers</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Chauffeur Service</TableCell>
                  <TableCell>Professional driver service</TableCell>
                  <TableCell>{formatCurrency(50)}/day</TableCell>
                  <TableCell>8 hours maximum per day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Airport Delivery</TableCell>
                  <TableCell>Vehicle delivery to airport</TableCell>
                  <TableCell>{formatCurrency(25)}</TableCell>
                  <TableCell>One-time fee</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Late Return</TableCell>
                  <TableCell>Grace period exceeded</TableCell>
                  <TableCell>{formatCurrency(15)}/hour</TableCell>
                  <TableCell>2-hour grace period applies</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cleaning Fee</TableCell>
                  <TableCell>Excessive cleaning required</TableCell>
                  <TableCell>{formatCurrency(35)}</TableCell>
                  <TableCell>Only if vehicle returned unusually dirty</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> All prices are subject to change. Fuel is not included in the rental price. 
              A security deposit is required for all rentals and will be refunded upon vehicle return in good condition.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  )
}