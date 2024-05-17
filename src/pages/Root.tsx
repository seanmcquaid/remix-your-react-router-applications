import queryClient from '@/services/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useNavigation, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { Toaster } from '@/components/ui/Toaster';

const Root = () => {
  const navigation = useNavigation();
  const isLoadingPage = navigation.state === 'loading';

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingOverlay isLoading={isLoadingPage} />
      <Toaster />
      <Suspense>
        <Outlet />
      </Suspense>
    </QueryClientProvider>
  );
};

export default Root;
