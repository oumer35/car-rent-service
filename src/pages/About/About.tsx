// src/pages/About/About.tsx
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
} from '@mui/material'
import {
  DirectionsCar,
  Security,
  Support,
  LocationOn,
  Speed,
  Star,
  EmojiPeople,
  LocalPolice,
  CarRental
} from '@mui/icons-material'

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
  ]

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '50+', label: 'Vehicles' },
    { value: '24/7', label: 'Support' },
    { value: '98%', label: 'Satisfaction Rate' }
  ]

  const teamValues = [
    {
      icon: <EmojiPeople sx={{ fontSize: 40 }} />,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We listen to your needs and strive to exceed your expectations.'
    },
    {
      icon: <LocalPolice sx={{ fontSize: 40 }} />,
      title: 'Safety & Quality',
      description: 'We maintain the highest standards of vehicle safety and service quality for your peace of mind.'
    },
    {
      icon: <CarRental sx={{ fontSize: 40 }} />,
      title: 'Reliability',
      description: 'Count on us for dependable vehicles and trustworthy service every time you rent with us.'
    }
  ]

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      {/* Hero Section */}
      <Card sx={{ 
        mb: 6, 
        background: 'linear-gradient(135deg, #0b74de 0%, #3ea3ff 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            About Oumer Car Rent
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, margin: '0 auto', opacity: 0.9 }}>
            Your Trusted Partner for Premium Car Rental Services in Ethiopia
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
                our customers to travel with confidence and comfort throughout Ethiopia.
              </Typography>
              <Typography variant="body1">
                We believe that everyone deserves access to quality transportation, whether for 
                business trips, family vacations, or daily commutes. Our mission is to make 
                car rental accessible, safe, and enjoyable for all our customers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12, md:6}}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph>
                To become the most trusted and preferred car rental service in Ethiopia, 
                known for our exceptional customer service, modern fleet, and commitment to quality.
              </Typography>
              <Typography variant="body1">
                We strive to continuously innovate and improve our services to meet the 
                evolving needs of our valued customers while maintaining the highest standards 
                of safety and reliability.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Paper sx={{ p: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
          Why Choose Oumer Car Rent?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid size={{xs:6, md:3}} key={index}>
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
        <Typography variant="h3" textAlign="center" gutterBottom color="primary" fontWeight="bold">
          What We Offer
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid size={{xs:12, sm:6, md:4}} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
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

      {/* Team Values */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom color="primary" textAlign="center" fontWeight="bold">
            Our Values
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={4}>
            {teamValues.map((value, index) => (
              <Grid size={{xs:12, md:4}} key={index}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, margin: '0 auto 16px' }}>
                    {value.icon}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
            Our Story
          </Typography>
          <Typography variant="body1" paragraph>
            Founded with a passion for mobility and customer satisfaction, Oumer Car Rent Service 
            began as a small local business with just a handful of vehicles. Our founder, Oumer, 
            recognized the growing need for reliable and affordable transportation solutions in Ethiopia.
          </Typography>
          <Typography variant="body1" paragraph>
            What started as a modest venture has grown into a trusted name in car rental services, 
            thanks to our unwavering commitment to quality, transparency, and exceptional customer care. 
            We've expanded our fleet, enhanced our services, and built lasting relationships with 
            thousands of satisfied customers across the country.
          </Typography>
          <Typography variant="body1">
            Today, we continue to uphold our core values while embracing innovation to provide 
            you with the best possible car rental experience. From our modern fleet to our 
            dedicated support team, every aspect of our service is designed with your comfort 
            and satisfaction in mind.
          </Typography>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
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
            fontWeight: 'bold',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
          onClick={() => window.location.href = '/cars'}
        />
      </Paper>
    </Container>
  )
}