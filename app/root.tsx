import { Outlet, Scripts, useNavigation } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { Toaster } from './components/ui/Toaster';
import queryClient from './services/queryClient';

const Root = () => {
  const navigation = useNavigation();
  const isLoadingPage = navigation.state === 'loading';

  return (
    <html lang="en" className="h-screen w-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body className="h-screen w-full">
        <div id="root">
          <QueryClientProvider client={queryClient}>
            <LoadingOverlay isLoading={isLoadingPage} />
            <Toaster />
            <Suspense>
              <Outlet />
            </Suspense>
          </QueryClientProvider>
        </div>
        <Scripts />
        <noscript> You need to enable JavaScript to run this app! :( </noscript>
      </body>
    </html>
  );
};

export default Root;
