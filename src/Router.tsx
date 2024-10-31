import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigation,
} from 'react-router';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { Toaster } from './components/ui/Toaster';
import queryClient from './services/queryClient';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const PostDetailsPage = lazy(
  () => import('./pages/PostDetailsPage/PostDetailsPage'),
);

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'posts/:id', element: <PostDetailsPage /> },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
