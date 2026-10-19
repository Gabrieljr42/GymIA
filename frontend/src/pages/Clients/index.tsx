import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clientService } from '../../services/api';
import { Client } from '../../@types';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Pencil, Eye, MagnifyingGlass } from 'phosphor-react';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #1a1a1a;
    margin: 0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 300px;
  margin-bottom: 2rem;

  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
    font-size: 0.9rem;
  }

  svg {
    color: #666;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #1a1a1a;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: #f8f9fa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  background: ${props => props.variant === 'primary' ? '#4f46e5' : '#f3f4f6'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};

  &:hover {
    background: ${props => props.variant === 'primary' ? '#4338ca' : '#e5e7eb'};
    transform: translateY(-1px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const AddButton = styled(ActionButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  z-index: 10;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0 0 1.5rem 0;
    color: #1a1a1a;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;
  background: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc2626;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h3 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
  }

  p {
    color: #666;
    margin: 0;
  }
`;

const Clients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, error } = useQuery('clients', clientService.getAll);
  const clients = response?.data || [];

  const createMutation = useMutation(clientService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
      setIsCreating(false);
      setEditingClient(null);
    }
  });

  const updateMutation = useMutation(
    (data: Client) => clientService.update(data.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        setEditingClient(null);
      }
    }
  );

  const handleCreate = () => {
    setIsCreating(true);
    setEditingClient({
      id: '',
      name: '',
      email: '',
      phone: '',
      instructorId: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsCreating(false);
  };

  const handleViewClient = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingClient) {
      setEditingClient({
        ...editingClient,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      createMutation.mutate(editingClient);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate(editingClient);
    }
  };

  const filteredClients = clients.filter(client => 
    client.instructorId === user?.id &&
    (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <LoadingMessage>Carregando clientes...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Erro ao carregar clientes. Por favor, tente novamente mais tarde.</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <h1>Clientes</h1>
      </Header>

      <SearchBar>
        <MagnifyingGlass size={20} />
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {filteredClients?.length === 0 ? (
        <EmptyState>
          <h3>Nenhum cliente encontrado</h3>
          <p>Comece adicionando seu primeiro cliente</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients?.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleEdit(client)}>
                      <Pencil size={18} />
                      Editar
                    </ActionButton>
                    <ActionButton onClick={() => handleViewClient(client)}>
                      <Eye size={18} />
                      Detalhes
                    </ActionButton>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddButton onClick={handleCreate}>
        <Plus size={20} />
        Novo Cliente
      </AddButton>

      {(editingClient || isCreating) && (
        <Modal>
          <ModalContent>
            <h2>{isCreating ? 'Adicionar Novo Cliente' : 'Editar Cliente'}</h2>
            <Form onSubmit={isCreating ? handleCreateSubmit : handleSave}>
              <Input
                name="name"
                value={editingClient?.name || ''}
                onChange={handleChange}
                placeholder="Nome"
                required
              />
              <Input
                name="email"
                type="email"
                value={editingClient?.email || ''}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <Input
                name="phone"
                value={editingClient?.phone || ''}
                onChange={handleChange}
                placeholder="Telefone"
                required
              />
              <Select
                name="membershipStatus"
                value={editingClient?.membershipStatus || 'active'}
                onChange={handleChange}
                required
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
              <ButtonGroup>
                <ActionButton 
                  type="submit" 
                  variant="primary"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {isCreating 
                    ? (createMutation.isLoading ? 'Criando...' : 'Criar')
                    : (updateMutation.isLoading ? 'Salvando...' : 'Salvar')
                  }
                </ActionButton>
                <ActionButton 
                  type="button" 
                  onClick={() => {
                    setEditingClient(null);
                    setIsCreating(false);
                  }}
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  Cancelar
                </ActionButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Clients; 