import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.error('Efetue o login!');
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
