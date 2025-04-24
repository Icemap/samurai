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
import { reportUserAction } from '../../services/analytics';
import ProtectedRoute from '../../components/ProtectedRoute';

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
      let newPrompt = '';
      
      if (searchType === 'linkedin') {
        // 创建一个更加详细的LinkedIn数据提示
        newPrompt = `Please write a personalized SDR outreach email targeting ${targetCompanyInfo.name}, who is a ${targetCompanyInfo.title} at ${targetCompanyInfo.company}.`;
        
        // 添加公司信息
        newPrompt += `\n\nAbout their company (${targetCompanyInfo.company}):`;
        if (targetCompanyInfo.location) {
          newPrompt += `\n- Location: ${targetCompanyInfo.location}`;
        }
        if (targetCompanyInfo.experience && targetCompanyInfo.experience.length > 0) {
          const currentCompany = targetCompanyInfo.experience[0].company;
          const companyDescription = `${currentCompany} is likely facing database challenges related to ${targetCompanyInfo.title.includes('Engineer') || targetCompanyInfo.title.includes('Architect') || targetCompanyInfo.title.includes('Developer') ? 'technical scalability, system performance, and data consistency' : 'data management, cost efficiency, and business continuity'}`;
          newPrompt += `\n- Company context: ${companyDescription}`;
        }
        
        // 添加职业技能
        if (targetCompanyInfo.skills && targetCompanyInfo.skills.length > 0) {
          newPrompt += `\n\nTheir professional skills include: ${targetCompanyInfo.skills.slice(0, 8).join(', ')}.`;
        }
        
        // 添加工作经验
        if (targetCompanyInfo.experience && targetCompanyInfo.experience.length > 0) {
          newPrompt += `\n\nTheir work experience includes:`;
          targetCompanyInfo.experience.slice(0, 3).forEach(exp => {
            newPrompt += `\n- ${exp.title} at ${exp.company} (${exp.duration})`;
          });
        }
        
        // 添加教育背景
        if (targetCompanyInfo.education && targetCompanyInfo.education.length > 0) {
          newPrompt += `\n\nEducation background:`;
          targetCompanyInfo.education.slice(0, 2).forEach(edu => {
            newPrompt += `\n- ${edu.degree} from ${edu.school}`;
          });
        }
        
        // 添加兴趣领域（如果有）
        if (targetCompanyInfo.interests && targetCompanyInfo.interests.length > 0) {
          newPrompt += `\n\nTheir professional interests include: ${targetCompanyInfo.interests.join(', ')}.`;
        }
        
        newPrompt += `\n\nBased on their background, try to tie in relevant K-10 risk factors and challenges from their industry that TiDB can impact. Use their technical background to make the pitch more relevant. Keep the email short and concise.`;
        
        // 添加针对不同角色的TiDB价值主张
        newPrompt += `\n\nTiDB value propositions based on their role:`;
        if (targetCompanyInfo.title.includes('Architect') || targetCompanyInfo.title.includes('Chief') || targetCompanyInfo.title.includes('CTO')) {
          newPrompt += `\n- For architects and technical decision makers: TiDB offers a horizontally scalable architecture that eliminates sharding complexity, distributed ACID transactions, and real-time analytics capabilities.`;
        }
        if (targetCompanyInfo.title.includes('Engineer') || targetCompanyInfo.title.includes('Developer')) {
          newPrompt += `\n- For engineers and developers: TiDB provides SQL compatibility (MySQL protocol), easy scaling without application changes, and simplified operations with no need for manual sharding.`;
        }
        if (targetCompanyInfo.title.includes('Manager') || targetCompanyInfo.title.includes('Director')) {
          newPrompt += `\n- For managers and directors: TiDB reduces operational complexity, offers cloud-native deployment flexibility, and lowers TCO compared to traditional database solutions.`;
        }
        if (targetCompanyInfo.title.includes('Data') || targetCompanyInfo.title.includes('Analytics')) {
          newPrompt += `\n- For data specialists: TiDB enables real-time analytics on operational data, HTAP (Hybrid Transactional/Analytical Processing) capabilities, and seamless integration with big data ecosystems.`;
        }
      } else if (searchType === 'company') {
        newPrompt = `Please write a personalized SDR outreach email targeting a decision maker at ${targetCompanyInfo.name}. Try to tie in relevant K-10 risk factors and challenges from the ${targetCompanyInfo.industry} industry that TiDB can impact. Keep the email short and concise.`;
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
      
      newPrompt += `\nWrite the email with a ${getToneName(selectedTone)} tone. The email should:
1. Be personalized based on the recipient's specific role, experience and skills
2. Highlight 1-2 specific industry challenges they likely face based on their background
3. Briefly explain how TiDB addresses these challenges with technical specificity relevant to their expertise
4. Include a clear, low-pressure call to action
5. Keep the entire email under 150 words`;
      
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
      // Report email generation action
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key) acc[key] = value;
        return acc;
      }, {});
      
      const userData = {
        email: cookies.user_email || '',
        name: cookies.user_name || ''
      };
      
      await reportUserAction('pitch_generate', userData);
      
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional SDR (Sales Development Representative) specializing in TiDB, a distributed SQL database solution that helps companies manage large-scale data with high availability and strong consistency. Your emails are highly personalized based on the recipient\'s professional background, technical skills, and industry challenges. When writing to technical roles, mention specific database technical challenges they face based on their experience. For management roles, focus on business value and ROI. Always tie your message to the recipient\'s specific background and interests. Your emails are conversational, technically precise when appropriate, and always under 300 words.'
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
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
} 