import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import env from './env';

const prepareMsw = async () => {
  if (env.MODE === 'development' && env.VITE_APP_MSW_ENABLED) {
    const worker = await import('../mocks/worker');
    worker.default.start({ onUnhandledRequest: 'bypass' });
  }

  return Promise.resolve();
};

prepareMsw().then(() => {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
