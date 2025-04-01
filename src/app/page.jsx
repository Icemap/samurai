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
      title: 'AI-Powered Email Writing',
      description: 'Automatically generate high-conversion sales emails using advanced AI technology, improving response rates.',
      icon: <EmailIcon />,
      color: theme.palette.primary.light
    },
    {
      title: 'Intelligent Proposal Generation',
      description: 'Create personalized sales proposals based on customer needs, reducing preparation time.',
      icon: <DescriptionIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Automated Follow-up Conversations',
      description: 'Set up automatic follow-up sequences to ensure you maintain contact with prospects without missing any leads.',
      icon: <ChatIcon />,
      color: theme.palette.info.main
    },
    {
      title: 'Customer Relationship Management',
      description: 'Integrated CRM functionality to track all customer interactions and sales funnel status.',
      icon: <PeopleIcon />,
      color: theme.palette.warning.main
    },
    {
      title: 'Sales Data Analytics',
      description: 'Powerful analytics dashboard to help you understand sales performance and areas for improvement.',
      icon: <BarChartIcon />,
      color: theme.palette.error.main
    },
    {
      title: 'Time Efficiency Improvement',
      description: 'Automate repetitive tasks, allowing sales teams to focus on building relationships and closing deals.',
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
            AI-Driven
            <Box component="span" sx={{ color: 'primary.main', mx: 1 }}>
              Sales Automation
            </Box>
            Tool
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
            Use artificial intelligence to automatically generate personalized sales emails, proposals, and follow-ups to increase conversion rates and save time.
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
              Powerful Features, Simplified Sales Process
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              Our sales automation tools provide comprehensive features to help your team focus on what matters most—closing deals.
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
                  Ready to boost your sales efficiency?
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: { xs: 3, md: 0 } }}>
                  Join thousands of businesses using our AI sales tools to increase conversion rates and revenue.
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
            Customer Feedback
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
                    "This tool has helped our sales team improve efficiency by 40%. The quality of AI-generated emails and proposals exceeded our expectations, and client feedback has been very positive."
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Michael Zhang
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sales Director, Tech Innovation Inc.
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
                    "Since using this platform, our sales cycle has shortened by 30%, and team members can handle more potential clients. The automated follow-up feature is particularly useful."
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Tina Lee
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Business Development Manager, Future Business Solutions
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