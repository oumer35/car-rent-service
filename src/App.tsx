import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'

import theme from '../theme.tsx'
import Header from './components/Header/Header.tsx'
import Sidebar from './components/Sidebar/Sidebar.tsx'
import Footer from './components/Footer/Footer.tsx'

import Home from './pages/Home/Home.tsx'
import About from './pages/About/About.tsx'
import Cars from './pages/Cars/Cars.tsx'
import Tariffs from './pages/Tariffs/Tariffs.tsx'
import Contact from './pages/Contact/Contact.tsx'
import Login from './pages/Login/Login.tsx'
import Bookings from './pages/Bookings/Bookings.tsx'

import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard.tsx'
import AdminCars from './pages/admin/AdminCars/AdminCars.tsx'
import AdminBookings from './pages/admin/AdminBookings/AdminBookings.tsx'
import AdminUsers from './pages/admin/AdminUsers/AdminUsers.tsx'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx'
import { useAuth } from './contexts/useAuth.tsx'

export default function App() {
  const auth = useAuth()
  const user = auth?.user
  const isAdmin = user?.role === 'admin'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {isAdmin && <Sidebar />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: 'var(--bg)',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/tariffs" element={<Tariffs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/bookings" element={<Bookings />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cars"
                element={
                  <ProtectedRoute>
                    <AdminCars />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
