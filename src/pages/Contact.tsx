import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Grid,
  Box
} from '@mui/material';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    msg: ''
  });
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setForm({ name: '', email: '', msg: '' });
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Contact
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{xs:12, md:6}}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Address: 123 Demo St.
              </Typography>
              <Typography variant="body1">
                Follow us:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant="outlined" size="small">Twitter</Button>
                <Button variant="outlined" size="small">Instagram</Button>
              </Box>
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  value={form.msg}
                  onChange={(e) => setForm(prev => ({ ...prev, msg: e.target.value }))}
                  margin="normal"
                  required
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  sx={{ mt: 2 }}
                >
                  Send
                </Button>
                
                {messageSent && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Message sent. Thank you!
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}