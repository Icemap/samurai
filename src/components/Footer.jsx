'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';

export default function Footer() {
  const [year, setYear] = useState(2024); // 使用静态年份作为初始值
  
  // 在客户端使用实际年份
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        borderTop: 1, 
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          textAlign: 'center', 
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}>
          © {year} Sales Automation Tool · Powered by AI
        </Box>
      </Container>
    </Box>
  );
} 