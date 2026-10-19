import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.background.secondary};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.color.background.primary};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.rounded.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #111;
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.color.background.secondary};
  border-radius: ${({ theme }) => theme.rounded.medium};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.primary}20;
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.rounded.medium};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.secondary};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.text.secondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
 color: #111;

  span {
    color: ${({ theme }) => theme.color.primary};
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.error};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(name, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>{isLogin ? 'Entrar' : 'Criar Conta'}</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </Button>
        </Form>
        <ToggleText>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Criar conta' : 'Fazer login'}
          </span>
        </ToggleText>
      </Card>
    </Container>
  );
};

export default Login; 