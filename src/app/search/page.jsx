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
    name: 'Acme Corporation',
    ticker: 'ACME',
    industry: 'Technology',
    revenue: '1.2B',
    employees: '5,000+',
    founded: '1990',
    headquarters: 'New York',
    ceo: 'John Smith',
    description: 'Acme Corporation is a global leader in technology, focused on providing innovative software solutions.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '1.2B',
      netIncome: '250M',
      totalAssets: '2.5B',
      totalLiabilities: '800M',
      cashAndEquivalents: '500M',
      longTermDebt: '600M',
      riskFactors: [
        'Intense market competition',
        'Rapid technological changes',
        'Global economic uncertainty',
        'Cybersecurity risks'
      ],
      keyMetrics: {
        eps: '2.5',
        dividendYield: '1.8%',
        peRatio: '22.5',
        roic: '15.2%',
        currentRatio: '2.1'
      }
    }
  },
  {
    id: 2,
    name: 'Globex Corporation',
    ticker: 'GLX',
    industry: 'Manufacturing',
    revenue: '890M',
    employees: '3,200',
    founded: '1985',
    headquarters: 'Chicago',
    ceo: 'Lisa Johnson',
    description: 'Globex Corporation is an innovative manufacturing enterprise focused on designing and producing high-precision industrial components.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '890M',
      netIncome: '120M',
      totalAssets: '1.8B',
      totalLiabilities: '650M',
      cashAndEquivalents: '320M',
      longTermDebt: '450M',
      riskFactors: [
        'Raw material price fluctuations',
        'Supply chain disruption risks',
        'Rising labor costs',
        'Increased environmental compliance costs'
      ],
      keyMetrics: {
        eps: '1.8',
        dividendYield: '2.3%',
        peRatio: '18.4',
        roic: '12.7%',
        currentRatio: '1.9'
      }
    }
  },
  {
    id: 3,
    name: 'Soylent Corp',
    ticker: 'SOYC',
    industry: 'Consumer Goods',
    revenue: '750M',
    employees: '2,800',
    founded: '1995',
    headquarters: 'Los Angeles',
    ceo: 'Robert Chen',
    description: 'Soylent Corp is a company focused on innovative food solutions, committed to developing sustainable food alternatives.',
    k10Data: {
      fiscalYear: '2023',
      totalRevenue: '750M',
      netIncome: '95M',
      totalAssets: '1.2B',
      totalLiabilities: '480M',
      cashAndEquivalents: '280M',
      longTermDebt: '320M',
      riskFactors: [
        'Changes in consumer preferences',
        'Food safety risks',
        'Raw material price fluctuations',
        'Regulatory environment changes'
      ],
      keyMetrics: {
        eps: '1.4',
        dividendYield: '1.6%',
        peRatio: '20.1',
        roic: '11.5%',
        currentRatio: '2.3'
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
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Company Information Search
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for detailed company information and financial data, including K-10 report information
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
                  placeholder="Enter company name, ticker, or industry"
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
          <Grid item xs={12} lg={8}>
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
                  Generate Sales Email
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 