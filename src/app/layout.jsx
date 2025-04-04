import './globals.css';
import Navigation from '../components/Navigation';
import { ThemeProvider } from '../components/ThemeProvider';
import { Box, Container } from '@mui/material';
import Footer from '../components/Footer';
import { Suspense } from 'react';

export const metadata = {
  title: 'SDR Automation Tool',
  description: 'Empower your SDR team with AI technology for personalized outreach',
  keywords: 'SDR, sales, automation, AI, outreach, personalization, TiDB',
  authors: [{ name: 'TiDB Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/icon.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh' 
          }}>
            <Navigation />
            <Container 
              component="main" 
              maxWidth="xl" 
              sx={{ 
                flexGrow: 1, 
                py: 4, 
                px: { xs: 2, sm: 3 } 
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </Container>
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
} 