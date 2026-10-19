import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: rgb(255, 255, 255);
`;

export const Sidebar = styled.aside`
  width: 250px;
  background: rgb(255, 255, 255);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12), 0 1.5px 4px 0 rgba(0,0,0,0.10);
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NavLink = styled(Link)`
  color: #666;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &[data-active="true"] {
    color: #000;
    background: #f5f5f5;
  }

  &:hover {
    background: #f5f5f5;
    color: #000;
  }
`;

export const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background: rgb(255, 255, 255);
  color: #000;
`;

export const LogoutButton = styled.button`
  margin-top: auto;
  padding: 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #b91c1c;
  }
`; 