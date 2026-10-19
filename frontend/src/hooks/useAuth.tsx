import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../@types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar se o token é válido fazendo uma requisição para o backend
      const fetchUser = async () => {
        try {
          const response = await authService.getMe();
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else if (response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      };
      fetchUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 