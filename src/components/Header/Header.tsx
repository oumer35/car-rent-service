// src/components/Header/Header.tsx
import { useState, useEffect } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  TextField,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCars } from '../../contexts/CarContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const { searchCars } = useCars()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchCars(searchQuery)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, searchCars])

  const handleThemeToggle = () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light'
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    document.body.setAttribute('data-theme', newTheme)
    localStorage.setItem('cr_theme', newTheme)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

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
          {isMobile && (
            <IconButton
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
            Oumer Car Rent<span style={{ color: '#0b74de' }}>.</span>
          </Typography>
          
          {!isMobile && (
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
          )}
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
            onClick={handleThemeToggle}
            sx={{ borderRadius: 2 }}
          >
            Toggle Theme
          </Button>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user.role === 'admin' && (
                <Button 
                  component={Link}
                  to="/admin"
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  Admin
                </Button>
              )}
              <Button 
                onClick={handleSignOut}
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Sign out ({user.name || user.phone})
              </Button>
            </Box>
          ) : (
            <Button 
              component={Link}
              to="/login"
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
      >
        {[
          { path: '/', label: 'Home' },
          { path: '/about', label: 'About' },
          { path: '/cars', label: 'Models' },
          { path: '/tariffs', label: 'Tariffs' },
          { path: '/contact', label: 'Contact' }
        ].map(({ path, label }) => (
          <MenuItem
            key={path}
            component={Link}
            to={path}
            onClick={() => setMobileMenuAnchor(null)}
            selected={isActive(path)}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  )
}