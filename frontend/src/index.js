import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress ResizeObserver errors - Multiple approaches for robustness
// Method 1: Suppress console errors
const resizeObserverErr = window.console.error;
window.console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) {
    return;
  }
  resizeObserverErr(...args);
};

// Method 2: Add global error handler
const originalWindowError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
    return true; // Prevent default error handling
  }
  if (originalWindowError) {
    return originalWindowError(message, source, lineno, colno, error);
  }
  return false;
};

// Method 3: Suppress unhandled promise rejections related to ResizeObserver
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason === 'string' && event.reason.includes('ResizeObserver loop')) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
