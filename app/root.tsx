import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { Links, Meta, Outlet, Scripts } from 'react-router';
import { Toaster } from './components/ui/Toaster';
import queryClient from './services/queryClient';
import './styles/globals.css';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" className="h-screen w-full">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
        <Links />
        <Meta />
      </head>
      <body className="h-screen w-full">
        <div id="root">
          <QueryClientProvider client={queryClient}>
            <Toaster />
            {children}
          </QueryClientProvider>
        </div>
        <Scripts />
        <noscript> You need to enable JavaScript to run this app! :( </noscript>
      </body>
    </html>
  );
};

const Root = () => {
  return <Outlet />;
};

export default Root;
