// Client module to set API base URL for local development
// This runs on the client side and sets window.__API_BASE_URL
// which is used by all API calls in the frontend

if (typeof window !== 'undefined') {
  // Check if we're running locally (localhost or 127.0.0.1)
  const isLocalhost = 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '';

  // Set API base URL - use localhost for local dev, otherwise use the global override or Vercel URL
  if (isLocalhost && !(window as any).__API_BASE_URL) {
    (window as any).__API_BASE_URL = 'http://localhost:8000';
    console.log('🔧 Local development detected: API_BASE_URL set to http://localhost:8000');
  }
}

