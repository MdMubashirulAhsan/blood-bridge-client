import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './router/router.jsx';
// import { HelmetProvider } from "react-helmet-async";

import 'aos/dist/aos.css';
import Aos from 'aos';
import AuthProvider from './contexts/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Aos.init();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <HelmetProvider> */}
          <RouterProvider router={router} />
        {/* </HelmetProvider> */}
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
