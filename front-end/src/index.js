import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { TitleProvider } from "contexts/TitleContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient và QueryClientProvider

import App from './App';

// Tạo một instance của QueryClient
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter future={{ v7_relativeSplatPath: true }}>
    <QueryClientProvider client={queryClient}>  {/* Bao quanh ứng dụng trong QueryClientProvider */}
      <TitleProvider>
        <App />
      </TitleProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
