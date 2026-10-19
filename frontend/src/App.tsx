import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './hooks/useAuth';
import { theme } from './styles/theme';
import { Router } from './Router';
import { queryClient } from './services/reactQuery/client';
import { GlobalStyle } from './styles/global';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme as any}>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <Router />
            <ToastContainer
              position="top-right"
              pauseOnHover={false}
              theme="light"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
