'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
  Snackbar
} from '@mui/material';

// MUI Icons
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// 封装使用useSearchParams的组件
function PitchGeneratorContent() {
  const searchParams = useSearchParams();
  const companyId = searchParams?.get('companyId');
  const profileId = searchParams?.get('profileId');

  const [companyInfo, setCompanyInfo] = useState(null);
  const [targetCompany, setTargetCompany] = useState(null);
  const [targetPerson, setTargetPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [toneOptions] = useState([
    { id: 'professional', name: 'Professional' },
    { id: 'friendly', name: 'Friendly' },
    { id: 'persuasive', name: 'Persuasive' },
    { id: 'concise', name: 'Concise' },
  ]);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Load company info from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCompanyInfo = localStorage.getItem('companyInfo');
      if (savedCompanyInfo) {
        try {
          setCompanyInfo(JSON.parse(savedCompanyInfo));
        } catch (e) {
          console.error('Error parsing company info:', e);
        }
      }
    }

    // For demo purposes, load mock data
    if (companyId) {
      // Simulate loading target company
      const mockCompanies = [
        {
          id: 1,
          name: 'Acme Corporation',
          industry: 'Technology',
          description: 'Acme Corporation is a global leader in technology, focused on providing innovative software solutions.'
        },
        {
          id: 2,
          name: 'Globex Corporation',
          industry: 'Manufacturing',
          description: 'Globex Corporation is an innovative manufacturing enterprise focused on designing and producing high-precision industrial components.'
        },
        {
          id: 3,
          name: 'Soylent Corp',
          industry: 'Consumer Goods',
          description: 'Soylent Corp is a company focused on innovative food solutions, committed to developing sustainable food alternatives.'
        }
      ];
      
      const company = mockCompanies.find(c => c.id === parseInt(companyId));
      if (company) {
        setTargetCompany(company);
      }
    }

    if (profileId) {
      // Simulate loading target person
      const mockProfiles = [
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'Chief Technology Officer',
          company: 'Acme Corporation'
        },
        {
          id: 2,
          name: 'Michael Chen',
          title: 'Director of Sales',
          company: 'Globex Corporation'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          title: 'VP of Product',
          company: 'Soylent Corp'
        }
      ];
      
      const profile = mockProfiles.find(p => p.id === parseInt(profileId));
      if (profile) {
        setTargetPerson(profile);
      }
    }
  }, [companyId, profileId]);

  useEffect(() => {
    // Generate prompt based on available information
    if (companyInfo && (targetCompany || targetPerson)) {
      let newPrompt = `Please write an SDR outreach email as a representative of ${companyInfo.companyName}, `;
      
      if (targetPerson) {
        newPrompt += `addressed to ${targetPerson.name} (${targetPerson.title}) at ${targetPerson.company}.`;
      } else if (targetCompany) {
        newPrompt += `addressed to ${targetCompany.name}.`;
      }
      
      newPrompt += `\n\nMy company information:\n`;
      newPrompt += `- Company Name: ${companyInfo.companyName}\n`;
      newPrompt += `- Industry: ${companyInfo.industry}\n`;
      newPrompt += `- Description: ${companyInfo.description}\n`;
      
      if (companyInfo.uniqueSellingPoints) {
        newPrompt += `- Unique Value Propositions: ${companyInfo.uniqueSellingPoints}\n`;
      }
      
      if (targetCompany) {
        newPrompt += `\nTarget prospect company information:\n`;
        newPrompt += `- Company Name: ${targetCompany.name}\n`;
        newPrompt += `- Industry: ${targetCompany.industry}\n`;
        newPrompt += `- Description: ${targetCompany.description}\n`;
      }
      
      newPrompt += `\nPlease write this outreach email with a ${getToneName(selectedTone)} tone, focusing on building interest and establishing relevance. The email should be concise, personalized, and include a clear call to action for scheduling an initial discovery call.`;
      
      setPrompt(newPrompt);
    }
  }, [companyInfo, targetCompany, targetPerson, selectedTone]);

  const getToneName = (toneId) => {
    const tone = toneOptions.find(t => t.id === toneId);
    return tone ? tone.name : 'Professional';
  };

  const generatePitch = async () => {
    if (!apiKey) {
      setError('Please enter an OpenAI API Key');
      return;
    }

    if (!prompt) {
      setError('Missing necessary information to generate sales email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional SDR (Sales Development Representative) outreach email copywriting expert.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      setGeneratedPitch(response.data.choices[0].message.content);
    } catch (err) {
      console.error('Error calling OpenAI API:', err);
      setError('Error during generation: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedPitch).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      });
    }
  };

  const clearPitch = () => {
    setGeneratedPitch('');
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          SDR Email Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate personalized SDR outreach emails using AI based on your company information and target prospect data
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardHeader 
          title="Email Configuration"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        />
        <CardContent>
          {(!companyInfo || (!targetCompany && !targetPerson)) && (
            <Alert 
              severity="warning" 
              variant="outlined" 
              icon={<WarningIcon />}
              sx={{ mb: 3 }}
            >
              <AlertTitle>Note</AlertTitle>
              <Box component="ul" sx={{ pl: 2 }}>
                {!companyInfo && (
                  <Box component="li">
                    Please configure your company information in the
                    <Link href="/settings" sx={{ mx: 0.5 }}>
                      Settings page
                    </Link>
                    first
                  </Box>
                )}
                {!targetCompany && !targetPerson && (
                  <Box component="li">
                    Select a target prospect from
                    <Link href="/search" sx={{ mx: 0.5 }}>
                      Company Search
                    </Link>
                    or
                    <Link href="/linkedin" sx={{ mx: 0.5 }}>
                      LinkedIn Search
                    </Link>
                  </Box>
                )}
              </Box>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="OpenAI API Key"
                fullWidth
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk-..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle api key visibility"
                        onClick={toggleShowApiKey}
                        edge="end"
                      >
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Your API Key will not be saved and is only used for the current session to generate email content
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tone-select-label">Email Tone</InputLabel>
                <Select
                  labelId="tone-select-label"
                  id="tone-select"
                  value={selectedTone}
                  label="Email Tone"
                  onChange={(e) => setSelectedTone(e.target.value)}
                >
                  {toneOptions.map((tone) => (
                    <MenuItem key={tone.id} value={tone.id}>
                      {tone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Prompt"
                multiline
                rows={8}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter generation prompt..."
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                You can edit the prompt as needed to add additional information
              </Typography>
            </Grid>
          </Grid>

          {error && (
            <Alert 
              severity="error" 
              variant="outlined"
              icon={<ErrorOutlineIcon />}
              sx={{ mt: 3 }}
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={generatePitch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Generating...' : 'Generate SDR Email'}
            </Button>
          </Box>
        </CardContent>

        {generatedPitch && (
          <>
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Generated SDR Email</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyToClipboard}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={clearPitch}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {generatedPitch}
              </Paper>
            </CardContent>
          </>
        )}
      </Card>
      
      {/* Success message for copy operation */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          icon={<CheckIcon />}
          severity="success"
          variant="filled"
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
}

// 主页面组件，使用Suspense包装使用useSearchParams的内容组件
export default function PitchGeneratorPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    }>
      <PitchGeneratorContent />
    </Suspense>
  );
} 