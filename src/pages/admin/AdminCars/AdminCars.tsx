// src/pages/admin/AdminCars/AdminCars.tsx
import React, { useState } from 'react'
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  MoreVert
} from '@mui/icons-material'
import { useCars } from '../../../contexts/CarContext'
import { Car } from '../../../types'

export default function AdminCars() {
  const { cars, createCar, updateCar, deleteCar, error } = useCars()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [form, setForm] = useState({
    name: '',
    pricePerDay: '',
    image: '',
    seats: '',
    transmission: 'Auto',
    brand: '',
    description: '',
    fuelType: 'Petrol',
    mileage: '',
    features: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
  const transmissions = ['Auto', 'Manual']

  const handleOpenDialog = (car?: Car) => {
    if (car) {
      setEditingCar(car)
      setForm({
        name: car.name,
        pricePerDay: car.pricePerDay.toString(),
        image: car.image,
        seats: car.seats.toString(),
        transmission: car.transmission,
        brand: car.brand || '',
        description: car.description || '',
        fuelType: car.fuelType || 'Petrol',
        mileage: car.mileage?.toString() || '',
        features: car.features?.join(', ') || ''
      })
    } else {
      setEditingCar(null)
      setForm({
        name: '',
        pricePerDay: '',
        image: '',
        seats: '',
        transmission: 'Auto',
        brand: '',
        description: '',
        fuelType: 'Petrol',
        mileage: '',
        features: ''
      })
    }
    setDialogOpen(true)
    setFormErrors({})
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCar(null)
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.pricePerDay || isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0) {
      errors.pricePerDay = 'Valid price is required'
    }
    if (!form.image.trim()) errors.image = 'Image URL is required'
    if (!form.seats || isNaN(Number(form.seats)) || Number(form.seats) <= 0) {
      errors.seats = 'Valid seat count is required'
    }
    if (!form.mileage || isNaN(Number(form.mileage)) || Number(form.mileage) < 0) {
      errors.mileage = 'Valid mileage is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const carData = {
        name: form.name,
        pricePerDay: Number(form.pricePerDay),
        image: form.image,
        seats: Number(form.seats),
        transmission: form.transmission,
        brand: form.brand || undefined,
        description: form.description || undefined,
        fuelType: form.fuelType,
        mileage: Number(form.mileage),
        features: form.features ? form.features.split(',').map(f => f.trim()) : undefined,
        available: true
      }

      if (editingCar) {
        await updateCar(editingCar.id, carData)
      } else {
        await createCar(carData)
      }

      handleCloseDialog()
    } catch (err) {
      console.error('Error saving car:', err)
    }
  }

  const handleDeleteCar = async (car: Car) => {
    if (window.confirm(`Are you sure you want to delete ${car.name}?`)) {
      try {
        await deleteCar(car.id)
        setMenuAnchor(null)
        setSelectedCar(null)
      } catch (err) {
        console.error('Error deleting car:', err)
      }
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, car: Car) => {
    setMenuAnchor(event.currentTarget)
    setSelectedCar(car)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedCar(null)
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Manage Cars
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Car
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {cars.map(car => (
          <Grid size={{xs:12, sm:6, md:4}} key={car.id}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.image}
                  alt={car.name}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                  onClick={(e) => handleMenuOpen(e, car)}
                >
                  <MoreVert />
                </IconButton>
              </Box>
              
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {car.brand} • {car.fuelType} • {car.transmission}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Chip label={`${car.seats} seats`} size="small" />
                  <Chip label={`${car.mileage} kmpl`} size="small" />
                  {car.available ? (
                    <Chip label="Available" color="success" size="small" />
                  ) : (
                    <Chip label="Not Available" color="error" size="small" />
                  )}
                </Box>

                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${car.pricePerDay}/day
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth
                  onClick={() => handleOpenDialog(car)}
                  startIcon={<Edit />}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Car Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCar ? 'Edit Car' : 'Add New Car'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Car Name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                  margin="normal"
                />
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Price per Day ($)"
                  type="number"
                  value={form.pricePerDay}
                  onChange={(e) => setForm(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  margin="normal"
                  required
                  error={!!formErrors.pricePerDay}
                  helperText={formErrors.pricePerDay}
                />
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Number of Seats"
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm(prev => ({ ...prev, seats: e.target.value }))}
                  margin="normal"
                  required
                  error={!!formErrors.seats}
                  helperText={formErrors.seats}
                />
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  select
                  label="Transmission"
                  value={form.transmission}
                  onChange={(e) => setForm(prev => ({ ...prev, transmission: e.target.value }))}
                  margin="normal"
                >
                  {transmissions.map((transmission) => (
                    <MenuItem key={transmission} value={transmission}>
                      {transmission}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  select
                  label="Fuel Type"
                  value={form.fuelType}
                  onChange={(e) => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                  margin="normal"
                >
                  {fuelTypes.map((fuelType) => (
                    <MenuItem key={fuelType} value={fuelType}>
                      {fuelType}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Mileage (kmpl)"
                  type="number"
                  value={form.mileage}
                  onChange={(e) => setForm(prev => ({ ...prev, mileage: e.target.value }))}
                  margin="normal"
                  required
                  error={!!formErrors.mileage}
                  helperText={formErrors.mileage}
                />
              </Grid>
              
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={form.image}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                  margin="normal"
                  required
                  error={!!formErrors.image}
                  helperText={formErrors.image}
                  placeholder="https://example.com/car-image.jpg"
                />
              </Grid>
              
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Features"
                  value={form.features}
                  onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                  margin="normal"
                  multiline
                  rows={2}
                  placeholder="GPS, Air Conditioning, Bluetooth, ... (comma separated)"
                />
              </Grid>
              
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCar ? 'Update Car' : 'Add Car'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedCar) handleOpenDialog(selectedCar)
          handleMenuClose()
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedCar) handleDeleteCar(selectedCar)
        }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  )
}