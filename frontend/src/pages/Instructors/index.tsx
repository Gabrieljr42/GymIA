import { useQuery } from 'react-query';
import styled from 'styled-components';
import { instructorService } from '../../services/api';
import { Instructor } from '../../@types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.font.sizes.large};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.color.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.rounded.medium};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.color.background.secondary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.rounded.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Instructors = () => {
  const { data: instructors, isLoading } = useQuery<Instructor[]>(
    'instructors',
    async () => {
      const response = await instructorService.getAll();
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Instructors</Title>
        <Button>Add New Instructor</Button>
      </Header>

      <Grid>
        {instructors?.map((instructor) => (
          <Card key={instructor.id}>
            <h3>{instructor.name}</h3>
            <p>{instructor.email}</p>
            <p>{instructor.phone}</p>
            <p>Specialties: {instructor.specialties.join(', ')}</p>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Instructors; 