// Financial Modeling Prep API
const FMP_API_BASE = 'https://financialmodelingprep.com/api/v3';
const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY || ''; // Get your free API key from financialmodelingprep.com

// Utility function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text}`);
  }
  return await response.json();
};

/**
 * Search for companies by keyword
 * @param {string} query - Search query (company name or ticker)
 * @returns {Promise<Array>} - List of matching companies
 */
export async function searchCompanies(query) {
  try {
    const response = await fetch(
      `${FMP_API_BASE}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_API_KEY}`
    );
    
    const data = await handleResponse(response);
    
    // Transform FMP data to our format
    const results = data
      .filter(item => item.exchangeShortName && item.symbol)
      .map(item => ({
        '1. symbol': item.symbol,
        '2. name': item.name || item.symbol,
        '3. type': item.type || 'Equity',
        '4. region': item.exchangeShortName || 'US'
      }));
    
    return results;
  } catch (error) {
    console.error('Error searching companies:', error);
    return [];
  }
}

/**
 * Get company overview information
 * @param {string} symbol - Company ticker symbol
 * @returns {Promise<Object>} - Company profile data
 */
export async function getCompanyOverview(symbol) {
  try {
    const [profileResponse, metricsResponse, keyMetricsResponse] = await Promise.all([
      fetch(`${FMP_API_BASE}/profile/${encodeURIComponent(symbol)}?apikey=${FMP_API_KEY}`),
      fetch(`${FMP_API_BASE}/company-key-metrics/${encodeURIComponent(symbol)}?limit=1&apikey=${FMP_API_KEY}`),
      fetch(`${FMP_API_BASE}/ratios/${encodeURIComponent(symbol)}?limit=1&apikey=${FMP_API_KEY}`)
    ]);
    
    const [profileData, metricsData, keyMetricsData] = await Promise.all([
      handleResponse(profileResponse),
      handleResponse(metricsResponse),
      handleResponse(keyMetricsResponse)
    ]);
    
    if (!profileData || profileData.length === 0) {
      return null;
    }
    
    const profile = profileData[0];
    const metrics = metricsData && metricsData.length > 0 ? metricsData[0] : {};
    const keyMetrics = keyMetricsData && keyMetricsData.length > 0 ? keyMetricsData[0] : {};
    
    // Transform FMP data to match our expected format
    return {
      Symbol: symbol,
      Name: profile.companyName || symbol,
      Description: profile.description || 'No description available',
      Industry: profile.industry || 'N/A',
      Sector: profile.sector || 'N/A',
      FullTimeEmployees: profile.fullTimeEmployees || 'N/A',
      Address: profile.address ? 
               `${profile.address}, ${profile.city}, ${profile.state}, ${profile.zip}` : 
               'N/A',
      CEO: profile.ceo || 'N/A',
      RevenueTTM: profile.revenue || null,
      EPS: metrics.EPS || null,
      DividendYield: profile.lastDiv || null,
      PERatio: profile.price / (metrics.EPS || 1),
      FiscalYearEnd: 'December', // Default value as FMP doesn't provide this directly
      ReturnOnInvestedCapital: keyMetrics.ROIC || null,
      CurrentRatio: keyMetrics.currentRatio || null,
    };
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

/**
 * Get company income statement
 * @param {string} symbol - Company ticker symbol
 * @returns {Promise<Object>} - Income statement data
 */
export async function getCompanyIncome(symbol) {
  try {
    const response = await fetch(
      `${FMP_API_BASE}/income-statement/${encodeURIComponent(symbol)}?limit=4&apikey=${FMP_API_KEY}`
    );
    
    const data = await handleResponse(response);
    
    // Map to our expected format
    return {
      annualReports: data.map(statement => ({
        fiscalDateEnding: statement.date || 'N/A',
        netIncome: statement.netIncome || null,
        totalRevenue: statement.revenue || null,
        grossProfit: statement.grossProfit || null,
        operatingIncome: statement.operatingIncome || null,
      }))
    };
  } catch (error) {
    console.error('Error fetching company income statement:', error);
    return { annualReports: [] };
  }
}

/**
 * Get company balance sheet
 * @param {string} symbol - Company ticker symbol
 * @returns {Promise<Object>} - Balance sheet data
 */
export async function getCompanyBalance(symbol) {
  try {
    const response = await fetch(
      `${FMP_API_BASE}/balance-sheet-statement/${encodeURIComponent(symbol)}?limit=4&apikey=${FMP_API_KEY}`
    );
    
    const data = await handleResponse(response);
    
    // Map to our expected format
    return {
      annualReports: data.map(statement => ({
        fiscalDateEnding: statement.date || 'N/A',
        totalAssets: statement.totalAssets || null,
        totalLiabilities: statement.totalLiabilities || null,
        cashAndCashEquivalentsAtCarryingValue: statement.cashAndCashEquivalents || null,
        longTermDebt: statement.longTermDebt || null,
      }))
    };
  } catch (error) {
    console.error('Error fetching company balance sheet:', error);
    return { annualReports: [] };
  }
}

// Helper function to format financial numbers
export function formatFinancialNumber(number) {
  if (!number) return 'N/A';
  
  const num = parseFloat(number);
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
} 