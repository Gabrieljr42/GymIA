import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clientService } from '../../services/api';
import { Client } from '../../@types';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.font.sizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.font.sizes.medium};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.rounded.medium};
  font-size: ${({ theme }) => theme.font.sizes.medium};
  background-color: ${({ theme }) => theme.color.background.primary};
  color: ${({ theme }) => theme.color.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<{ variant?: 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.color.background.secondary : theme.color.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.color.text.primary : 'white'};
  border: none;
  border-radius: ${({ theme }) => theme.rounded.medium};
  cursor: pointer;
  transition: opacity 0.2s;
  flex: 1;

  &:hover {
    opacity: 0.9;
  }
`;

const AddClient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    healthConditions: '',
    goals: ''
  });

  const { mutate: createClient, isLoading } = useMutation(
    (newClient: Omit<Client, 'id'>) => clientService.create(newClient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        navigate('/clients');
      }
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient(formData);
  };

  return (
    <Container>
      <Title>Add New Client</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="healthConditions">Health Conditions</Label>
          <Input
            type="text"
            id="healthConditions"
            name="healthConditions"
            value={formData.healthConditions}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="goals">Fitness Goals</Label>
          <Input
            type="text"
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={() => navigate('/clients')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Client'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AddClient; 