import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { workoutPlanService } from '../../services/api';
import { WorkoutPlan } from '../../@types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.color.text.primary};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
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
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.color.background.secondary};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.rounded.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.color.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.color.text.secondary};
  margin-bottom: 1rem;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: 0.875rem;
`;

const WorkoutPlans = () => {
  const { data: workoutPlans, isLoading } = useQuery<WorkoutPlan[]>(
    'workoutPlans',
    async () => {
      const response = await workoutPlanService.getAll();
      return response.data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Workout Plans</Title>
        <Button>Create New Plan</Button>
      </Header>

      <Grid>
        {workoutPlans?.map((plan) => (
          <Card key={plan.id}>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <CardMeta>
              <span>{plan.difficulty}</span>
              <span>{plan.duration} minutes</span>
            </CardMeta>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkoutPlans; 