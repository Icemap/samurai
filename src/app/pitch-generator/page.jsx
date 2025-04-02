'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
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
  const [myCompanyInfo, setMyCompanyInfo] = useState(null);
  const [targetCompanyInfo, setTargetCompanyInfo] = useState(null);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      // Get my company info from localStorage
      const storedMyCompanyInfo = localStorage.getItem('myCompanyInfo');
      if (!storedMyCompanyInfo) {
        setError('Please configure your company information in Settings first.');
        return;
      }
      setMyCompanyInfo(JSON.parse(storedMyCompanyInfo));

      // Get the search type and target data from localStorage
      const storedSearchType = localStorage.getItem('searchType');
      setSearchType(storedSearchType);

      if (storedSearchType === 'company') {
        const storedTargetCompany = localStorage.getItem('selectedTargetCompany');
        if (storedTargetCompany) {
          setTargetCompanyInfo(JSON.parse(storedTargetCompany));
        } else {
          setError('No target company data found. Please select a company first.');
        }
      } else if (storedSearchType === 'linkedin') {
        // Handle LinkedIn profile data (to be implemented)
        const storedProfileData = localStorage.getItem('selectedProfileData');
        if (storedProfileData) {
          setTargetCompanyInfo(JSON.parse(storedProfileData));
        } else {
          setError('No profile data found. Please select a profile first.');
        }
      } else {
        setError('Please select a company or profile from the search pages first.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Generate prompt based on available information
    if (myCompanyInfo && targetCompanyInfo) {
      let newPrompt = `Please write an SDR outreach email as a representative of ${myCompanyInfo.companyName}, `;
      
      if (searchType === 'linkedin') {
        newPrompt += `addressed to ${targetCompanyInfo.name} (${targetCompanyInfo.title}) at ${targetCompanyInfo.company}.`;
      } else if (searchType === 'company') {
        newPrompt += `addressed to ${targetCompanyInfo.name}.`;
      }
      
      newPrompt += `\n\nMy company information:\n`;
      newPrompt += `- Company Name: ${myCompanyInfo.companyName}\n`;
      newPrompt += `- Industry: ${myCompanyInfo.industry}\n`;
      newPrompt += `- Description: ${myCompanyInfo.description}\n`;
      
      if (myCompanyInfo.uniqueSellingPoints) {
        newPrompt += `- Unique Value Propositions: ${myCompanyInfo.uniqueSellingPoints}\n`;
      }
      
      if (searchType === 'company') {
        newPrompt += `\nTarget prospect company information:\n`;
        newPrompt += `- Company Name: ${targetCompanyInfo.name}\n`;
        newPrompt += `- Industry: ${targetCompanyInfo.industry}\n`;
        newPrompt += `- Description: ${targetCompanyInfo.description}\n`;
        newPrompt += `- Revenue: ${targetCompanyInfo.revenue}\n`;
        newPrompt += `- Employees: ${targetCompanyInfo.employees}\n`;
      }
      
      newPrompt += `\nPlease write this outreach email with a ${getToneName(selectedTone)} tone, focusing on building interest and establishing relevance. The email should be concise, personalized, and include a clear call to action for scheduling an initial discovery call.`;
      
      setPrompt(newPrompt);
    }
  }, [myCompanyInfo, targetCompanyInfo, selectedTone, searchType]);

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

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Please go back to the {' '}
          <Button 
            color="primary" 
            onClick={() => window.location.href = '/search'}
          >
            Company Search
          </Button>
          {' '} or {' '}
          <Button 
            color="primary" 
            onClick={() => window.location.href = '/linkedin'}
          >
            LinkedIn Search
          </Button>
          {' '} page to select a target first.
        </Typography>
      </Box>
    );
  }

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
          {/* Display selected company or profile information */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                My Company:
              </Typography>
              <Typography variant="body1">
                {myCompanyInfo?.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {myCompanyInfo?.industry}
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Target {searchType === 'company' ? 'Company' : 'Profile'}:
              </Typography>
              <Typography variant="body1">
                {searchType === 'company' ? targetCompanyInfo?.name : targetCompanyInfo?.name}
                {searchType === 'company' && ` (${targetCompanyInfo?.ticker})`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchType === 'company' ? targetCompanyInfo?.industry : targetCompanyInfo?.title}
              </Typography>
            </Paper>
          </Grid>

          <Grid container spacing={3} marginTop={5}>
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
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    width: '100%'
                  }
                }}
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