// src/pages/Bookings/Bookings.tsx
import { useState, useEffect, useCallback } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@mui/material'
import { 
  CheckCircle,
  Schedule,
  Cancel
} from '@mui/icons-material'
import { useCars } from '../../contexts/CarContext'
import { useBookings } from '../../hooks/useBookings'
import { useAuth } from '../../contexts/AuthContext'
import { BookingStatus } from '../../types'
 

const bookingSteps = ['Select Vehicle', 'Choose Dates', 'Review & Confirm']

export default function Bookings() {
  const { cars } = useCars()
  const { userBookings, createBooking, loading } = useBookings()
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({ 
    carId: '', 
    start: '', 
    end: '', 
    phone: user?.phone || '', 
    name: user?.name || '',
    address: '',
    collateral: ''
  })
  const [calculation, setCalculation] = useState<{
    days: number
    total: number
    carName: string
  } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    // Set default dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 3)

    setForm(prev => ({
      ...prev,
      start: tomorrow.toISOString().split('T')[0],
      end: dayAfter.toISOString().split('T')[0]
    }))
  }, [])

  
  const calculatePrice = useCallback(() => {
    const car = cars.find(c => c.id === form.carId)
    if (!car) return

    const startDate = new Date(form.start)
    const endDate = new Date(form.end)
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const total = car.pricePerDay * days

    setCalculation({
      days,
      total,
      carName: car.name
    })
  }, [cars, form.carId, form.start, form.end])
  // ✅ run calculation when relevant values change
  useEffect(() => {
    if (form.carId && form.start && form.end) {
      calculatePrice()
    }
  }, [form.carId, form.start, form.end, calculatePrice])


  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0 && !form.carId) {
      newErrors.carId = 'Please select a vehicle'
    }

    if (step === 1) {
      if (!form.start) newErrors.start = 'Start date is required'
      if (!form.end) newErrors.end = 'End date is required'
      if (form.start && form.end) {
        const start = new Date(form.start)
        const end = new Date(form.end)
        if (end <= start) newErrors.end = 'End date must be after start date'
      }
    }

    if (step === 2) {
      if (!form.name.trim()) newErrors.name = 'Full name is required'
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!form.address.trim()) newErrors.address = 'Address is required'
      if (!form.collateral.trim()) newErrors.collateral = 'Collateral information is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(activeStep)) return

    try {
      if (!form.carId || !calculation) return

      await createBooking({
        carId: form.carId,
        userId: user?.id || 'guest',
        userName: form.name,
        phone: form.phone,
        startDate: form.start,
        endDate: form.end,
        totalPrice: calculation.total,
        address: form.address,
        collateral: form.collateral
      })

      setBookingSuccess(true)
      // Reset form after successful booking
      setTimeout(() => {
        setActiveStep(0)
        setForm({
          carId: '',
          start: '',
          end: '',
          phone: user?.phone || '',
          name: user?.name || '',
          address: '',
          collateral: ''
        })
        setCalculation(null)
        setBookingSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error creating booking:', error)
      setErrors({ general: 'Failed to create booking. Please try again.' })
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'pending': return 'warning'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        {userBookings.length > 0 ? 'My Bookings' : 'Create New Booking'}
      </Typography>

      {!user && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please sign in to create and manage your bookings.
        </Alert>
      )}

      {/* Booking Creation Process */}
      {user && userBookings.length === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {bookingSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {bookingSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Booking created successfully! Your booking is pending approval. We'll contact you shortly.
              </Alert>
            )}

            {errors.general && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.general}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Vehicle Selection */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Select a Vehicle
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    label="Choose a Car"
                    value={form.carId}
                    onChange={(e) => setForm(prev => ({ ...prev, carId: e.target.value }))}
                    margin="normal"
                    error={!!errors.carId}
                    helperText={errors.carId}
                  >
                    <MenuItem value="">Select a vehicle</MenuItem>
                    {cars.filter(car => car.available).map(car => (
                      <MenuItem key={car.id} value={car.id}>
                        {car.name} - {formatCurrency(car.pricePerDay)}/day
                      </MenuItem>
                    ))}
                  </TextField>

                  {form.carId && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Selected: {cars.find(c => c.id === form.carId)?.name}
                    </Alert>
                  )}
                </Box>
              )}

              {/* Step 2: Date Selection */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Choose Rental Period
                  </Typography>
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
                        error={!!errors.start}
                        helperText={errors.start}
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
                        error={!!errors.end}
                        helperText={errors.end}
                      />
                    </Grid>
                  </Grid>

                  {calculation && (
                    <Card sx={{ mt: 2, bgcolor: 'primary.50' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Price Calculation
                        </Typography>
                        <Typography variant="body2">
                          Vehicle: <strong>{calculation.carName}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Rental Period: <strong>{calculation.days} day{calculation.days > 1 ? 's' : ''}</strong>
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          Total: {formatCurrency(calculation.total)}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}

              {/* Step 3: Personal Information */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{xs:12, sm:6}}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        margin="normal"
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        margin="normal"
                        required
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                    <Grid size={{xs:12}}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={form.address}
                        onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                        margin="normal"
                        required
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </Grid>
                    <Grid size={{xs:12}}>
                      <TextField
                        fullWidth
                        label="Collateral / Security Deposit"
                        value={form.collateral}
                        onChange={(e) => setForm(prev => ({ ...prev, collateral: e.target.value }))}
                        margin="normal"
                        required
                        multiline
                        rows={2}
                        placeholder="e.g., Cash deposit, ID document, credit card hold..."
                        error={!!errors.collateral}
                        helperText={errors.collateral}
                      />
                    </Grid>
                  </Grid>

                  {calculation && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        You are booking <strong>{calculation.carName}</strong> for{' '}
                        <strong>{calculation.days} day{calculation.days > 1 ? 's' : ''}</strong>{' '}
                        at <strong>{formatCurrency(calculation.total)}</strong>
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep === bookingSteps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<CheckCircle />}
                  >
                    {loading ? 'Creating Booking...' : 'Confirm Booking'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User's Existing Bookings */}
      {user && userBookings.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              My Bookings ({userBookings.length})
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setActiveStep(0)
                setForm({
                  carId: '',
                  start: '',
                  end: '',
                  phone: user?.phone || '',
                  name: user?.name || '',
                  address: '',
                  collateral: ''
                })
              }}
            >
              Create New Booking
            </Button>
          </Box>

          <Grid container spacing={3}>
            {userBookings.map(booking => (
              <Grid size={{xs:12}} key={booking.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {cars.find(c => c.id === booking.carId)?.name || 'Unknown Car'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {formatCurrency(booking.totalPrice)}
                        </Typography>
                        {booking.address && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Address: {booking.address}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip 
                          label={booking.status.toUpperCase()} 
                          color={getStatusColor(booking.status)}
                          icon={
                            booking.status === 'approved' ? <CheckCircle /> :
                            booking.status === 'rejected' ? <Cancel /> :
                            <Schedule />
                          }
                        />
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(booking.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  )
}
