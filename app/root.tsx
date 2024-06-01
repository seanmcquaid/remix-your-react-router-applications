import { Links, Meta, Outlet, Scripts, useNavigation } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { Toaster } from './components/ui/Toaster';
import queryClient from './services/queryClient';
import './styles/globals.css';

export const Layout = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation();
  const isLoadingPage = navigation.state === 'loading';

  return (
    <html lang="en" className="h-screen w-full">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + Remix + TS</title>
        <Links />
        <Meta />
        <Scripts />
      </head>
      <body className="h-screen w-full">
        <div id="root">
          <QueryClientProvider client={queryClient}>
            <LoadingOverlay isLoading={isLoadingPage} />
            <Toaster />
            {children}
          </QueryClientProvider>
        </div>
        <noscript> You need to enable JavaScript to run this app! :( </noscript>
      </body>
    </html>
  );
};

const Root = () => <Outlet />;

export default Root;
