import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  TextField,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0} 
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        py: isMobile ? 2 : 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
           Oumer Car Rent Service<span style={{ color: '#0b74de' }}>.</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }} component="nav">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/cars', label: 'Models' },
              { path: '/tariffs', label: 'Tariffs' },
              { path: '/contact', label: 'Contact' }
            ].map(({ path, label }) => (
              <Button
                key={path}
                component={Link}
                to={path}
                color={isActive(path) ? 'primary' : 'inherit'}
                sx={{ 
                  fontWeight: isActive(path) ? 600 : 400,
                  minWidth: 'auto'
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          <TextField
            size="small"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: isMobile ? '100%' : 220,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
          
          <Button 
            variant="outlined"
            onClick={() => {
              const currentTheme = document.body.getAttribute('data-theme') || 'light';
              const newTheme = currentTheme === 'light' ? 'dark' : 'light';
              document.body.setAttribute('data-theme', newTheme);
              localStorage.setItem('cr_theme', newTheme);
            }}
            sx={{ borderRadius: 2 }}
          >
            Toggle Theme
          </Button>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user.role === 'admin' && (
                <Button onClick={() => navigate('/admin')} color="primary">
                  Admin
                </Button>
              )}
              <Button 
                onClick={() => { signOut(); navigate('/'); }}
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Sign out ({user.name || user.phone})
              </Button>
            </Box>
          ) : (
            <Button 
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}