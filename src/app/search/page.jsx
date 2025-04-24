'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import React from 'react';
import { 
  searchCompanies, 
  getCompanyOverview, 
  getCompanyIncome, 
  getCompanyBalance,
  formatFinancialNumber 
} from '@/services/companyService';
import { reportUserAction } from '../../services/analytics';
import ProtectedRoute from '../../components/ProtectedRoute';

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
  AccordionDetails,
  Alert
} from '@mui/material';

// MUI Icons
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedSection, setExpandedSection] = useState('k10');
  const [error, setError] = useState(null);
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      query: ''
    }
  });

  const searchQuery = watch('query');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const onSubmit = async (data) => {
    setIsSearching(true);
    setSelectedCompany(null);
    setError(null);

    try {
      // Report company search action
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key) acc[key] = value;
        return acc;
      }, {});
      
      const userData = {
        email: cookies.user_email || '',
        name: cookies.user_name || ''
      };
      
      await reportUserAction('company_search', userData);
      
      const results = await searchCompanies(data.query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search companies. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCompanySelect = async (company) => {
    setIsSearching(true);
    setError(null);
    setExpandedSection('k10');
    setSearchResults([]);

    try {
      const [overview, income, balance] = await Promise.all([
        getCompanyOverview(company['1. symbol']),
        getCompanyIncome(company['1. symbol']),
        getCompanyBalance(company['1. symbol'])
      ]);

      if (!overview) {
        throw new Error('Could not fetch company details');
      }

      const latestIncome = income?.annualReports?.[0] || {};
      const latestBalance = balance?.annualReports?.[0] || {};

      const targetCompanyInfo = {
        id: company['1. symbol'],
        name: company['2. name'],
        ticker: company['1. symbol'],
        industry: overview.Industry || 'N/A',
        revenue: formatFinancialNumber(overview.RevenueTTM) || 'N/A',
        employees: overview.FullTimeEmployees || 'N/A',
        founded: 'N/A',
        headquarters: overview.Address || 'N/A',
        ceo: overview.CEO || 'N/A',
        description: overview.Description || 'No description available.',
        k10Data: {
          fiscalYear: overview.FiscalYearEnd || 'N/A',
          totalRevenue: formatFinancialNumber(overview.RevenueTTM) || 'N/A',
          netIncome: formatFinancialNumber(latestIncome.netIncome) || 'N/A',
          totalAssets: formatFinancialNumber(latestBalance.totalAssets) || 'N/A',
          totalLiabilities: formatFinancialNumber(latestBalance.totalLiabilities) || 'N/A',
          cashAndEquivalents: formatFinancialNumber(latestBalance.cashAndCashEquivalentsAtCarryingValue) || 'N/A',
          longTermDebt: formatFinancialNumber(latestBalance.longTermDebt) || 'N/A',
          riskFactors: [
            'Market competition',
            'Economic conditions',
            'Regulatory changes',
            'Technology risks',
            'Operational challenges'
          ],
          keyMetrics: {
            eps: formatFinancialNumber(overview.EPS) || 'N/A',
            dividendYield: overview.DividendYield ? (parseFloat(overview.DividendYield) * 100).toFixed(2) + '%' : 'N/A',
            peRatio: formatFinancialNumber(overview.PERatio) || 'N/A',
            roic: formatFinancialNumber(overview.ReturnOnInvestedCapital) || 'N/A',
            currentRatio: formatFinancialNumber(overview.CurrentRatio) || 'N/A'
          }
        }
      };

      // Store the target company data in localStorage
      localStorage.setItem('selectedTargetCompany', JSON.stringify(targetCompanyInfo));
      setSelectedCompany(targetCompanyInfo);
    } catch (err) {
      setError('Failed to fetch company details. Please try again later.');
      console.error('Company details error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ProtectedRoute>
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
            {!selectedCompany && (
              <>
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
                        {searchResults.map((company) => (
                          <React.Fragment key={company['1. symbol']}>
                            <ListItemButton
                              selected={selectedCompany?.id === company['1. symbol']}
                              onClick={() => handleCompanySelect(company)}
                              sx={{
                                py: 2,
                                ...(selectedCompany?.id === company['1. symbol'] && {
                                  borderLeft: 3,
                                  borderColor: 'primary.main',
                                  bgcolor: 'primary.lighter'
                                })
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle2" color="primary.main" component="div">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span>{company['2. name']}</span>
                                      <Chip
                                        label={company['1. symbol']}
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                      />
                                    </Box>
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary" component="div">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                      <span>{company['3. type']}</span>
                                      <span>{company['4. region']}</span>
                                    </Box>
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                            <Divider />
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
              </>
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
                  expanded={expandedSection === 'k10'}
                  onChange={handleAccordionChange('k10')}
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
                    onClick={() => {
                      if (selectedCompany) {
                        localStorage.setItem('searchType', 'company');
                        window.open('/pitch-generator?companyId=' + selectedCompany.id, '_blank');
                      }
                    }}
                  >
                    Generate SDR Email
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </ProtectedRoute>
  );
} 