// src/pages/admin/AdminDashboard/AdminDashboard.tsx
import { useEffect, useState } from 'react'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  DirectionsCar,
  BookOnline,
  People,
  AttachMoney,
  TrendingUp,
  Schedule
} from '@mui/icons-material'
import { useCars } from '../../../contexts/CarContext'
import { useBooking } from '../../../contexts/BookingContext'
import { storage } from '../../../services/api'
import {Activity, Booking} from '../../../types'

interface DashboardStats {
  totalCars: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  availableCars: number
  totalUsers: number
  createdAt: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
}


export default function AdminDashboard() {
  const { cars, loading: carsLoading } = useCars()
  const { bookings, loading: bookingsLoading } = useBooking()
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    availableCars: 0,
    totalUsers: 0,
    createdAt: new Date().toISOString(),
    status: 'pending'
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])

  useEffect(() => {
    if (cars && bookings) {
      const users = storage.read<{ id: string; name: string}[]>('cr_users', [])
      
      const dashboardStats: DashboardStats = {
        totalCars: cars.length,
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum: number, booking: Booking) => sum + (booking.totalPrice || 0), 0),
        pendingBookings: bookings.filter((b: Booking) => b.status === 'pending').length,
        availableCars: cars.filter(c => c.available).length,
        totalUsers: users.length,
        createdAt: new Date().toISOString(),
        status: 'approved'
      }

      setStats(dashboardStats)

      // Generate recent activity
      const activity: Activity[] = [
  ...bookings.slice(0, 5).map< Activity >(booking => ({
    type: 'booking',
    message: `New booking from ${booking.userName}`,
    time: new Date(booking.createdAt).toLocaleDateString(),
    color: 'primary'
  })),
  ...cars.slice(0, 3).map<Activity>(car => ({
    type: 'car',
    message: `${car.name} added to fleet`,
    time: 'Recently',
    color: 'success'
  }))
].sort(() => Math.random() - 0.5).slice(0, 5)

      setRecentActivity(activity)
    }
  }, [cars, bookings])

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalCars,
      icon: <DirectionsCar fontSize="large" />,
      color: '#0b74de',
      subtitle: `${stats.availableCars} available`
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <BookOnline fontSize="large" />,
      color: '#ff6b35',
      subtitle: `${stats.pendingBookings} pending`
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney fontSize="large" />,
      color: '#00c853',
      subtitle: 'All time'
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: <People fontSize="large" />,
      color: '#7b1fa2',
      subtitle: 'Active customers'
    }
  ]

  const loading = carsLoading || bookingsLoading

  if (loading) {
    return (
      <Container sx={{ py: 3 }}>
        <LinearProgress />
      </Container>
    )
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your administration dashboard. Here's an overview of your car rental business.
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {statCards.map((stat, index) => (
          <Grid size={{xs:12, sm:6, md:3}} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h3" component="div" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main">
                    +12% from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Activity */}
        <Grid size={{xs:12, md:8}}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="primary" />
                Recent Activity
              </Typography>
              
              {recentActivity.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentActivity.map((activity, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: activity.color
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent activity to display
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Add New Car', path: '/admin/cars', color: 'primary' },
                  { label: 'View Bookings', path: '/admin/bookings', color: 'secondary' },
                  { label: 'Manage Users', path: '/admin/users', color: 'success' },
                  { label: 'View Reports', path: '/admin/reports', color: 'warning' }
                ].map((action, index) => (
                  <Grid size={{xs:6, sm:3}} key={index}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.50',
                          borderColor: 'primary.main'
                        }
                      }}
                      onClick={() => window.location.href = action.path}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {action.label}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid size={{xs:12, md:4}}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                System Status
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Database', status: 'operational', value: 100 },
                  { label: 'API Services', status: 'operational', value: 100 },
                  { label: 'Payment Gateway', status: 'operational', value: 100 },
                  { label: 'SMS Service', status: 'degraded', value: 80 }
                ].map((service, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{service.label}</Typography>
                      <Typography 
                        variant="caption" 
                        color={service.status === 'operational' ? 'success.main' : 'warning.main'}
                        fontWeight="bold"
                      >
                        {service.status}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={service.value}
                      color={service.status === 'operational' ? 'success' : 'warning'}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  All systems are running smoothly. Last checked: Just now
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Performance
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { label: 'Booking Conversion', value: 68, target: 75 },
                  { label: 'Customer Satisfaction', value: 92, target: 90 },
                  { label: 'Fleet Utilization', value: 78, target: 80 }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{metric.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {metric.value}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.value}
                      color={metric.value >= metric.target ? 'success' : 'warning'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Target: {metric.target}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}