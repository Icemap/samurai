'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Stack,
  Rating,
  Avatar,
  useTheme
} from '@mui/material';

// MUI Icons
import {
  Email as EmailIcon,
  Description as DescriptionIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Mouse as MouseIcon
} from '@mui/icons-material';

export default function Home() {
  const theme = useTheme();

  // Features data
  const features = [
    {
      title: 'AI-Powered Outreach Writing',
      description: 'Automatically generate high-conversion SDR outreach emails using advanced AI technology, improving response rates.',
      icon: <EmailIcon />,
      color: theme.palette.primary.light
    },
    {
      title: 'Smart Prospect Research',
      description: 'Research and identify ideal prospects with AI-powered insights, ensuring targeted and personalized outreach.',
      icon: <DescriptionIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Automated Follow-up Sequences',
      description: 'Set up intelligent follow-up sequences to maintain consistent engagement with prospects.',
      icon: <ChatIcon />,
      color: theme.palette.info.main
    },
    {
      title: 'Prospect Relationship Management',
      description: 'Track all prospect interactions and engagement status throughout your outreach process.',
      icon: <PeopleIcon />,
      color: theme.palette.warning.main
    },
    {
      title: 'Outreach Analytics',
      description: 'Comprehensive analytics dashboard to measure outreach performance and optimize your approach.',
      icon: <BarChartIcon />,
      color: theme.palette.error.main
    },
    {
      title: 'Productivity Enhancement',
      description: 'Automate repetitive tasks, allowing SDRs to focus on building meaningful prospect relationships.',
      icon: <AccessTimeIcon />,
      color: theme.palette.success.main
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          px: 2
        }}
      >
        <Container maxWidth="lg">
          <AutoAwesomeIcon
            sx={{
              fontSize: 60,
              color: 'primary.main',
              mb: 3
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: 1.2
            }}
          >
            AI-Powered
            <Box component="span" sx={{ color: 'primary.main', mx: 1 }}>
              SDR Automation
            </Box>
            Platform
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              mb: 5
            }}
          >
            Leverage artificial intelligence to generate personalized outreach emails, research prospects, and manage follow-ups to increase meeting booking rates and improve SDR productivity.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Powerful Features for Modern SDRs
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              Our SDR automation tools provide comprehensive features to help your team focus on what matters most—booking quality meetings.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                  variant="outlined"
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${feature.color}20`,
                        color: feature.color,
                        width: 56,
                        height: 56,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      component="h3"
                      fontWeight="medium"
                      gutterBottom
                      sx={{
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box component="section" sx={{ py: 4, px: 2 }}>
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
            elevation={4}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                  Ready to boost your SDR productivity?
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: { xs: 3, md: 0 } }}>
                  Join modern SDR teams using our AI tools to increase meeting booking rates and improve outreach efficiency.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<MouseIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  Try Free for 14 Days
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            SDR Success Stories
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }} variant="outlined">
                <CardContent sx={{ p: 4 }}>
                  <Rating value={5} readOnly sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: 'italic', mb: 3 }}
                    color="text.secondary"
                  >
                    "This platform has helped our SDR team improve meeting booking rates by 40%. The AI-generated outreach emails are highly personalized and engaging, resulting in significantly better response rates."
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Michael Zhang
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      SDR Manager, Tech Innovation Inc.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }} variant="outlined">
                <CardContent sx={{ p: 4 }}>
                  <Rating value={5} readOnly sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: 'italic', mb: 3 }}
                    color="text.secondary"
                  >
                    "Since implementing this tool, our SDRs can handle 3x more prospects while maintaining high-quality personalization. The automated follow-up sequences have been particularly effective."
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Tina Lee
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Head of SDR, Future Business Solutions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 