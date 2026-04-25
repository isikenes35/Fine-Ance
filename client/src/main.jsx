import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#f1f5f9' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#f1f5f9' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
