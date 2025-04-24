'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import React from 'react';
import axios from 'axios';

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

// Function to transform LinkedIn data from Proxycurl API to the required format
const transformProxycurlData = (data) => {
  // Extract skills
  const skillsArray = data.certifications ? data.certifications.map(cert => cert.name) : [];
  
  // Format experience
  const experienceArray = (data.experiences || []).map(job => {
    const startYear = job.starts_at?.year || '';
    const endYear = job.ends_at?.year || 'Present';
    const duration = `${startYear} - ${endYear}`;
    
    return {
      title: job.title || '',
      company: job.company || '',
      duration: duration,
      description: job.description || ''
    };
  });
  
  // Format education
  const educationArray = (data.education || []).map(edu => {
    return {
      degree: edu.degree_name || '',
      school: edu.school || '',
      year: edu.ends_at?.year || ''
    };
  });
  
  // Generate email (for demo purposes)
  const email = data.public_identifier ? 
    `${data.first_name.toLowerCase()}.${data.last_name.toLowerCase()}@${data.experiences && data.experiences.length > 0 ? data.experiences[0].company.toLowerCase().replace(/\s+/g, '') : 'company'}.com` : '';
  
  // Construct the transformed profile
  return {
    id: data.public_identifier || Math.random().toString(36).substr(2, 9),
    name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`,
    title: data.headline || '',
    company: data.experiences && data.experiences.length > 0 ? data.experiences[0].company : '',
    email: email,
    linkedin: `linkedin.com/in/${data.public_identifier || ''}`,
    location: `${data.city || ''}, ${data.state || ''}, ${data.country_full_name || ''}`.replace(/, ,/g, ',').replace(/^, /, '').replace(/, $/, ''),
    experience: experienceArray,
    education: educationArray,
    skills: skillsArray,
    connections: data.connections || 0,
    interests: skillsArray.slice(0, 3),
    profilePicture: data.profile_pic_url || ''
  };
};

// Function to transform LinkedIn data from the local JSON files
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

export default function LinkedInSearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [apiError, setApiError] = useState(null);
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      query: ''
    }
  });

  const searchQuery = watch('query');

  const onSubmit = async (data) => {
    setIsSearching(true);
    setSelectedProfile(null);
    setApiError(null);
    
    try {
      // Format LinkedIn URL or extract username
      let linkedinProfileUrl = data.query;
      if (!linkedinProfileUrl.startsWith('http')) {
        if (linkedinProfileUrl.startsWith('linkedin.com')) {
          linkedinProfileUrl = 'https://' + linkedinProfileUrl;
        } else if (!linkedinProfileUrl.includes('linkedin.com')) {
          // Assume it's just a username
          linkedinProfileUrl = 'https://linkedin.com/in/' + linkedinProfileUrl.replace(/^@/, '');
        }
      }
      
      // Use our internal API route instead of calling Proxycurl directly
      // This solves CORS issues by proxying the request through our server
      const response = await axios.get('/api/linkedin/profile', {
        params: {
          linkedin_profile_url: linkedinProfileUrl,
        }
      });
      
      if (response.data) {
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        const transformedProfile = transformProxycurlData(response.data);
        setSearchResults([transformedProfile]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      setApiError(error.response?.data?.error || error.message || "Failed to fetch LinkedIn profile. Please check the URL and try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
        Search for potential prospects by entering their LinkedIn URL or username (e.g., linkedin.com/in/username or just username)
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
                      placeholder="Enter LinkedIn URL or username (e.g., linkedin.com/in/cheesewong or cheesewong)"
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

      {apiError && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mb: 3,
            bgcolor: 'error.lighter',
            color: 'error.main',
            borderColor: 'error.main'
          }}
        >
          <Typography variant="body1">{apiError}</Typography>
        </Paper>
      )}

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
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Please enter a valid LinkedIn profile URL or username.
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Examples:
              </Typography>
              <Box sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
                <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                  • https://linkedin.com/in/cheesewong
                </Typography>
                <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                  • linkedin.com/in/cheesewong
                </Typography>
                <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace' }}>
                  • cheesewong
                </Typography>
              </Box>
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