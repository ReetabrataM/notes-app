import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppQueryProvider } from './providers/QueryProvider';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppQueryProvider>
      <App />
    </AppQueryProvider>
  </StrictMode>
);
