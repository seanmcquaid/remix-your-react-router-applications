import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './Root';

const Home = lazy(() => import('./Home/Home'));
const PostDetails = lazy(() => import('./PostDetails/PostDetails'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'posts/:id', element: <PostDetails /> },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
