import { QueryClientProvider } from '@tanstack/react-query';
import Router from './routes/Router';
import queryClient from './services/queryClient';
import './styles/globals.css';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;
