/**
 * Analytics service to track user actions
 */

/**
 * Report user action to the backend
 * @param {string} action - The action performed by the user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} - The response from the server
 */
export async function reportUserAction(action, userData) {
  try {
    const user = userData || {};
    
    const payload = {
      action,
      email: user.email || '',
      name: user.name || ''
    };
    
    const response = await fetch('/api/analytics/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Error reporting user action: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to report user action:', error);
    // Don't throw the error to avoid breaking the user flow
    return { success: false, error: error.message };
  }
} 