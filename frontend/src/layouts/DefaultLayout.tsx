import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, Logo, Main, Nav, NavLink, Sidebar, LogoutButton } from './styles';
import { Outlet } from 'react-router-dom';

export const DefaultLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <span>🏋️</span>
          <span>IaGYm</span>
        </Logo>
        <Nav>
          <NavLink to="/dashboard" data-active={location.pathname === '/dashboard'}>
            Dashboard
          </NavLink>
          <NavLink
            to="/clients"
            data-active={location.pathname.includes('/clients')}
          >
            Clientes
          </NavLink>
        </Nav>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </Sidebar>
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}; 