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
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Collapse,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

// MUI Icons
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

// Mock data for demonstration
const mockCompanies = [
  {
    id: 1,
    name: 'Apple Inc.',
    ticker: 'AAPL',
    industry: 'Technology',
    revenue: '383.3B',
    employees: '164,000',
    founded: '1976',
    headquarters: 'Cupertino, California',
    ceo: 'Tim Cook',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home and Accessories.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '383.3B',
      netIncome: '96.99B',
      totalAssets: '352.83B',
      totalLiabilities: '278.19B',
      cashAndEquivalents: '29.97B',
      longTermDebt: '95.98B',
      riskFactors: [
        'Global economic conditions',
        'Supply chain disruptions',
        'Intense competition in markets',
        'Rapid technological changes',
        'Regulatory challenges worldwide'
      ],
      keyMetrics: {
        eps: '6.13',
        dividendYield: '0.50%',
        peRatio: '31.82',
        roic: '56.7%',
        currentRatio: '0.99'
      }
    }
  },
  {
    id: 2,
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    industry: 'Technology',
    revenue: '307.4B',
    employees: '182,502',
    founded: '1998',
    headquarters: 'Mountain View, California',
    ceo: 'Sundar Pichai',
    description: 'Alphabet Inc. is the parent company of Google and several former Google subsidiaries. It provides online advertising services, search engine technology, cloud computing, software, and hardware.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '307.4B',
      netIncome: '73.8B',
      totalAssets: '411.6B',
      totalLiabilities: '107.4B',
      cashAndEquivalents: '110.9B',
      longTermDebt: '13.2B',
      riskFactors: [
        'Changes in digital advertising market',
        'Intense competition in AI and cloud',
        'Privacy and data protection regulations',
        'Antitrust investigations',
        'Cybersecurity threats'
      ],
      keyMetrics: {
        eps: '5.80',
        dividendYield: '0%',
        peRatio: '26.72',
        roic: '28.9%',
        currentRatio: '2.40'
      }
    }
  },
  {
    id: 3,
    name: 'Amazon.com Inc.',
    ticker: 'AMZN',
    industry: 'Technology & Retail',
    revenue: '574.8B',
    employees: '1,541,000',
    founded: '1994',
    headquarters: 'Seattle, Washington',
    ceo: 'Andy Jassy',
    description: 'Amazon.com Inc. is a technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence. It is one of the world\'s most valuable brands.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '574.8B',
      netIncome: '30.4B',
      totalAssets: '462.7B',
      totalLiabilities: '271.6B',
      cashAndEquivalents: '73.9B',
      longTermDebt: '58.1B',
      riskFactors: [
        'Intense retail competition',
        'AWS market competition',
        'Supply chain disruptions',
        'Regulatory challenges',
        'Labor relations and costs'
      ],
      keyMetrics: {
        eps: '2.90',
        dividendYield: '0%',
        peRatio: '59.86',
        roic: '11.5%',
        currentRatio: '1.05'
      }
    }
  }
];

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      query: ''
    }
  });

  const searchQuery = watch('query');

  const onSubmit = (data) => {
    setIsSearching(true);
    setSelectedCompany(null);
    
    // Simulate API call
    setTimeout(() => {
      // Filter companies based on search criteria
      const filteredResults = mockCompanies.filter(company => {
        const query = data.query.toLowerCase();
        return (
          company.name.toLowerCase().includes(query) || 
          company.ticker.toLowerCase().includes(query) || 
          company.industry.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query)
        );
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    // Reset expanded sections when selecting a new company
    setExpandedSections({});
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Box sx={{ py: 3, width: '100%', maxWidth: '100%' }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Company Information Search
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for detailed company information and financial data, including K-10 report information
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
                      placeholder="Enter company name, ticker, or industry"
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
                  {searchResults.map((company, index) => (
                    <React.Fragment key={company.id}>
                      {index > 0 && <Divider />}
                      <ListItemButton
                        selected={selectedCompany?.id === company.id}
                        onClick={() => handleCompanySelect(company)}
                        sx={{
                          py: 2,
                          ...(selectedCompany?.id === company.id && {
                            borderLeft: 3,
                            borderColor: 'primary.main',
                            bgcolor: 'primary.lighter'
                          })
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="primary.main">
                                {company.name}
                              </Typography>
                              <Chip
                                label={company.ticker}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {company.industry}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Revenue: {company.revenue}
                              </Typography>
                            </Box>
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

        {/* Company Details */}
        {selectedCompany && (
          <Grid item xs={12} md={10} lg={7}>
            <Paper variant="outlined">
              {/* Header Information */}
              <Box sx={{ p: 3, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight="medium">
                  {selectedCompany.name} ({selectedCompany.ticker})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedCompany.industry}
                </Typography>
              </Box>
              
              {/* Basic Information */}
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Company Name
                    </Typography>
                    <Typography variant="body1">{selectedCompany.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ticker
                    </Typography>
                    <Typography variant="body1">{selectedCompany.ticker}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Industry
                    </Typography>
                    <Typography variant="body1">{selectedCompany.industry}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Revenue
                    </Typography>
                    <Typography variant="body1">{selectedCompany.revenue}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Employees
                    </Typography>
                    <Typography variant="body1">{selectedCompany.employees}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Founded
                    </Typography>
                    <Typography variant="body1">{selectedCompany.founded}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Headquarters
                    </Typography>
                    <Typography variant="body1">{selectedCompany.headquarters}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      CEO
                    </Typography>
                    <Typography variant="body1">{selectedCompany.ceo}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Company Description
                    </Typography>
                    <Typography variant="body1">{selectedCompany.description}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* K-10 Financial Data */}
              <Accordion
                expanded={expandedSections['k10']}
                onChange={() => toggleSection('k10')}
                disableGutters
                elevation={0}
                sx={{ 
                  '&:before': { display: 'none' },
                  borderTop: 0,
                  borderLeft: 0,
                  borderRight: 0
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    px: 3, 
                    bgcolor: 'background.default',
                    '&.Mui-expanded': {
                      borderBottom: 1,
                      borderColor: 'divider'
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight="medium">
                    K-10 Financial Data ({selectedCompany.k10Data.fiscalYear})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.totalRevenue}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Net Income
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.netIncome}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Assets
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.totalAssets}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Liabilities
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.totalLiabilities}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Cash and Equivalents
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.cashAndEquivalents}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Long-term Debt
                      </Typography>
                      <Typography variant="body1">{selectedCompany.k10Data.longTermDebt}</Typography>
                    </Grid>

                    {/* Key Metrics */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Key Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="caption" color="text.secondary">
                              Earnings Per Share (EPS)
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {selectedCompany.k10Data.keyMetrics.eps}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="caption" color="text.secondary">
                              Dividend Yield
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {selectedCompany.k10Data.keyMetrics.dividendYield}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="caption" color="text.secondary">
                              Price/Earnings Ratio (P/E)
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {selectedCompany.k10Data.keyMetrics.peRatio}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="caption" color="text.secondary">
                              Return on Invested Capital (ROIC)
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {selectedCompany.k10Data.keyMetrics.roic}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="caption" color="text.secondary">
                              Current Ratio
                            </Typography>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {selectedCompany.k10Data.keyMetrics.currentRatio}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Risk Factors */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Risk Factors
                      </Typography>
                      <List sx={{ listStyleType: 'disc', pl: 2 }}>
                        {selectedCompany.k10Data.riskFactors.map((risk, index) => (
                          <ListItem
                            key={index}
                            sx={{ 
                              display: 'list-item',
                              py: 0.5,
                              pl: 0
                            }}
                          >
                            <Typography variant="body2">{risk}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Action Buttons */}
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider' }}>
                <Button
                  variant="contained"
                  onClick={() => window.open('/pitch-generator?companyId=' + selectedCompany.id, '_blank')}
                >
                  Generate SDR Email
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 