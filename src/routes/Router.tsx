import { lazy } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

const Home = lazy(() => import('./Home/Home'));
const PostDetails = lazy(() => import('./PostDetails/PostDetails'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'posts/:id', element: <PostDetails /> },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
