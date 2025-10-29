import { useState } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Grid,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { sendVerificationCode, verifyCode } = useAuth();
  const navigate = useNavigate();
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: ''
  });
  const [verifyForm, setVerifyForm] = useState({
    vphone: '',
    code: ''
  });
  const [messages, setMessages] = useState({
    signup: '',
    verify: ''
  });

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!/^\d{9,15}$/.test(signupForm.phone)) {
    setMessages(prev => ({ ...prev, signup: 'Invalid phone number' }));
    return;
  }

  try {
    const response = await sendVerificationCode(signupForm.phone);

    console.log('🔐 DEBUG: Verification code response:', response);
    setMessages(prev => ({
      ...prev,
      signup: 'Verification code sent successfully! Check your phone or console.',
    }));

    setVerifyForm(prev => ({ ...prev, vphone: signupForm.phone }));
  } catch (error) {
    console.error('Error sending verification code:', error);
    setMessages(prev => ({ ...prev, signup: 'Failed to send code.' }));
  }
};

  const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  

  try {
    const response = await verifyCode(verifyForm.vphone, verifyForm.code);

    console.log('🎯 DEBUG: Verification successful:', response);
    setMessages(prev => ({ ...prev, verify: 'Verified — signed in!' }));
    navigate('/');
  } catch (error) {
    console.error('Error verifying code:', error);
    setMessages(prev => ({ ...prev, verify: 'Invalid or expired code.' }));
  }
};

  const handleResend = () => {
    const phone = signupForm.phone || verifyForm.vphone;
    if (!phone) {
      setMessages(prev => ({ ...prev, verify: 'Enter phone on Sign Up first' }));
      return;
    }
    
    const newCode = sendVerificationCode(phone);
    
    // Log the new verification code
    console.log('🔄 DEBUG: Code resent to:', phone);
    console.log('🔐 DEBUG: New verification code:', newCode);
    
    setMessages(prev => ({ ...prev, verify: `Code resent! New debug code: ${newCode}` }));
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Sign In / Sign Up
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Sign Up
              </Typography>
              <Box component="form" onSubmit={handleSignUp}>
                <TextField
                  fullWidth
                  label="Full name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Phone"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                  margin="normal"
                  required
                  inputProps={{ pattern: '\\d{9,15}' }}
                  placeholder="e.g. 251912345678"
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Sign Up (send code)
                </Button>
                
                {messages.signup && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    {messages.signup}
                  </Alert>
                )}
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Verify Code
              </Typography>
              <Box component="form" onSubmit={handleVerify}>
                <TextField
                  fullWidth
                  label="Phone (used to send)"
                  value={verifyForm.vphone}
                  onChange={(e) => setVerifyForm(prev => ({ ...prev, vphone: e.target.value }))}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Code"
                  value={verifyForm.code}
                  onChange={(e) => setVerifyForm(prev => ({ ...prev, code: e.target.value }))}
                  margin="normal"
                  required
                  inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
                  helperText="Check browser console (F12) for the verification code"
                />
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                  >
                    Verify
                  </Button>
                  <Button 
                    type="button"
                    variant="outlined" 
                    onClick={handleResend}
                  >
                    Resend
                  </Button>
                </Box>
                
                {messages.verify && (
                  <Alert 
                    severity={messages.verify.includes('Invalid') ? 'error' : 'success'} 
                    sx={{ mt: 1 }}
                  >
                    {messages.verify}
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}