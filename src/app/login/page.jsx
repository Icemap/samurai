'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { reportUserAction } from '../../services/analytics';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorCode = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for error parameter in URL
  useEffect(() => {
    if (errorCode) {
      const errorMessages = {
        'AuthFailed': 'Authentication failed. Please try again.',
        'ServerError': 'Server error occurred. Please try again later.',
        'NotAuthorized': 'You are not authorized to access this resource.',
        'Default': 'An error occurred. Please try again.'
      };
      
      setError(errorMessages[errorCode] || errorMessages.Default);
    }
  }, [errorCode]);

  // Check if user is already logged in
  useEffect(() => {
    // Parse cookies to check if user is already logged in
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key) acc[key] = value;
      return acc;
    }, {});
    
    // If user_id cookie exists, user is logged in
    if (cookies.user_id) {
      // User is already logged in, redirect to callback URL or home page
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Report login action
      await reportUserAction('login', { email: '', name: '' });
      
      // Save the callback URL in a cookie before redirection
      document.cookie = `frontend_redirect=${encodeURIComponent(callbackUrl)};path=/;max-age=600;SameSite=Lax`;
      
      // Redirect to backend authentication endpoint
      window.location.href = process.env.BACKEND_URL + '/login';
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            mb: 4 
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access the SDR Automation Tool
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{ 
            py: 1.5,
            mb: 2,
            bgcolor: '#4285F4',
            '&:hover': {
              bgcolor: '#357ae8'
            }
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 