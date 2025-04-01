'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

// MUI Components
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Divider,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

// MUI Icons
import {
  Business as BusinessIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Favorite as FavoriteIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: '',
      industry: '',
      size: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      logo: '',
      tagline: '',
      founded: '',
      mission: '',
      values: '',
      uniqueSellingPoints: '',
    }
  });

  // Load saved data (if any)
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      const parsed = JSON.parse(savedCompanyInfo);
      Object.keys(parsed).forEach(key => {
        control._defaultValues[key] = parsed[key];
      });
    }
  }, [control]);

  const onSubmit = async (data) => {
    setLoading(true);
    // In a real application, this would be an API call to save the data
    // Currently, we use a timeout to simulate an API call
    setTimeout(() => {
      // Save to localStorage for persistence
      localStorage.setItem('companyInfo', JSON.stringify(data));
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Company Information Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure your company's basic information, which will be used to generate sales emails and other marketing materials.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Basic Information Card */}
          <Card variant="outlined">
            <CardHeader
              title="Basic Information"
              subheader="Set up your company's basic profile and contact information"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Company Name */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="companyName"
                    control={control}
                    rules={{ required: 'Company name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Name"
                        fullWidth
                        required
                        error={!!errors.companyName}
                        helperText={errors.companyName?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                
                {/* Industry */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="industry"
                    control={control}
                    rules={{ required: 'Industry is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Industry"
                        fullWidth
                        required
                        error={!!errors.industry}
                        helperText={errors.industry?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Company Size */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="size"
                    control={control}
                    rules={{ required: 'Company size is required' }}
                    render={({ field }) => (
                      <Box
                        sx={{ width: '100%' }}
                        >
                        <TextField
                          {...field}
                          select
                          sx={{ width: '100%' }}
                          label="Company Size"
                          required
                          fullWidth
                          error={!!errors.size}
                          helperText={errors.size?.message}
                        >
                          <MenuItem value="">Please select</MenuItem>
                          <MenuItem value="1-10">1-10 employees</MenuItem>
                          <MenuItem value="11-50">11-50 employees</MenuItem>
                          <MenuItem value="51-200">51-200 employees</MenuItem>
                          <MenuItem value="201-500">201-500 employees</MenuItem>
                          <MenuItem value="501-1000">501-1000 employees</MenuItem>
                          <MenuItem value="1000+">1000+ employees</MenuItem>
                        </TextField>
                      </Box>
                    )}
                  />
                </Grid>

                {/* Founded Year */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="founded"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Founded Year"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Company Website */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Website"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LanguageIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Company Email */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Email"
                        type="email"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Contact Phone */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Phone"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Company Address */}
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Address"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Company Description Card */}
          <Card variant="outlined">
            <CardHeader
              title="Company Description"
              subheader="Provide detailed information about your company's business and value proposition"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Company Overview */}
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Company overview is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Overview"
                        multiline
                        rows={3}
                        fullWidth
                        required
                        error={!!errors.description}
                        helperText={errors.description?.message || "Briefly describe your company's business and value proposition."}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Company Tagline */}
                <Grid item xs={12}>
                  <Controller
                    name="tagline"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Tagline"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StarIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Values and Mission Card */}
          <Card variant="outlined">
            <CardHeader
              title="Values and Mission"
              subheader="Help potential customers understand your company's core values and mission"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Company Mission */}
                <Grid item xs={12}>
                  <Controller
                    name="mission"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Mission"
                        multiline
                        rows={3}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <RocketIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Company Values */}
                <Grid item xs={12}>
                  <Controller
                    name="values"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Company Values"
                        multiline
                        rows={3}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FavoriteIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Unique Selling Points */}
                <Grid item xs={12}>
                  <Controller
                    name="uniqueSellingPoints"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Unique Selling Points"
                        multiline
                        rows={3}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AutoAwesomeIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <FormHelperText>Describe your company's unique advantages and competitive differentiators.</FormHelperText>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Form Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Box>
      </form>

      {/* Success Message */}
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          variant="filled"
        >
          Saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 