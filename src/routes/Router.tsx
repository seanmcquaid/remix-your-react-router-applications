import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './Root';

const HomePage = lazy(() => import('./HomePage/HomePage'));
const PostDetailsPage = lazy(() => import('./PostDetailsPage/PostDetailsPage'));

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
