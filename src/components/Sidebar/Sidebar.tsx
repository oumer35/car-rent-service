// src/components/Sidebar/Sidebar.tsx
import { 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Typography, 
  Box,
  ListItemButton,
  ListItemIcon
} from '@mui/material'
import {
  Dashboard,
  DirectionsCar,
  BookOnline,
  People
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/admin/cars', label: 'Manage Cars', icon: <DirectionsCar /> },
  { path: '/admin/bookings', label: 'Manage Bookings', icon: <BookOnline /> },
  { path: '/admin/users', label: 'Users', icon: <People /> },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <Box 
      sx={{ 
        width: 280,
        flexShrink: 0,
        bgcolor: 'var(--card)',
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        overflowY: 'auto'
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Management Console
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Car Rental System
        </Typography>
      </Box>
    </Box>
  )
}