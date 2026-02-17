// client/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import DocSpotApp from './App'; // Import the main DocSpotApp component (which contains AuthProvider)
import './styles/index.css'; // Ensure this file exists in client/src/styles/

// Define these global variables for local development if they are not provided by the environment.
// In the Canvas environment, these are automatically injected globally.
// For local npm start, they need a fallback to prevent "not defined" errors.
if (typeof window.__app_id === 'undefined') {
  window.__app_id = 'default-app-id-local';
}
if (typeof window.__firebase_config === 'undefined') {
  window.__firebase_config = '{}'; // Needs to be a string that can be parsed
}
if (typeof window.__initial_auth_token === 'undefined') {
  window.__initial_auth_token = null;
}

// The main entry point for the React application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <DocSpotApp /> {/* Render DocSpotApp, which now includes the AuthProvider */}
  </React.StrictMode>
);