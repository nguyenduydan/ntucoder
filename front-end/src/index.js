import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { TitleProvider } from "contexts/TitleContext";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter future={{ v7_relativeSplatPath: true }}>
    <TitleProvider>
      <App />
    </TitleProvider>,
  </BrowserRouter>,
);
