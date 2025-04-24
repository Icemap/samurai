'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login with the current URL as callback
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [loading, isAuthenticated, router]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? children : null;
} 