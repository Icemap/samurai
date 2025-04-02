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
    name: 'Jennifer Zhang',
    title: 'Senior Director of AI/ML',
    company: 'Apple Inc.',
    email: 'j.zhang@apple.com',
    linkedin: 'linkedin.com/in/jenniferzhang',
    location: 'Cupertino, California',
    experience: [
      {
        title: 'Senior Director of AI/ML',
        company: 'Apple Inc.',
        duration: '2020 - Present',
        description: 'Leading AI/ML initiatives across Apple products, focusing on on-device machine learning and privacy-preserving AI technologies.'
      },
      {
        title: 'Director of Machine Learning',
        company: 'Apple Inc.',
        duration: '2017 - 2020',
        description: 'Led the development of machine learning features for iOS and Siri.'
      },
      {
        title: 'Senior Machine Learning Engineer',
        company: 'Google',
        duration: '2014 - 2017',
        description: 'Worked on Google Search ranking algorithms and ML infrastructure.'
      }
    ],
    education: [
      {
        degree: 'Ph.D. in Computer Science',
        school: 'Stanford University',
        year: '2014'
      },
      {
        degree: 'M.S. in Computer Science',
        school: 'UC Berkeley',
        year: '2009'
      }
    ],
    skills: ['Machine Learning', 'Artificial Intelligence', 'iOS Development', 'Privacy-Preserving ML', 'Team Leadership'],
    connections: 4200,
    interests: ['AI Ethics', 'Privacy in Technology', 'Mobile Computing']
  },
  {
    id: 2,
    name: 'David Anderson',
    title: 'Principal Software Engineer',
    company: 'Google',
    email: 'd.anderson@google.com',
    linkedin: 'linkedin.com/in/davidanderson',
    location: 'Mountain View, California',
    experience: [
      {
        title: 'Principal Software Engineer',
        company: 'Google',
        duration: '2019 - Present',
        description: 'Leading development of core Google Cloud Platform services and infrastructure.'
      },
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        duration: '2015 - 2019',
        description: 'Worked on Google Kubernetes Engine and container orchestration systems.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Computer Science',
        school: 'MIT',
        year: '2015'
      }
    ],
    skills: ['Distributed Systems', 'Cloud Architecture', 'Kubernetes', 'Go', 'System Design'],
    connections: 3800,
    interests: ['Cloud Computing', 'Open Source', 'Distributed Systems']
  },
  {
    id: 3,
    name: 'Sarah Martinez',
    title: 'Senior Product Manager, AWS',
    company: 'Amazon',
    email: 's.martinez@amazon.com',
    linkedin: 'linkedin.com/in/sarahmartinez',
    location: 'Seattle, Washington',
    experience: [
      {
        title: 'Senior Product Manager, AWS',
        company: 'Amazon',
        duration: '2021 - Present',
        description: 'Leading product strategy for AWS compute services.'
      },
      {
        title: 'Product Manager',
        company: 'Microsoft',
        duration: '2018 - 2021',
        description: 'Managed Azure cloud services product line.'
      }
    ],
    education: [
      {
        degree: 'MBA',
        school: 'Harvard Business School',
        year: '2018'
      }
    ],
    skills: ['Product Management', 'Cloud Services', 'Strategy', 'Technical Product Management'],
    connections: 3500,
    interests: ['Cloud Computing', 'Product Innovation', 'Digital Transformation']
  },
  {
    id: 4,
    name: 'Michael Kim',
    title: 'Design Director',
    company: 'Apple Inc.',
    email: 'm.kim@apple.com',
    linkedin: 'linkedin.com/in/michaelkim',
    location: 'Cupertino, California',
    experience: [
      {
        title: 'Design Director',
        company: 'Apple Inc.',
        duration: '2018 - Present',
        description: 'Leading design strategy for Apple Services products.'
      },
      {
        title: 'Senior UX Designer',
        company: 'Apple Inc.',
        duration: '2015 - 2018',
        description: 'Designed user experiences for iOS applications.'
      }
    ],
    education: [
      {
        degree: 'Master of Design',
        school: 'Rhode Island School of Design',
        year: '2015'
      }
    ],
    skills: ['UX Design', 'Product Design', 'Design Systems', 'Design Leadership'],
    connections: 2900,
    interests: ['Design Innovation', 'User Experience', 'Digital Product Design']
  },
  {
    id: 5,
    name: 'Rachel Cohen',
    title: 'Research Scientist',
    company: 'Google',
    email: 'r.cohen@google.com',
    linkedin: 'linkedin.com/in/rachelcohen',
    location: 'Mountain View, California',
    experience: [
      {
        title: 'Research Scientist',
        company: 'Google',
        duration: '2020 - Present',
        description: 'Conducting research in natural language processing and large language models.'
      },
      {
        title: 'Research Engineer',
        company: 'OpenAI',
        duration: '2018 - 2020',
        description: 'Worked on transformer architecture improvements and training efficiency.'
      }
    ],
    education: [
      {
        degree: 'Ph.D. in Computer Science',
        school: 'Carnegie Mellon University',
        year: '2018'
      }
    ],
    skills: ['Machine Learning', 'NLP', 'Deep Learning', 'Python', 'Research'],
    connections: 2600,
    interests: ['AI Research', 'Language Models', 'Machine Learning']
  },
  {
    id: 6,
    name: 'James Wilson',
    title: 'Principal Solutions Architect',
    company: 'Amazon',
    email: 'j.wilson@amazon.com',
    linkedin: 'linkedin.com/in/jameswilson',
    location: 'Seattle, Washington',
    experience: [
      {
        title: 'Principal Solutions Architect',
        company: 'Amazon',
        duration: '2019 - Present',
        description: 'Architecting large-scale AWS solutions for enterprise customers.'
      },
      {
        title: 'Senior Solutions Architect',
        company: 'AWS',
        duration: '2016 - 2019',
        description: 'Designed and implemented cloud architecture solutions.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Software Engineering',
        school: 'University of Washington',
        year: '2016'
      }
    ],
    skills: ['Cloud Architecture', 'AWS', 'Solution Design', 'Enterprise Architecture'],
    connections: 4100,
    interests: ['Cloud Computing', 'Enterprise Architecture', 'Digital Transformation']
  },
  {
    id: 7,
    name: 'Emily Patel',
    title: 'Privacy Engineering Manager',
    company: 'Apple Inc.',
    email: 'e.patel@apple.com',
    linkedin: 'linkedin.com/in/emilypatel',
    location: 'Cupertino, California',
    experience: [
      {
        title: 'Privacy Engineering Manager',
        company: 'Apple Inc.',
        duration: '2021 - Present',
        description: 'Leading privacy engineering initiatives across Apple services.'
      },
      {
        title: 'Senior Privacy Engineer',
        company: 'Apple Inc.',
        duration: '2018 - 2021',
        description: 'Developed privacy-preserving features for iOS.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Information Security',
        school: 'Georgia Tech',
        year: '2018'
      }
    ],
    skills: ['Privacy Engineering', 'Information Security', 'iOS Development', 'Cryptography'],
    connections: 2800,
    interests: ['Digital Privacy', 'Security Engineering', 'Mobile Security']
  },
  {
    id: 8,
    name: 'Thomas Lee',
    title: 'Senior Engineering Manager',
    company: 'Google',
    email: 't.lee@google.com',
    linkedin: 'linkedin.com/in/thomaslee',
    location: 'Mountain View, California',
    experience: [
      {
        title: 'Senior Engineering Manager',
        company: 'Google',
        duration: '2020 - Present',
        description: 'Managing Chrome browser development team.'
      },
      {
        title: 'Software Engineering Manager',
        company: 'Google',
        duration: '2017 - 2020',
        description: 'Led Chrome security features development.'
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        school: 'University of Illinois at Urbana-Champaign',
        year: '2012'
      }
    ],
    skills: ['Engineering Management', 'Browser Development', 'Web Security', 'Team Leadership'],
    connections: 3300,
    interests: ['Web Technologies', 'Browser Security', 'Engineering Leadership']
  },
  {
    id: 9,
    name: 'Lisa Brown',
    title: 'Head of Retail Analytics',
    company: 'Amazon',
    email: 'l.brown@amazon.com',
    linkedin: 'linkedin.com/in/lisabrown',
    location: 'Seattle, Washington',
    experience: [
      {
        title: 'Head of Retail Analytics',
        company: 'Amazon',
        duration: '2022 - Present',
        description: 'Leading retail analytics and data science initiatives.'
      },
      {
        title: 'Senior Data Scientist',
        company: 'Amazon',
        duration: '2019 - 2022',
        description: 'Developed predictive models for retail operations.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Data Science',
        school: 'Columbia University',
        year: '2019'
      }
    ],
    skills: ['Data Science', 'Retail Analytics', 'Machine Learning', 'Python', 'R'],
    connections: 3100,
    interests: ['Retail Technology', 'Data Analytics', 'E-commerce Innovation']
  },
  {
    id: 10,
    name: 'Robert Chen',
    title: 'Hardware Engineering Director',
    company: 'Apple Inc.',
    email: 'r.chen@apple.com',
    linkedin: 'linkedin.com/in/robertchen',
    location: 'Cupertino, California',
    experience: [
      {
        title: 'Hardware Engineering Director',
        company: 'Apple Inc.',
        duration: '2019 - Present',
        description: 'Leading hardware development for Apple Watch.'
      },
      {
        title: 'Senior Hardware Engineer',
        company: 'Apple Inc.',
        duration: '2016 - 2019',
        description: 'Developed hardware solutions for iPhone.'
      }
    ],
    education: [
      {
        degree: 'Ph.D. in Electrical Engineering',
        school: 'Caltech',
        year: '2016'
      }
    ],
    skills: ['Hardware Engineering', 'Product Development', 'System Design', 'Team Leadership'],
    connections: 2700,
    interests: ['Wearable Technology', 'Hardware Innovation', 'Consumer Electronics']
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