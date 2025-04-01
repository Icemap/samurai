'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import React from 'react';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions
} from '@mui/material';

// MUI Timeline components need to be imported from @mui/lab
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';

// MUI Icons
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon
} from '@mui/icons-material';

// Mock data for demonstration
const mockProfiles = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Chief Technology Officer',
    company: 'Acme Corporation',
    email: 's.johnson@acme.com',
    linkedin: 'linkedin.com/in/sarahjohnson',
    location: 'New York, USA',
    experience: [
      {
        title: 'Chief Technology Officer',
        company: 'Acme Corporation',
        duration: '2018 - Present',
        description: 'Responsible for company technology strategy and product development, managing a team of 100 engineers.'
      },
      {
        title: 'VP of Engineering',
        company: 'TechCorp',
        duration: '2015 - 2018',
        description: 'Led multiple key projects, including core product refactoring.'
      },
      {
        title: 'Senior Software Engineer',
        company: 'Innovation Labs',
        duration: '2010 - 2015',
        description: 'Developed enterprise software solutions focused on cloud computing and big data analytics.'
      }
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        school: 'Stanford University',
        year: '2010'
      },
      {
        degree: 'Bachelor of Computer Science',
        school: 'MIT',
        year: '2008'
      }
    ],
    skills: ['Technical Leadership', 'Software Architecture', 'Product Strategy', 'AI/ML', 'Cloud Computing'],
    connections: 2740,
    interests: ['Technology Innovation', 'Entrepreneurship', 'Artificial Intelligence']
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Director of Sales',
    company: 'Globex Corporation',
    email: 'michael.chen@globex.com',
    linkedin: 'linkedin.com/in/michaelchen',
    location: 'Chicago, USA',
    experience: [
      {
        title: 'Director of Sales',
        company: 'Globex Corporation',
        duration: '2019 - Present',
        description: 'Leading North American sales team, exceeding annual sales targets.'
      },
      {
        title: 'Regional Sales Manager',
        company: 'Initech',
        duration: '2016 - 2019',
        description: 'Managed Western regional sales team, responsible for client relationships and new business development.'
      },
      {
        title: 'Account Executive',
        company: 'Sales Solutions Inc',
        duration: '2012 - 2016',
        description: 'Managed key enterprise accounts, responsible for the full sales cycle.'
      }
    ],
    education: [
      {
        degree: 'MBA',
        school: 'University of Chicago',
        year: '2012'
      },
      {
        degree: 'Bachelor of Marketing',
        school: 'University of Michigan',
        year: '2010'
      }
    ],
    skills: ['Sales Management', 'Negotiation', 'Client Relations', 'CRM', 'Sales Strategy'],
    connections: 3150,
    interests: ['Sales Leadership', 'Business Strategy', 'SaaS']
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'VP of Product',
    company: 'Soylent Corp',
    email: 'e.rodriguez@soylent.com',
    linkedin: 'linkedin.com/in/emilyrodriguez',
    location: 'Los Angeles, USA',
    experience: [
      {
        title: 'VP of Product',
        company: 'Soylent Corp',
        duration: '2020 - Present',
        description: 'Responsible for product strategy, roadmap, and new product development.'
      },
      {
        title: 'Senior Product Manager',
        company: 'Food Innovations Inc',
        duration: '2017 - 2020',
        description: 'Managed multiple product lines from concept to market.'
      },
      {
        title: 'Product Manager',
        company: 'Consumer Goods Co',
        duration: '2014 - 2017',
        description: 'Responsible for mid-size consumer product lifecycle management.'
      }
    ],
    education: [
      {
        degree: 'MBA',
        school: 'UCLA',
        year: '2014'
      },
      {
        degree: 'Bachelor of Nutrition',
        school: 'UC Davis',
        year: '2012'
      }
    ],
    skills: ['Product Management', 'Market Analysis', 'Consumer Insights', 'Product Development', 'Team Leadership'],
    connections: 2580,
    interests: ['Sustainable Food', 'Consumer Behavior', 'Product Innovation']
  }
];

