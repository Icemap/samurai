'use client';

import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// MUI Components
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useTheme,
  useScrollTrigger,
} from '@mui/material';

// MUI Icons
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const pages = [
  { name: 'Home', href: '/' },
  { name: 'Settings', href: '/settings' },
  { name: 'Company Search', href: '/search' },
  { name: 'LinkedIn Search', href: '/linkedin' },
  { name: 'Pitch Generator', href: '/pitch-generator' },
];

// Scroll-hide effect component
function HideOnScroll(props) {
  const { children } = props;
  
  const trigger = useScrollTrigger({
    target: typeof window !== 'undefined' ? window : undefined,
    threshold: 100,
    disableHysteresis: true,
  });

  return (
    <Box 
      sx={{ 
        transform: trigger ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {children}
    </Box>
  );
}

export default function Navigation() {
  const theme = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Track scroll position to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || (typeof document !== 'undefined' ? document.documentElement.scrollTop : 0);
      setScrolledDown(scrollTop > 10);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Check theme on component mount (client-side only)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Check if dark mode is enabled
      const isDarkMode = document.body?.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);
  
  // Handle mobile menu toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Toggle theme
  const toggleDarkMode = () => {
    if (typeof document !== 'undefined') {
      const body = document.body;
      const newIsDark = !body.classList.contains('dark');
      
      if (newIsDark) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      setIsDark(newIsDark);
    }
  };
  
  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          boxShadow: scrolledDown ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Brand Logo/Name - Desktop View */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              SAMURAI
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="Open menu"
                onClick={handleDrawerToggle}
                edge="start"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { 
                    width: '85%', 
                    maxWidth: 300,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    SAMURAI
                  </Typography>
                  <IconButton color="inherit" onClick={handleDrawerToggle}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <List sx={{ pt: 0 }}>
                  {pages.map((page) => (
                    <ListItem key={page.name} disablePadding>
                      <ListItemButton 
                        component={Link}
                        href={page.href}
                        selected={pathname === page.href}
                        onClick={handleDrawerToggle}
                        sx={{
                          py: 1.5,
                          '&.Mui-selected': {
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: '20%',
                              bottom: '20%',
                              width: 3,
                              bgcolor: 'primary.main',
                              borderRadius: '0 4px 4px 0',
                            }
                          }
                        }}
                      >
                        <ListItemText primary={page.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Box>
            
            {/* Brand Logo/Name - Mobile View */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              SAMURAI
            </Typography>
            
            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  href={page.href}
                  sx={{
                    mx: 1,
                    my: 1,
                    color: pathname === page.href ? 'primary.main' : 'text.primary',
                    position: 'relative',
                    fontWeight: pathname === page.href ? 500 : 400,
                    '&::after': pathname === page.href ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      width: '80%',
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: 4,
                    } : {},
                    '&:hover': {
                      bgcolor: 'transparent',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '10%',
                        width: '80%',
                        height: 2,
                        bgcolor: 'primary.main',
                        borderRadius: 4,
                        opacity: 0.5,
                      }
                    }
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Theme Toggle Button */}
            <Box>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
} 