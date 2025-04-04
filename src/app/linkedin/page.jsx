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

// Import LinkedIn data
import data1 from './data1.json';
import data2 from './data2.json';
import data3 from './data3.json';
import data4 from './data4.json';
import data5 from './data5.json';
import data6 from './data6.json';
import data7 from './data7.json';

// Function to transform LinkedIn data to the required format
const transformLinkedInData = (data) => {
  // Extract skills names into array
  const skillsArray = data.skills ? data.skills.map(skill => skill.name) : [];
  
  // Format experience
  const experienceArray = (data.position || []).map(job => {
    const startYear = job.start?.year || '';
    const endYear = job.end?.year || 'Present';
    const duration = `${startYear} - ${endYear}`;
    
    return {
      title: job.title || '',
      company: job.companyName || '',
      duration: duration,
      description: job.description || ''
    };
  });
  
  // Format education
  const educationArray = (data.educations || []).map(edu => {
    return {
      degree: edu.degree || '',
      school: edu.schoolName || '',
      year: edu.end?.year || ''
    };
  });
  
  // Get location
  const location = data.geo?.full || '';
  
  // Create email based on name (just for demo purposes since real data doesn't have email)
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  const company = (data.position && data.position.length > 0) ? data.position[0].companyName : '';
  const email = company 
    ? `${firstName.toLowerCase().charAt(0)}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`
    : '';
    
  // Construct the transformed profile
  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: `${firstName} ${lastName}`,
    title: data.headline || '',
    company: company,
    email: email,
    linkedin: `linkedin.com/in/${data.username || ''}`,
    location: location,
    experience: experienceArray,
    education: educationArray,
    skills: skillsArray,
    connections: Math.floor(Math.random() * 5000) + 500, // Random number for connections
    interests: skillsArray.slice(0, 3), // Just use the first 3 skills as interests for demo
    profilePicture: data.profilePicture || ''
  };
};

// Combine all LinkedIn profiles
const mockProfiles = [
  transformLinkedInData(data1),
  transformLinkedInData(data2),
  transformLinkedInData(data3),
  transformLinkedInData(data4),
  transformLinkedInData(data5),
  transformLinkedInData(data6),
  transformLinkedInData(data7)
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
          profile.name?.toLowerCase().includes(query) || 
          profile.title?.toLowerCase().includes(query) || 
          profile.company?.toLowerCase().includes(query) ||
          (Array.isArray(profile.skills) && profile.skills.some(skill => skill.toLowerCase().includes(query)))
        );
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  const handleProfileSelect = (profile) => {
    // Store the profile data in localStorage
    localStorage.setItem('selectedProfileData', JSON.stringify(profile));
    localStorage.setItem('searchType', 'linkedin');
    setSelectedProfile(profile);
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Box sx={{ py: 3, width: '100%', maxWidth: '100%' }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        LinkedIn User Search
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for potential prospects' LinkedIn information, including email, position, and work experience
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4, width: '100%', maxWidth: '100%' }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Grid container spacing={1}>
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
                        },
                        minWidth: '500px'
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
                    px: 4
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4} sx={{ width: '100%' }} justifyContent="center">
        {/* Search Results */}
        <Grid item xs={12} md={10} lg={5}>
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
                            src={profile.profilePicture}
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
                              <Typography variant="body2" color="text.primary" component="span">
                                {profile.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
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
          <Grid item xs={12} md={10} lg={7}>
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
                    src={selectedProfile.profilePicture}
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
                      <Typography variant="body2">
                        {selectedProfile.connections ? `${selectedProfile.connections} connections` : 'Connections unknown'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {selectedProfile.education && selectedProfile.education.length > 0 
                          ? selectedProfile.education[0].school 
                          : 'No education listed'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Work Experience */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Work Experience
                  </Typography>
                  {selectedProfile.experience && selectedProfile.experience.length > 0 ? (
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
                              {exp.company} {exp.duration ? `· ${exp.duration}` : ''}
                            </Typography>
                            {exp.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {exp.description}
                              </Typography>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No work experience information available
                    </Typography>
                  )}
                </Box>

                {/* Education */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Education
                  </Typography>
                  {selectedProfile.education && selectedProfile.education.length > 0 ? (
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
                              {edu.school} {edu.year ? `· ${edu.year}` : ''}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No education information available
                    </Typography>
                  )}
                </Box>

                {/* Skills */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  {selectedProfile.skills && selectedProfile.skills.length > 0 ? (
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
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills information available
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (selectedProfile) {
                      localStorage.setItem('searchType', 'linkedin');
                      window.open('/pitch-generator?profileId=' + selectedProfile.id, '_blank');
                    }
                  }}
                >
                  Generate SDR Email
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 