export default function LinkedInSearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      query: ''
    }
  });

  const searchQuery = watch('query');

  const onSubmit = (data) => {
    setIsSearching(true);
    setSelectedProfile(null);
    
    // Simulate API call
    setTimeout(() => {
      // Filter profiles based on search criteria
      const filteredResults = mockProfiles.filter(profile => {
        const query = data.query.toLowerCase();
        return (
          profile.name.toLowerCase().includes(query) || 
          profile.title.toLowerCase().includes(query) || 
          profile.company.toLowerCase().includes(query) ||
          profile.skills.some(skill => skill.toLowerCase().includes(query))
        );
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        LinkedIn User Search
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for potential clients' LinkedIn information, including email, position, and work experience
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4, maxWidth: 'md' }}>
        <Grid container>
          <Grid item xs>
            <Controller
              name="query"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter name, position, company, or skills"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setValue('query', '')}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ 
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: '100%',
                px: 3
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Search Results */}
        <Grid item xs={12} lg={4}>
          {isSearching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
              <CircularProgress size={30} sx={{ mr: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Searching...
              </Typography>
            </Box>
          ) : searchResults.length > 0 ? (
            <Box>
              <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                Search Results
              </Typography>
              <Paper variant="outlined">
                <List sx={{ p: 0 }}>
                  {searchResults.map((profile, index) => (
                    <React.Fragment key={profile.id}>
                      {index > 0 && <Divider />}
                      <ListItemButton
                        selected={selectedProfile?.id === profile.id}
                        onClick={() => handleProfileSelect(profile)}
                        sx={{
                          py: 2,
                          ...(selectedProfile?.id === profile.id && {
                            borderLeft: 3,
                            borderColor: 'primary.main',
                            bgcolor: 'primary.lighter'
                          })
                        }}
                      >
                        <ListItemIcon>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.lighter', 
                              color: 'primary.dark' 
                            }}
                          >
                            {getInitials(profile.name)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" color="primary.main">
                              {profile.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.primary">
                                {profile.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {profile.company}
                              </Typography>
                            </>
                          }
                        />
                      </ListItemButton>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          ) : searchResults.length === 0 && !isSearching && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: 'background.default'
              }}
            >
              <SearchIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="medium">No search results</Typography>
              <Typography variant="body2" color="text.secondary">
                Try searching with different keywords.
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Profile Details */}
        {selectedProfile && (
          <Grid item xs={12} lg={8}>
            <Card variant="outlined">
              <CardHeader
                avatar={
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: 'primary.lighter', 
                      color: 'primary.dark',
                      fontSize: '1.5rem'
                    }}
                  >
                    {getInitials(selectedProfile.name)}
                  </Avatar>
                }
                title={
                  <Typography variant="h5" component="h2">
                    {selectedProfile.name}
                  </Typography>
                }
                subheader={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProfile.title} at {selectedProfile.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProfile.location}
                    </Typography>
                  </>
                }
                sx={{ pb: 0 }}
              />
              
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedProfile.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedProfile.company}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedProfile.connections} connections</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedProfile.education[0].school}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Work Experience */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Work Experience
                  </Typography>
                  <Timeline position="right" sx={{ p: 0, m: 0 }}>
                    {selectedProfile.experience.map((exp, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          {index < selectedProfile.experience.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                          <Typography variant="subtitle2" component="span">
                            {exp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company} · {exp.duration}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {exp.description}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>

                {/* Education */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Education
                  </Typography>
                  <Timeline position="right" sx={{ p: 0, m: 0 }}>
                    {selectedProfile.education.map((edu, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color="secondary" />
                          {index < selectedProfile.education.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                          <Typography variant="subtitle2" component="span">
                            {edu.degree}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.school} · {edu.year}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>

                {/* Skills */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedProfile.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                  variant="contained"
                  onClick={() => window.open('/pitch-generator?profileId=' + selectedProfile.id, '_blank')}
                >
                  Generate Sales Email
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 