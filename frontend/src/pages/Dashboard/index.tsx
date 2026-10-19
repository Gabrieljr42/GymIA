import styled from 'styled-components';
import { Users, Calendar, Warning, ChartLine } from 'phosphor-react';
import { useQuery } from 'react-query';
import { dashboardService } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  color: #000;
  font-size: ${({ theme }) => theme.font.sizes.large};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: #fff;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.rounded.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.color.primary};
  }
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.sizes.medium};
  color: #000;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.font.sizes.xlarge};
  font-weight: bold;
  color: #000;
`;

const StatLabel = styled.div`
  color: #333;
  font-size: ${({ theme }) => theme.font.sizes.small};
`;

const AlertCard = styled(Card)`
  border-left: 4px solid ${({ theme }) => theme.color.error};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.color.error};
`;

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  attendance: {
    today: number;
    thisWeek: number;
    averageDaily: number;
    peakHour: string;
    peakDay: string;
  };
  inactiveClients: Array<{
    name: string;
    daysInactive: number;
  }>;
  trends: {
    newClientsThisMonth: number;
    retentionRate: string;
    averageCheckIn: string;
  };
}

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>(
    'dashboardStats',
    async () => {
      const response = await dashboardService.getStatistics();
      return response.data;
    },
    {
      refetchInterval: 300000, // Refetch every 5 minutes
      staleTime: 300000, // Consider data stale after 5 minutes
    }
  );

  if (isLoading) {
    return <LoadingMessage>Carregando estatísticas...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Erro ao carregar estatísticas. Tente novamente mais tarde.</ErrorMessage>;
  }

  if (!stats) {
    return <ErrorMessage>Nenhuma estatística disponível.</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Dashboard</Title>
      <Grid>
        <Card>
          <CardHeader>
            <Users size={24} />
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
          <StatValue>{stats?.totalClients || 0}</StatValue>
          <StatLabel>Total de Clientes</StatLabel>
          <StatValue>{stats?.activeClients || 0}</StatValue>
          <StatLabel>Clientes Ativos</StatLabel>
          <StatValue>{stats?.trends?.newClientsThisMonth || 0}</StatValue>
          <StatLabel>Novos Clientes (Mês)</StatLabel>
        </Card>

        <Card>
          <CardHeader>
            <Calendar size={24} />
            <CardTitle>Frequência</CardTitle>
          </CardHeader>
          <StatValue>{stats?.attendance?.today || 0}</StatValue>
          <StatLabel>Presentes Hoje</StatLabel>
          <StatValue>{stats?.attendance?.thisWeek || 0}</StatValue>
          <StatLabel>Esta Semana</StatLabel>
          <StatValue>{stats?.attendance?.averageDaily || 0}</StatValue>
          <StatLabel>Média Diária</StatLabel>
          <StatValue>{stats?.attendance?.peakHour || '-'}</StatValue>
          <StatLabel>Horário de Pico</StatLabel>
          <StatValue>{stats?.attendance?.peakDay || '-'}</StatValue>
          <StatLabel>Dia Mais Movimentado</StatLabel>
        </Card>

        <Card>
          <CardHeader>
            <ChartLine size={24} />
            <CardTitle>Métricas</CardTitle>
          </CardHeader>
          <StatValue>{stats?.trends?.retentionRate || '-'}</StatValue>
          <StatLabel>Taxa de Retenção</StatLabel>
          <StatValue>{stats?.trends?.averageCheckIn || '-'}</StatValue>
          <StatLabel>Tempo Médio de Treino</StatLabel>
        </Card>

        <AlertCard>
          <CardHeader>
            <Warning size={24} />
            <CardTitle>Clientes Inativos</CardTitle>
          </CardHeader>
          {stats?.inactiveClients?.map((client, index) => (
            <div key={index}>
              <StatValue>{client.name}</StatValue>
              <StatLabel>{client.daysInactive} dias sem treinar</StatLabel>
            </div>
          )) || <StatLabel>Nenhum cliente inativo</StatLabel>}
        </AlertCard>
      </Grid>
    </Container>
  );
};

export default Dashboard; 