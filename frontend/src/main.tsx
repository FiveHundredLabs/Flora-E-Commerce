import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/providers';
import './shared/styles.css';
import './shared/styles/foundation.css';
import './shared/styles/public-shell.css';

const root = document.getElementById('root');
if (!root) throw new Error('Application root is missing');

createRoot(root).render(
  <StrictMode>
    <AppProviders><App /></AppProviders>
  </StrictMode>,
);
