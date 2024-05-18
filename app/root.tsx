import { Links, Outlet, Scripts } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/Toaster';
import queryClient from './services/queryClient';
import './styles/globals.css';

const Root = () => {
  return (
    <html lang="en" className="h-screen w-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
        <Links />
      </head>
      <body className="h-screen w-full">
        <div id="root">
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Outlet />
          </QueryClientProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
};

export default Root;
