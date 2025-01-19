import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import './i18n'; // Import the i18n configuration



ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
      
    </BrowserRouter>
);
