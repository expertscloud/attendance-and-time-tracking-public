import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import store from './store/store';
import App from './App';
import './index.css';
import AxiosInterceptor from './utils/AxiosInterceptor';
import ErrorBoundaryDialog from '@/shared/errorBoundaryDialog/ErrorBoundaryDialog';
import queryClient from '@/lib/queryClient';

AxiosInterceptor.initialize();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<ErrorBoundaryDialog />}>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </Provider>
);
