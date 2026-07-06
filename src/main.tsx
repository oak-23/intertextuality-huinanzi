import "@fontsource/noto-serif-tc/400.css";
import "@fontsource/noto-serif-tc/500.css";
import "@fontsource/noto-serif-tc/600.css";
import "@fontsource/noto-serif-tc/700.css";
import "@fontsource/noto-serif-sc/latin-400.css";
import "@fontsource/noto-serif-sc/latin-500.css";
import "@fontsource/noto-serif-sc/latin-600.css";
import "@fontsource/noto-serif-sc/latin-700.css";
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
