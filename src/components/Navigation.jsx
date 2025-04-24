'use client';

import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from './ThemeProvider';
import { getUser, logout } from '../lib/auth';

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
  Divider,
} from '@mui/material';

// MUI Icons
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
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
  const theme = useMuiTheme();
  const { isDark, setIsDark } = useAppTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // Check user authentication status
  useEffect(() => {
    const checkUser = () => {
      const userData = getUser();
      setUser(userData);
    };
    
    checkUser();
    
    // Listen for cookie changes
    window.addEventListener('cookie-change', checkUser);
    return () => {
      window.removeEventListener('cookie-change', checkUser);
    };
  }, []);
  
  // Handle user menu open
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  // Handle user menu close
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout(() => {
      handleCloseUserMenu();
      router.push('/');
    });
  };
  
  // Handle login
  const handleLogin = () => {
    router.push('/login');
  };
  
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
  
  // Handle mobile menu toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Toggle theme
  const toggleDarkMode = () => {
    if (typeof document !== 'undefined') {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      
      if (newIsDark) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
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
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/icon.jpg"
                alt="Logo"
                sx={{
                  height: 32,
                  width: 32,
                  mr: 1,
                  borderRadius: 1,
                }}
              />
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
                <Divider />
                {user ? (
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {user.picture ? (
                        <Avatar 
                          alt={user.name} 
                          src={user.picture}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="primary"
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={handleLogin}
                      startIcon={<LoginIcon />}
                    >
                      Login
                    </Button>
                  </Box>
                )}
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
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src="/icon.jpg"
                alt="Logo"
                sx={{
                  height: 32,
                  width: 32,
                  mr: 1,
                  borderRadius: 1,
                }}
              />
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
                sx={{ mr: 1 }}
              >
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              {/* Auth Button */}
              {user ? (
                <Box sx={{ ml: 1 }}>
                  <Tooltip title="Account settings">
                    <IconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ p: 0 }}
                      aria-label="Account settings"
                      aria-controls="user-menu"
                      aria-haspopup="true"
                    >
                      {user.picture ? (
                        <Avatar 
                          alt={user.name} 
                          src={user.picture}
                          sx={{ width: 36, height: 36 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="user-menu"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button 
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
} 