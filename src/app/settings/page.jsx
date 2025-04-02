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
      companyName: 'PingCAP',
      industry: 'Database',
      size: '501-1000',
      description: '# What is TiDB Self-Managed\n\nTiDB is an open-source distributed SQL database that supports Hybrid Transactional and Analytical Processing (HTAP) workloads. It is MySQL compatible and features horizontal scalability, strong consistency, and high availability. The goal of TiDB is to provide users with a one-stop database solution that covers OLTP (Online Transactional Processing), OLAP (Online Analytical Processing), and HTAP services. TiDB is suitable for various use cases that require high availability and strong consistency with large-scale data.\n\nTiDB Self-Managed is a product option of TiDB, where users or organizations can deploy and manage TiDB on their own infrastructure with complete flexibility. With TiDB Self-Managed, you can enjoy the power of open source, distributed SQL while retaining full control over your environment.',
      website: 'https://www.pingcap.com/',
      email: 'qizhi.wang@pingcap.com',
      phone: '+86-15626215416',
      address: '440 N Wolfe Rd, Sunnyvale, CA 94085',
      logo: '',
      tagline: 'Built to Scale with Your Ambitions',
      founded: '2015',
      mission: 'To empower engineers and enterprises to innovate with speed, agility, and scale',
      values: '- Customer success\n- Deliver results with excellence\n- Be open\n- Be an owner\n- Respect and empower people\n- Think Big, Think long and think different',
      uniqueSellingPoints: '## Key features\n\n- **Easy horizontal scaling**\n\n    The TiDB architecture design separates computing from storage, letting you scale out or scale in the computing or storage capacity online as needed. The scaling process is transparent to application operations and maintenance staff.\n\n- **Financial-grade high availability**\n\n    Data is stored in multiple replicas, and the Multi-Raft protocol is used to obtain the transaction log. A transaction can only be committed when data has been successfully written into the majority of replicas. This guarantees strong consistency and availability when a minority of replicas go down. You can configure the geographic location and number of replicas as needed to meet different disaster tolerance levels.\n\n- **Real-time HTAP**\n\n    TiDB provides two storage engines: TiKV, a row-based storage engine, and TiFlash, a columnar storage engine. TiFlash uses the Multi-Raft Learner protocol to replicate data from TiKV in real time, ensuring consistent data between the TiKV row-based storage engine and the TiFlash columnar storage engine. TiKV and TiFlash can be deployed on different machines as needed to solve the problem of HTAP resource isolation.\n\n- **Cloud-native distributed database**\n\n    TiDB is a distributed database designed for the cloud, providing flexible scalability, reliability, and security on the cloud platform. Users can elastically scale TiDB to meet the requirements of their changing workloads. In TiDB, each piece of data has at least 3 replicas, which can be scheduled in different cloud availability zones to tolerate the outage of a whole data center. TiDB Operator helps manage TiDB on Kubernetes and automates tasks related to operating the TiDB cluster, making TiDB easier to deploy on any cloud that provides managed Kubernetes. TiDB Cloud, the fully-managed TiDB service, is the easiest, most economical, and most resilient way to unlock the full power of TiDB in the cloud, allowing you to deploy and run TiDB clusters with just a few clicks.\n\n- **Compatible with the MySQL protocol and MySQL ecosystem**\n\n    TiDB is compatible with the MySQL protocol, common features of MySQL, and the MySQL ecosystem. To migrate applications to TiDB, you do not need to change a single line of code in many cases, or only need to modify a small amount of code. In addition, TiDB provides a series of data migration tools to help easily migrate application data into TiDB.\n\n## Use cases\n\n- **Financial industry scenarios**\n\n    TiDB is ideal for financial industry scenarios with high requirements for data consistency, reliability, availability, scalability, and disaster tolerance. Traditional solutions are costly and inefficient, with low resource utilization and high maintenance costs. TiDB uses multiple replicas and the Multi-Raft protocol to schedule data to different data centers, racks, and machines, ensuring system RTO ≦ 30 seconds and RPO = 0.\n\n- **Massive data and high concurrency scenarios**\n\n    Traditional standalone databases cannot meet the data capacity requirements of rapidly growing applications. TiDB is a cost-effective solution that adopts a separate computing and storage architecture, enabling easy scaling of computing or storage capacity separately. The computing layer supports a maximum of 512 nodes, each node supports a maximum of 1,000 concurrencies, and the maximum cluster capacity is at the PB (petabytes) level.\n\n- **Real-time HTAP scenarios**\n\n    TiDB is ideal for scenarios with massive data and high concurrency that require real-time processing. TiDB introduces the TiFlash columnar storage engine in v4.0, which combines with the TiKV row-based storage engine to build TiDB as a true HTAP database. With a small amount of extra storage cost, you can handle both online transactional processing and real-time data analysis in the same system, which greatly saves cost.\n\n- **Data aggregation and secondary processing scenarios**\n\n    TiDB is suitable for companies that need to aggregate scattered data into the same system and execute secondary processing to generate a T+0 or T+1 report. Compared with Hadoop, TiDB is much simpler. You can replicate data into TiDB using ETL (Extract, Transform, Load) tools or data migration tools provided by TiDB. Reports can be directly generated using SQL statements.'
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
                          sx={{
                            width: '100%',
                            minWidth: '200px'
                          }}
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