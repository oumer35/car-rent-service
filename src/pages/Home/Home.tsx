// src/pages/Home/Home.tsx
import { useEffect, useState } from 'react'
import { 
  Container, Grid, Card, CardContent, Typography, Button, CardMedia,
  Box, Chip, Alert
} from '@mui/material'
import { Star, People, AutoMode, LocalGasStation } from '@mui/icons-material'
import { useCars } from '../../contexts/CarContext'
import { Link } from 'react-router-dom'
import { storage } from '../../services/api'

type Car = {
  id: string
  name: string
  image: string
  seats: number
  transmission: string
  fuelType?: string
  description?: string
  pricePerDay: number
  available: boolean
}

export default function Home() {
  const { cars, loading, error } = useCars()
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])
  const [visitors, setVisitors] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

 useEffect(() => {
  // Visitor counter
  const currentVisitors = storage.read<number>('visitors', 0) + 1
  storage.write('visitors', currentVisitors)
  setVisitors(currentVisitors)

  if (currentVisitors === 1) {
    setShowWelcome(true)
    setTimeout(() => setShowWelcome(false), 5000)
  }

  // Featured cars
  if (Array.isArray(cars)) {
    const normalized = cars.slice(0, 4).map(car => ({
      ...car,
      available: car.available ?? false,
    }))
    setFeaturedCars(normalized)
  }
}, [cars])


  if (loading) {
    return (
      <Container sx={{ mt: 3, textAlign: 'center' }}>
        <Typography>Loading cars...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      {/* Welcome Alert */}
      {showWelcome && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Welcome to Oumer Car Rent Service! We're glad to have you here.
        </Alert>
      )}

      {/* Hero Section */}
      <Card sx={{ mb: 6, background: 'linear-gradient(135deg, #0b74de 0%, #3ea3ff 100%)', color: 'white', textAlign: 'center' }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to Oumer Car Rent
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, margin: '0 auto', opacity: 0.9, mb: 3 }}>
            Your trusted partner for premium car rental services in Ethiopia. <br></br> 
            This prototype demonstrates the basic flows: phone sign-in, models, tariffs, and a rental agreement.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Chip icon={<People />} label={`${visitors} Visitors`} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip icon={<Star />} label="24/7 Support" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip icon={<AutoMode />} label="50+ Vehicles" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
          </Box>
        </CardContent>
      </Card>

      {/* Featured Cars */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Featured Vehicles
      </Typography>

      <Grid container spacing={3}>
        {Array.isArray(featuredCars) && featuredCars.map(car => (
          <Grid size={{xs: 12, sm:6, md:3}} key={car.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
              <CardMedia component="img" height="160" image={car.image} alt={car.name} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{car.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip icon={<People />} label={`${car.seats} seats`} size="small" variant="outlined" />
                    <Chip icon={<AutoMode />} label={car.transmission} size="small" variant="outlined" />
                    {car.fuelType && <Chip icon={<LocalGasStation />} label={car.fuelType} size="small" variant="outlined" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {car.description || 'A reliable vehicle for your journey.'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">${car.pricePerDay}/day</Typography>
                  {!car.available && <Chip label="Not Available" color="error" size="small" />}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component={Link} to={`/cars?select=${car.id}`} variant="outlined" size="small" fullWidth disabled={!car.available}>View Details</Button>
                  <Button component={Link} to={`/tariffs?car=${car.id}`} variant="contained" size="small" fullWidth disabled={!car.available}>Rent Now</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
