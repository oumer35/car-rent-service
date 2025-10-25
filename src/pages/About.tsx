// import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  DirectionsCar,
  Security,
  Support,
  LocationOn,
  Speed,
  Star
} from '@mui/icons-material';

export default function About() {
  const features = [
    {
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      title: 'Wide Vehicle Selection',
      description: 'Choose from our diverse fleet of well-maintained vehicles, from economy cars to luxury SUVs.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Safe & Reliable',
      description: 'All our vehicles undergo regular maintenance and safety checks to ensure your peace of mind.'
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you with any needs.'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      title: 'Multiple Locations',
      description: 'Convenient pickup and drop-off locations across the city for your convenience.'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Easy Booking',
      description: 'Simple and fast booking process with instant confirmation and flexible payment options.'
    },
    {
      icon: <Star sx={{ fontSize: 40 }} />,
      title: 'Premium Service',
      description: 'Experience premium service with additional amenities and personalized assistance.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '50+', label: 'Vehicles' },
    { value: '24/7', label: 'Support' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      {/* Hero Section */}
      <Card sx={{ mb: 6, background: 'linear-gradient(135deg, #0b74de 0%, #3ea3ff 100%)', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            About Oumer Car Rent
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, margin: '0 auto', opacity: 0.9 }}>
            Your Trusted Partner for Premium Car Rental Services
          </Typography>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{xs:12, md:6}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                To provide reliable, affordable, and convenient car rental solutions that empower 
                our customers to travel with confidence and comfort.
              </Typography>
              <Typography variant="body1">
                We believe that everyone deserves access to quality transportation, whether for 
                business trips, family vacations, or daily commutes.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, md:6}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph>
                To become the most trusted and preferred car rental service in the region, 
                known for our exceptional customer service and commitment to quality.
              </Typography>
              <Typography variant="body1">
                We strive to continuously innovate and improve our services to meet the 
                evolving needs of our valued customers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Paper sx={{ p: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary">
          Why Choose Oumer Car Rent?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid size={{xs:6, md:3}} key= {index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" color="primary" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" textAlign="center" gutterBottom color="primary">
          What We Offer
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Story Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom color="primary">
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            Founded with a passion for mobility and customer satisfaction, Oumer Car Rent Service 
            began as a small local business with just a handful of vehicles. Our founder, Oumer, 
            recognized the growing need for reliable and affordable transportation solutions in our community.
          </Typography>
          <Typography variant="body1" paragraph>
            What started as a modest venture has grown into a trusted name in car rental services, 
            thanks to our unwavering commitment to quality, transparency, and exceptional customer care. 
            We've expanded our fleet, enhanced our services, and built lasting relationships with 
            thousands of satisfied customers.
          </Typography>
          <Typography variant="body1">
            Today, we continue to uphold our core values while embracing innovation to provide 
            you with the best possible car rental experience.
          </Typography>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{xs: 12, md: 4}}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, margin: '0 auto 16px' }}>
              <Support sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Customer First
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your satisfaction is our top priority. We listen to your needs and strive to exceed your expectations.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{xs:12, md:4}}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, margin: '0 auto 16px' }}>
              <Security sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Safety & Quality
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We maintain the highest standards of vehicle safety and service quality for your peace of mind.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{xs:12, md:4}}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, margin: '0 auto 16px' }}>
              <Star sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Excellence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We are committed to delivering excellent service and continuously improving our offerings.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Team Section */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom color="primary" textAlign="center">
            Our Commitment
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={3}>
            <Grid size={{xs:12, md:6}}>
              <Typography variant="h5" gutterBottom>
                🚗 Quality Vehicles
              </Typography>
              <Typography variant="body2" paragraph>
                Every vehicle in our fleet is meticulously maintained, regularly serviced, 
                and thoroughly cleaned to ensure your comfort and safety.
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                💰 Transparent Pricing
              </Typography>
              <Typography variant="body2" paragraph>
                No hidden fees or surprise charges. We believe in clear, upfront pricing 
                so you can budget your trip with confidence.
              </Typography>
            </Grid>
            <Grid size={{xs:12, md:6}}>
              <Typography variant="h5" gutterBottom>
                🌟 Exceptional Service
              </Typography>
              <Typography variant="body2" paragraph>
                Our team is dedicated to providing personalized service and going the extra 
                mile to make your rental experience seamless and enjoyable.
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                🔄 Flexible Options
              </Typography>
              <Typography variant="body2" paragraph>
                From short-term daily rentals to long-term leases, we offer flexible 
                solutions tailored to your specific needs and schedule.
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Chip 
              label="Trusted • Reliable • Affordable" 
              color="primary" 
              variant="outlined"
              sx={{ fontSize: '1.1rem', p: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Paper sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Experience the Oumer Difference?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Join thousands of satisfied customers who trust us for their transportation needs
        </Typography>
        <Chip 
          label="Book Your Vehicle Today →" 
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            fontSize: '1.1rem',
            p: 2,
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        />
      </Paper>
    </Container>
  );
}