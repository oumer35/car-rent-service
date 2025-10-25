import { 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Typography, 
  Box,
  ListItemButton 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/cars', label: 'Manage Cars' },
    { path: '/admin/bookings', label: 'Manage Bookings' },
    { path: '/admin/users', label: 'Users' }
  ];

  return (
    <Box 
      sx={{ 
        width: 240, 
        bgcolor: 'var(--card)',
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2,
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Admin Panel
        </Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="caption" color="text.secondary">
          Version 1.0
        </Typography>
      </Box>
    </Box>
  );
}