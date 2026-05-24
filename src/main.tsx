import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { RepositoryProvider } from './context/RepositoryContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/shared/Toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RepositoryProvider>
      <AppProvider>
        <ThemeProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ThemeProvider>
      </AppProvider>
    </RepositoryProvider>
  </StrictMode>
);
