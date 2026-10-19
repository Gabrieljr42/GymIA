import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService, workoutPlanService } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: 'active' | 'inactive';
  instructorId: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  htmlContent?: string;
  createdAt: Date;
  exercisesInPlan: Array<{
    exercise: {
      name: string;
      description?: string;
    };
    sets?: string;
    reps?: string;
    rest?: string;
    observations?: string;
  }>;
}

interface NewWorkoutPlan {
  name: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
  bodyType: string;
  goal: string;
  level: string;
  injuries: string;
  availability: string;
  preferences: string;
}

interface GymVisit {
  date: Date;
  visited: boolean;
  workout?: string;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #1a1a1a;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: #f3f4f6;
    transform: translateX(-2px);
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#4f46e5' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#4338ca' : '#f3f4f6'};
    transform: translateY(-1px);
  }
`;

const ClientInfo = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0 0 1rem 0;
    color: #1a1a1a;
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: #666;
    font-size: 0.9rem;
  }

  span {
    color: #1a1a1a;
    font-weight: 500;
  }
`;

const NutritionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
    font-weight: 600;
  }
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CalendarDay = styled.div<{ visited?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 4px;
  background: ${props => props.visited ? '#4f46e5' : 'white'};
  color: ${props => props.visited ? 'white' : 'black'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem;
  text-align: center;

  .workout {
    font-size: 0.7rem;
    margin-top: 0.25rem;
    opacity: 0.9;
  }

  &:hover {
    border-color: #4f46e5;
    transform: translateY(-2px);
  }
`;

const WorkoutPlanCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #000;
  }

  .date {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .exercises {
    display: grid;
    gap: 0.75rem;
  }

  .exercise {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;

    .name {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .details {
      font-size: 0.875rem;
      color: #666;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
`;

const AddWorkoutButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: auto;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
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
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4f46e5;
    border-radius: 4px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #374151;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #4f46e5;
    color: white;
    &:hover {
      background: #4338ca;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const LoadingText = styled.p`
  color: #4f46e5;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0.5rem 0;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  max-width: 300px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'workouts' | 'nutrition' | 'tracker'>('workouts');
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [newWorkoutPlan, setNewWorkoutPlan] = useState<NewWorkoutPlan>({
    name: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    bodyType: '',
    goal: '',
    level: '',
    injuries: '',
    availability: '',
    preferences: '',
  });
  const queryClient = useQueryClient();

  const { data: client, isLoading: isLoadingClient, error: clientError } = useQuery<Client>(
    ['client', clientId],
    async () => {
      const response = await clientService.getById(clientId!);
      return response.data;
    },
    {
      enabled: !!clientId,
      staleTime: 30000,
      cacheTime: 60000,
    }
  );

  const { data: workoutPlans, isLoading: isLoadingWorkouts, error: workoutError } = useQuery<WorkoutPlan[]>(
    ['workoutPlans', clientId],
    async () => {
      try {
        const response = await clientService.getWorkoutPlans(clientId!);
        return response.data;
      } catch (error) {
        console.error('Error fetching workout plans:', error);
        throw error;
      }
    },
    {
      enabled: !!clientId,
      staleTime: 30000,
      cacheTime: 60000,
      retry: 1,
    }
  );

  // Fake data for nutrition table
  const nutritionData = [
    { meal: 'Café da manhã', calories: 450, protein: '30g', carbs: '45g', fats: '15g' },
    { meal: 'Almoço', calories: 650, protein: '40g', carbs: '60g', fats: '20g' },
    { meal: 'Janta', calories: 550, protein: '35g', carbs: '50g', fats: '18g' },
    { meal: 'Lanche', calories: 300, protein: '15g', carbs: '30g', fats: '12g' },
  ];

  // Fake data for gym visits
  const gymVisits = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const visited = Math.random() > 0.5;
    const workouts = ['COSTAS', 'PEITO', 'PERNAS', 'OMBRO', 'BÍCEPS', 'TRÍCEPS'];
    return {
      date,
      visited,
      workout: visited ? workouts[Math.floor(Math.random() * workouts.length)] : undefined
    };
  });

  const createWorkoutPlanMutation = useMutation(
    (data: NewWorkoutPlan) => workoutPlanService.create({
      clientId: clientId!,
      ...data,
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workoutPlans', clientId]);
        toast.success('Plano de treino criado com sucesso!');
        setIsCreatingWorkout(false);
        setNewWorkoutPlan({
          name: '',
          gender: '',
          age: '',
          weight: '',
          height: '',
          bodyType: '',
          goal: '',
          level: '',
          injuries: '',
          availability: '',
          preferences: '',
        });
      },
      onError: () => {
        toast.error('Falha ao criar o plano de treino');
      },
    }
  );

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkoutPlanMutation.mutate(newWorkoutPlan);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewWorkoutPlan(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewWorkoutPlan(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (clientError || workoutError) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/clients')}>
            ← Voltar para Clientes
          </BackButton>
          <h1>Error</h1>
        </Header>
        <ErrorMessage>
          {clientError ? 'Error loading client details' : 'Error loading workout plans'}
        </ErrorMessage>
      </Container>
    );
  }

  if (!client) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/clients')}>
            ← Voltar para Clientes
          </BackButton>
          <h1>Not Found</h1>
        </Header>
        <ErrorMessage>Client not found</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/clients')}>
          ← Voltar para Clientes
        </BackButton>
        <h1>{client.name}</h1>
      </Header>

      <Tabs>
        <Tab 
          active={activeTab === 'workouts'} 
          onClick={() => setActiveTab('workouts')}
        >
          Planos de Treino
        </Tab>
        <Tab 
          active={activeTab === 'nutrition'} 
          onClick={() => setActiveTab('nutrition')}
        >
          Plano de Nutrição
        </Tab>
        <Tab 
          active={activeTab === 'tracker'} 
          onClick={() => setActiveTab('tracker')}
        >
          Dias na academia
        </Tab>
      </Tabs>

      {activeTab === 'workouts' && (
        <div>
          {isLoadingWorkouts ? (
            <LoadingMessage>Carregando planos de treino...</LoadingMessage>
          ) : workoutError ? (
            <ErrorMessage>Erro ao carregar planos de treino. Por favor, tente novamente mais tarde.</ErrorMessage>
          ) : !workoutPlans || workoutPlans.length === 0 ? (
            <LoadingMessage>Nenhum plano de treino encontrado para este cliente.</LoadingMessage>
          ) : (
            workoutPlans.map(plan => (
              <WorkoutPlanCard 
                key={plan.id}
                onClick={() => navigate(`/workout-plans/${plan.id}`)}
              >
                <h3>{plan.name}</h3>
                <div className="date">
                  Criado em {format(new Date(plan.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div className="exercises">
                  {plan.exercisesInPlan?.map((exercise, index) => (
                    <div key={index} className="exercise">
                      <div className="name">{exercise.exercise.name}</div>
                      <div className="details">
                        {exercise.sets && <span>Sets: {exercise.sets}</span>}
                        {exercise.reps && <span>Reps: {exercise.reps}</span>}
                        {exercise.rest && <span>Rest: {exercise.rest}</span>}
                        {exercise.observations && <span>Observações: {exercise.observations}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </WorkoutPlanCard>
            ))
          )}
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div>
          <h3>Plano de Nutrição Diário</h3>
          <NutritionTable>
            <thead>
              <tr>
                <th>Refeição</th>
                <th>Calorias</th>
                <th>Proteínas</th>
                <th>Carboidratos</th>
                <th>Gorduras</th>
              </tr>
            </thead>
            <tbody>
              {nutritionData.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.meal}</td>
                  <td>{meal.calories}</td>
                  <td>{meal.protein}</td>
                  <td>{meal.carbs}</td>
                  <td>{meal.fats}</td>
                </tr>
              ))}
            </tbody>
          </NutritionTable>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div>
          <h3>Presença na academia</h3>
          <Calendar>
            {gymVisits.map((visit, index) => (
              <CalendarDay 
                key={index}
                visited={visit.visited}
                title={format(visit.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              >
                {visit.date.getDate()}
                {visit.workout && <div className="workout">{visit.workout}</div>}
              </CalendarDay>
            ))}
          </Calendar>
        </div>
      )}

      <AddWorkoutButton onClick={() => setIsCreatingWorkout(true)}>
        + Adicionar Plano de Treino
      </AddWorkoutButton>

      {isCreatingWorkout && (
        <Modal>
          <ModalContent>
            <Form onSubmit={handleCreateWorkout}>
              <h2>Criar Novo Plano de Treino</h2>
              
              {createWorkoutPlanMutation.isLoading && (
                <LoadingOverlay>
                  <Spinner />
                  <LoadingText>Gerando plano de treino personalizado...</LoadingText>
                  <LoadingSubtext>
                    Estamos analisando suas informações e criando um plano otimizado para seus objetivos.
                    Isso pode levar alguns segundos.
                  </LoadingSubtext>
                </LoadingOverlay>
              )}

              <FormGroup>
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newWorkoutPlan.name}
                  onChange={handleInputChange}
                  required
                  disabled={createWorkoutPlanMutation.isLoading}
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="gender">Gênero</label>
                <Select
                  id="gender"
                  name="gender"
                  value={newWorkoutPlan.gender}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Selecione o gênero</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="age">Idade</label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={newWorkoutPlan.age}
                  onChange={handleInputChange}
                  placeholder="Idade em anos"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="weight">Peso (kg)</label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={newWorkoutPlan.weight}
                  onChange={handleInputChange}
                  placeholder="Peso em kg"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="height">Altura (cm)</label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={newWorkoutPlan.height}
                  onChange={handleInputChange}
                  placeholder="Altura em cm"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="bodyType">Tipo Fisiológico</label>
                <Select
                  id="bodyType"
                  name="bodyType"
                  value={newWorkoutPlan.bodyType}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ectomorph">Ectomorfo</option>
                  <option value="mesomorph">Mesomorfo</option>
                  <option value="endomorph">Endomorfo</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="goal">Objetivo</label>
                <Select
                  id="goal"
                  name="goal"
                  value={newWorkoutPlan.goal}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Selecione o objetivo</option>
                  <option value="muscle_gain">Ganho de Massa Muscular</option>
                  <option value="fat_loss">Perda de Gordura</option>
                  <option value="strength">Força</option>
                  <option value="endurance">Resistência</option>
                  <option value="maintenance">Manutenção</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="level">Nível</label>
                <Select
                  id="level"
                  name="level"
                  value={newWorkoutPlan.level}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Selecione o nível</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="injuries">Lesões</label>
                <TextArea
                  id="injuries"
                  name="injuries"
                  value={newWorkoutPlan.injuries}
                  onChange={handleInputChange}
                  placeholder="Descreva qualquer lesão ou limitação física"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="availability">Disponibilidade</label>
                <TextArea
                  id="availability"
                  name="availability"
                  value={newWorkoutPlan.availability}
                  onChange={handleInputChange}
                  placeholder="Descreva os horários disponíveis para treino"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="preferences">Preferências</label>
                <TextArea
                  id="preferences"
                  name="preferences"
                  value={newWorkoutPlan.preferences}
                  onChange={handleInputChange}
                  placeholder="Preferências de treino (ex: treinos longos/curtos, tipo de ficha ABC, AB...)"
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={createWorkoutPlanMutation.isLoading}
                >
                  {createWorkoutPlanMutation.isLoading ? (
                    <>
                      <Spinner />
                      Criando...
                    </>
                  ) : (
                    'Criar Plano'
                  )}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsCreatingWorkout(false);
                    setNewWorkoutPlan({
                      name: '',
                      gender: '',
                      age: '',
                      weight: '',
                      height: '',
                      bodyType: '',
                      goal: '',
                      level: '',
                      injuries: '',
                      availability: '',
                      preferences: '',
                    });
                  }}
                  disabled={createWorkoutPlanMutation.isLoading}
                >
                  Cancelar
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ClientDetails; 