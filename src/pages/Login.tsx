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
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { sendCode, verifyCode } = useAuth();
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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{9,15}$/.test(signupForm.phone)) {
      setMessages(prev => ({ ...prev, signup: 'Invalid phone number' }));
      return;
    }
    
    const generatedCode = sendCode(signupForm.phone);
    
    // Log the verification code to console for debugging
    console.log('🔐 DEBUG: Verification code generated:', generatedCode);
    console.log('📱 DEBUG: Phone number:', signupForm.phone);
    console.log('💡 DEBUG: Use this code in the verification form:', generatedCode);
    
    setMessages(prev => ({ 
      ...prev, 
      signup: `Code sent! Check browser console for verification code. Debug code: ${generatedCode}` 
    }));
    
    // Auto-fill the phone in verify form
    setVerifyForm(prev => ({ ...prev, vphone: signupForm.phone }));
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log verification attempt
    console.log('🔍 DEBUG: Verifying code...');
    console.log('📱 DEBUG: Phone:', verifyForm.vphone);
    console.log('🔢 DEBUG: Entered code:', verifyForm.code);
    
    const ok = verifyCode(verifyForm.code);
    
    console.log('🎯 DEBUG: Verification result:', ok ? 'SUCCESS' : 'FAILED');
    
    setMessages(prev => ({ 
      ...prev, 
      verify: ok ? 'Verified — signed in.' : 'Invalid code' 
    }));
    
    if (ok) {
      console.log('🎉 DEBUG: User successfully verified and signed in!');
      navigate('/');
    }
  };

  const handleResend = () => {
    const phone = signupForm.phone || verifyForm.vphone;
    if (!phone) {
      setMessages(prev => ({ ...prev, verify: 'Enter phone on Sign Up first' }));
      return;
    }
    
    const newCode = sendCode(phone);
    
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