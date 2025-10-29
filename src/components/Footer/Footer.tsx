// src/components/Footer/Footer.tsx
import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid,
  IconButton,
  Divider
} from '@mui/material'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'var(--card)',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{xs:12, md:4}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Oumer Car Rent Service
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your trusted partner for premium car rental services in Ethiopia. 
              Experience reliability, comfort, and exceptional service with every journey.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About Us' },
                { path: '/cars', label: 'Models' },
                { path: '/tariffs', label: 'Tariffs' },
                { path: '/contact', label: 'Contact' }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  color="text.secondary"
                  variant="body2"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid size={{xs:12, sm:6, md:3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Daily Car Rental',
                'Weekly Rentals',
                'Monthly Leasing',
                'Airport Pickup',
                'Chauffeur Service',
                'Corporate Rentals'
              ].map((service) => (
                <Typography key={service} variant="body2" color="text.secondary">
                  {service}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{xs:12, md:3}}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Addis Ababa, Ethiopia
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +251 913 503 145
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  oumeradem35@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="primary" fontWeight="medium">
                  🕒 Open 24/7 for Service
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Oumer Car Rent Service. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="/privacy"
              color="text.secondary"
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              color="text.secondary"
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              color="text.secondary"
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Contact Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer