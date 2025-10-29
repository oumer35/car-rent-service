// src/pages/Contact/Contact.tsx
import React, { useState } from 'react'
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Grid,
  Box,
  Alert,
  Paper,
  Chip
} from '@mui/material'
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send
} from '@mui/icons-material'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [messageSent, setMessageSent] = useState(false)
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {}

    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessageSent(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      setTimeout(() => setMessageSent(false), 5000)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const contactInfo = [
    {
      icon: <Phone color="primary" />,
      title: 'Phone',
      details: ['+251 913 503 145', '+251 911 234 567'],
      description: 'Call us anytime'
    },
    {
      icon: <Email color="primary" />,
      title: 'Email',
      details: ['oumeradem35@gmail.com', 'support@oumercarrent.com'],
      description: 'Send us an email'
    },
    {
      icon: <LocationOn color="primary" />,
      title: 'Address',
      details: ['Bole Road', 'Addis Ababa, Ethiopia'],
      description: 'Visit our office'
    },
    {
      icon: <Schedule color="primary" />,
      title: 'Working Hours',
      details: ['Monday - Sunday: 24/7', 'Emergency: Always Available'],
      description: 'We are always here for you'
    }
  ]

  return (
    <Container sx={{ mt: 3, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid size={{xs:12, md:5}}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Get In Touch
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We're here to help you with any questions about our car rental services. 
                Reach out to us through any of the following channels.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {info.title}
                      </Typography>
                      {info.details.map((detail, detailIndex) => (
                        <Typography key={detailIndex} variant="body2" color="text.secondary">
                          {detail}
                        </Typography>
                      ))}
                      <Typography variant="caption" color="text.secondary">
                        {info.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Emergency Contact Chip */}
              <Paper sx={{ p: 2, mt: 3, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.100' }}>
                <Typography variant="body2" fontWeight="bold" color="error.main" gutterBottom>
                  🚨 Emergency Roadside Assistance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available 24/7 for all our customers. Call us immediately if you need help on the road.
                </Typography>
                <Chip 
                  label="+251 911 999 999" 
                  color="error" 
                  variant="filled"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                />
              </Paper>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Frequently Asked Questions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  {
                    q: 'What documents do I need to rent a car?',
                    a: 'Valid driver\'s license, ID card, and proof of insurance.'
                  },
                  {
                    q: 'What is the minimum rental age?',
                    a: '21 years with a valid driver\'s license for at least 1 year.'
                  },
                  {
                    q: 'Is there a delivery service?',
                    a: 'Yes, we offer delivery to your location for an additional fee.'
                  }
                ].map((faq, index) => (
                  <Box key={index}>
                    <Typography variant="body2" fontWeight="bold">
                      {faq.q}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.a}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid size={{xs:12, md:7}}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Send us a Message
              </Typography>
              
              {messageSent && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you within 24 hours.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      margin="normal"
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={form.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      margin="normal"
                      required
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      margin="normal"
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={form.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      margin="normal"
                      required
                      error={!!errors.subject}
                      helperText={errors.subject}
                    />
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={form.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      margin="normal"
                      required
                      error={!!errors.message}
                      helperText={errors.message}
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </Grid>
                  
                  <Grid size={{xs:12}}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      disabled={loading}
                      startIcon={<Send />}
                      sx={{ mt: 2 }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Response Time Info */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Response Time:</strong> We typically respond to all inquiries within 2-4 hours during 
                  business hours. For urgent matters, please call us directly.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Map/Location Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Our Location
              </Typography>
              <Box 
                sx={{ 
                  height: 200, 
                  bgcolor: 'grey.100', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <LocationOn color="primary" fontSize="large" />
                <Typography variant="body2" color="text.secondary" align="center">
                  Bole Road, Addis Ababa, Ethiopia<br />
                  Near Bole International Airport
                </Typography>
                <Button variant="outlined" size="small">
                  Get Directions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}