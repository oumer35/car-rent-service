import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About'
import Cars from './pages/Cars';
import Tariffs from './pages/Tariffs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Box } from '@mui/material';

export default function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Header />
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
          {isAdmin && <Sidebar />}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              bgcolor: 'var(--bg)',
              minHeight: 'calc(100vh - 64px)'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/tariffs" element={<Tariffs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/cars" element={
                <ProtectedRoute>
                  <AdminCars />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
            </Routes>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}