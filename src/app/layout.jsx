import './globals.css';
import Navigation from '../components/Navigation';
import ThemeProvider from '../components/ThemeProvider';
import { Box, Container } from '@mui/material';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Sales Automation Tool',
  description: 'Empower your sales with AI technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
              {children}
            </Container>
            <Footer />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
} 