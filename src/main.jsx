import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FinanceProvider } from './context/FinanceContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>
);
