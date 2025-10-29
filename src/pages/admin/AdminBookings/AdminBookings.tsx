// src/pages/admin/AdminBookings/AdminBookings.tsx
import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Visibility
} from '@mui/icons-material'
import { useBookings } from '../../../contexts/BookingContext'
import { useCars } from '../../../contexts/CarContext'
import { Booking, BookingStatus } from '../../../types'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminBookings() {
  const { bookings, updateBookingStatus, loading, error } = useBookings()
  const { cars } = useCars()
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)

  const statusCounts = {
    pending: bookings.filter((b: Booking) => b.status === 'pending').length,
  approved: bookings.filter((b: Booking) => b.status === 'approved').length,
  rejected: bookings.filter((b: Booking) => b.status === 'rejected').length,
  completed: bookings.filter((b: Booking) => b.status === 'completed').length
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

  const getCarName = (carId: string) => {
    return cars.find(c => c.id === carId)?.name || 'Unknown Car'
  }

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    setStatusUpdateLoading(bookingId)
    try {
      await updateBookingStatus(bookingId, status)
    } catch (err) {
      console.error('Error updating booking status:', err)
    } finally {
      setStatusUpdateLoading(null)
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setDetailDialogOpen(true)
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

  const filteredBookings = bookings.filter((booking: Booking) => {
    switch (selectedTab) {
      case 0: return booking.status === 'pending'
      case 1: return booking.status === 'approved'
      case 2: return booking.status === 'rejected'
      case 3: return booking.status === 'completed'
      default: return true
    }
  })

  if (loading) {
    return (
      <Container sx={{ py: 3 }}>
        <Typography>Loading bookings...</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Manage Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(_, newValue) => setSelectedTab(newValue)}
          aria-label="booking status tabs"
        >
          <Tab 
            label={
              <Badge badgeContent={statusCounts.pending} color="warning" showZero>
                Pending
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={statusCounts.approved} color="success" showZero>
                Approved
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={statusCounts.rejected} color="error" showZero>
                Rejected
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={statusCounts.completed} color="info" showZero>
                Completed
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={selectedTab} index={0}>
        <Typography variant="h6" gutterBottom color="warning.main">
          Pending Bookings ({statusCounts.pending})
        </Typography>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h6" gutterBottom color="success.main">
          Approved Bookings ({statusCounts.approved})
        </Typography>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Typography variant="h6" gutterBottom color="error.main">
          Rejected Bookings ({statusCounts.rejected})
        </Typography>
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <Typography variant="h6" gutterBottom color="info.main">
          Completed Bookings ({statusCounts.completed})
        </Typography>
      </TabPanel>

      {/* Bookings List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTab === 0 ? 'No pending bookings at the moment.' :
                 selectedTab === 1 ? 'No approved bookings yet.' :
                 selectedTab === 2 ? 'No rejected bookings.' : 'No completed bookings.'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking: Booking) => (
            <Card key={booking.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{xs:12, md:6}}>
                    <Typography variant="h6" gutterBottom>
                      {booking.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {booking.phone} • {getCarName(booking.carId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(booking.totalPrice)}
                    </Typography>
                    
                    {booking.address && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Address: {booking.address}
                      </Typography>
                    )}
                    
                    {booking.collateral && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Collateral: {booking.collateral}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={{xs:12, md:6}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Chip 
                        label={booking.status.toUpperCase()} 
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                      
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(booking.createdAt)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(booking)}
                        >
                          Details
                        </Button>

                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              disabled={statusUpdateLoading === booking.id}
                              onClick={() => handleStatusUpdate(booking.id, 'approved')}
                            >
                              {statusUpdateLoading === booking.id ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              disabled={statusUpdateLoading === booking.id}
                              onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {booking.status === 'approved' && (
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<CheckCircle />}
                            disabled={statusUpdateLoading === booking.id}
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          >
                            {statusUpdateLoading === booking.id ? 'Completing...' : 'Mark Complete'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Booking Details Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle>
              Booking Details
              <Chip 
                label={selectedBooking.status.toUpperCase()} 
                color={getStatusColor(selectedBooking.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid size={{xs:12, sm:6}}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      label="Full Name"
                      value={selectedBooking.userName}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="Phone Number"
                      value={selectedBooking.phone}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                    {selectedBooking.address && (
                      <TextField
                        label="Address"
                        value={selectedBooking.address}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        InputProps={{ readOnly: true }}
                      />
                    )}
                  </Box>
                </Grid>

                <Grid size={{xs:12, sm:6}}>
                  <Typography variant="h6" gutterBottom>
                    Rental Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      label="Vehicle"
                      value={getCarName(selectedBooking.carId)}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="Start Date"
                      value={formatDate(selectedBooking.startDate)}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="End Date"
                      value={formatDate(selectedBooking.endDate)}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="Total Price"
                      value={formatCurrency(selectedBooking.totalPrice)}
                      fullWidth
                      margin="normal"
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Grid>

                {selectedBooking.collateral && (
                  <Grid size={{xs:12}}>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <TextField
                      label="Collateral / Security Deposit"
                      value={selectedBooking.collateral}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}

                <Grid size={{xs:12}}>
                  <Typography variant="h6" gutterBottom>
                    Booking Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
                    </Typography>
                    {selectedBooking.status !== 'pending' && (
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {new Date().toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>
                Close
              </Button>
              {selectedBooking.status === 'pending' && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'rejected')
                      setDetailDialogOpen(false)
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'approved')
                      setDetailDialogOpen(false)
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  )
}