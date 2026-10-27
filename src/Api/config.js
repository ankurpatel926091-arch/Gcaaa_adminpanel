export const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname.endsWith('.local'));

export const LOCAL_URL = 'http://localhost:5000/api';
export const REMOTE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://api.gcaalumniassociation.com/api';

// When running on localhost/127.0.0.1, always connect to local backend (port 5000).
// When running in production (admin.gcaalumniassociation.com), connect to remote API.
export const API_BASE_URL = isLocal ? LOCAL_URL : REMOTE_URL;
