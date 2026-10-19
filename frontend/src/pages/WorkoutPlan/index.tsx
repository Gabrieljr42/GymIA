import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { workoutPlanService } from '../../services/api';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { toast } from 'react-toastify';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import { Trash } from 'phosphor-react';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
  color: #1f2937;
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;

  label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  span {
    color: #1f2937;
    font-weight: 500;
  }
`;

const ExerciseList = styled.div`
  display: grid;
  gap: 1rem;
`;

const HTMLContent = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const DownloadButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4338ca;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const EditableExercise = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ExerciseTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: #e5e7eb;
  }
`;

const ExerciseInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #4f46e5;
  border-radius: 4px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const ExerciseDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const ExerciseLabel = styled.label`
  color: #6b7280;
  font-size: 0.875rem;
  min-width: 100px;
`;

const ExerciseValue = styled.span`
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: #e5e7eb;
  }
`;

const ExerciseValueInput = styled.input`
  padding: 0.25rem;
  border: 1px solid #4f46e5;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
  width: 100px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const ExerciseObservations = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ExerciseObservationsTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #4f46e5;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1f2937;
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const EditableTd = styled.td`
  min-width: 80px;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  &:focus {
    outline: 2px solid #4f46e5;
    background: #eef2ff;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;

  &:hover {
    background: #dc2626;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
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
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.25rem;
`;

const ModalText = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ variant }) => {
    if (variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
        }
      `;
    }
    return `
      background: #e5e7eb;
      color: #4b5563;
      &:hover {
        background: #d1d5db;
      }
    `;
  }}
`;

interface ExerciseInPlan {
  id: string;
  exercise: {
    id: string;
    name: string;
    description?: string;
  };
  sets?: string;
  reps?: string;
  rest?: string;
  observations?: string;
}

interface EditingExercise {
  id: string;
  field: 'name' | 'sets' | 'reps' | 'rest' | 'observations';
}

const translateGender = (gender: string) => {
  const translations: { [key: string]: string } = {
    male: 'Masculino',
    female: 'Feminino',
    other: 'Outro'
  };
  return translations[gender] || gender;
};

const translateBodyType = (bodyType: string) => {
  const translations: { [key: string]: string } = {
    ectomorph: 'Ectomorfo',
    mesomorph: 'Mesomorfo',
    endomorph: 'Endomorfo'
  };
  return translations[bodyType] || bodyType;
};

const translateGoal = (goal: string) => {
  const translations: { [key: string]: string } = {
    muscle_gain: 'Ganho de Massa Muscular',
    fat_loss: 'Perda de Gordura',
    strength: 'Força',
    endurance: 'Resistência',
    maintenance: 'Manutenção'
  };
  return translations[goal] || goal;
};

const translateLevel = (level: string) => {
  const translations: { [key: string]: string } = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return translations[level] || level;
};

const WorkoutPlan = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({ filename: 'plano-de-treino.pdf' });
  const [editingExercise, setEditingExercise] = useState<EditingExercise | null>(null);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();
  const [editableHtml, setEditableHtml] = useState<string | null>(null);
  const [isEditingHtml, setIsEditingHtml] = useState(false);
  const [isSavingHtml, setIsSavingHtml] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { data: workoutPlan, isLoading, error } = useQuery(
    ['workoutPlan', planId],
    async () => {
      const response = await workoutPlanService.getById(planId!);
      return response.data;
    },
    {
      enabled: !!planId,
    }
  );

  const updateExerciseMutation = useMutation(
    (data: { exerciseId: string; field: string; value: string }) => 
      workoutPlanService.updateExercise(planId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workoutPlan', planId]);
        toast.success('Exercício atualizado com sucesso!');
        setEditingExercise(null);
        setEditedValues({});
      },
      onError: () => {
        toast.error('Erro ao atualizar exercício');
      },
    }
  );

  const deleteMutation = useMutation(
    () => workoutPlanService.delete(planId!),
    {
      onSuccess: () => {
        toast.success('Plano de treino excluído com sucesso!');
        navigate('/clients');
      },
      onError: () => {
        toast.error('Erro ao excluir plano de treino');
      },
    }
  );

  const handleDoubleClick = (exerciseId: string, field: EditingExercise['field']) => {
    const exercise = workoutPlan?.exercisesInPlan.find((ex: ExerciseInPlan) => ex.id === exerciseId);
    if (exercise) {
      setEditingExercise({ id: exerciseId, field });
      setEditedValues({
        [field]: field === 'name' ? exercise.exercise.name : exercise[field] || ''
      });
    }
  };

  const handleSave = (exerciseId: string, field: EditingExercise['field']) => {
    const value = editedValues[field];
    if (value !== undefined) {
      updateExerciseMutation.mutate({
        exerciseId,
        field,
        value
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, exerciseId: string, field: EditingExercise['field']) => {
    if (e.key === 'Enter') {
      handleSave(exerciseId, field);
    } else if (e.key === 'Escape') {
      setEditingExercise(null);
      setEditedValues({});
    }
  };

  const handleBlur = (exerciseId: string, field: EditingExercise['field']) => {
    handleSave(exerciseId, field);
  };

  // Função para atualizar o conteúdo editado
  const handleTdChange = (rowIdx: number, colIdx: number, value: string) => {
    if (!editableHtml) return;
    
    // Parse o HTML para DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(editableHtml, 'text/html');
    
    // Encontrar a tabela específica e a célula específica
    const tables = doc.querySelectorAll('table');
    
    // Determinar em qual tabela está a célula que está sendo editada
    let tableCounts = 0;
    let currentTableIndex = -1;
    let rowInCurrentTable = -1;
    
    // Percorre todas as tabelas e conta o número total de linhas
    for (let i = 0; i < tables.length; i++) {
      const tbody = tables[i].querySelector('tbody');
      if (tbody) {
        const numRows = tbody.querySelectorAll('tr').length;
        
        // Verifica se o rowIdx está dentro desta tabela
        if (rowIdx < tableCounts + numRows) {
          currentTableIndex = i;
          rowInCurrentTable = rowIdx - tableCounts;
          break;
        }
        
        tableCounts += numRows;
      }
    }
    
    // Se encontrou a tabela correspondente
    if (currentTableIndex !== -1) {
      const table = tables[currentTableIndex];
      const tbody = table.querySelector('tbody');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        if (rows[rowInCurrentTable]) {
          const cells = rows[rowInCurrentTable].querySelectorAll('td');
          if (cells[colIdx]) {
            cells[colIdx].textContent = value;
          }
        }
      }
    }
    
    setEditableHtml(doc.body.innerHTML);
  };

  // Função para renderizar HTML editável
  const renderEditableHtml = (html: string) => {
    // Contador global para linhas
    let globalRowIndex = 0;
    
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.name === 'table') {
          // Processa a tabela inteira para manter contagem de linhas correta
          const tbody = domNode.children.find(child => 
            child instanceof Element && child.name === 'tbody'
          );
          
          if (tbody && tbody instanceof Element) {
            // Criando o componente de tabela
            return (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  {domNode.children
                    .filter(child => child instanceof Element && child.name === 'thead')
                    .map(thead => domToReact([thead]))}
                </thead>
                <tbody>
                  {tbody.children.map((trNode, tableRowIndex) => {
                    if (trNode instanceof Element && trNode.name === 'tr') {
                      // Usar o índice global para esta linha
                      const currentRowIndex = globalRowIndex++;
                      
                      return (
                        <tr key={tableRowIndex}>
                          {trNode.children.map((tdNode, colIndex) => {
                            if (tdNode instanceof Element && tdNode.name === 'td') {
                              return (
                                <EditableTd
                                  key={colIndex}
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => {
                                    const value = e.currentTarget.textContent || '';
                                    handleTdChange(currentRowIndex, colIndex, value);
                                  }}
                                  style={{ minWidth: 80 }}
                                >
                                  {tdNode.children.length > 0 
                                    ? domToReact(tdNode.children as any) 
                                    : tdNode.children.toString()}
                                </EditableTd>
                              );
                            }
                            return null;
                          })}
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            );
          }
        }
        return undefined;
      }
    };
    return parse(html, options);
  };

  // Salvar o HTML editado
  const handleSaveHtml = async () => {
    if (!editableHtml || !planId) return;
    setIsSavingHtml(true);
    try {
      await workoutPlanService.update(planId, { htmlContent: editableHtml });
      toast.success('Plano de treino salvo com sucesso!');
      setIsEditingHtml(false);
      queryClient.invalidateQueries(['workoutPlan', planId]);
    } catch (err) {
      toast.error('Erro ao salvar o plano de treino');
    } finally {
      setIsSavingHtml(false);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <Container>Carregando...</Container>;
  }

  if (error) {
    return <Container>Erro ao carregar plano de treino</Container>;
  }

  if (!workoutPlan) {
    return <Container>Plano de treino não encontrado</Container>;
  }

  return (
    <Container>
      <div ref={targetRef}>
        <Header>
          <Title>{workoutPlan.name}</Title>
          <Description>
            Criado em {format(new Date(workoutPlan.createdAt), 'dd/MM/yyyy')}
          </Description>
        </Header>

        <Section>
          <SectionTitle>Informações do Cliente</SectionTitle>
          <Grid>
            <InfoItem>
              <label>Gênero</label>
              <span>{translateGender(workoutPlan.gender)}</span>
            </InfoItem>
            <InfoItem>
              <label>Idade</label>
              <span>{workoutPlan.age} anos</span>
            </InfoItem>
            <InfoItem>
              <label>Peso</label>
              <span>{workoutPlan.weight} kg</span>
            </InfoItem>
            <InfoItem>
              <label>Altura</label>
              <span>{workoutPlan.height} cm</span>
            </InfoItem>
            <InfoItem>
              <label>Tipo Físico</label>
              <span>{translateBodyType(workoutPlan.bodyType)}</span>
            </InfoItem>
            <InfoItem>
              <label>Objetivo</label>
              <span>{translateGoal(workoutPlan.goal)}</span>
            </InfoItem>
            <InfoItem>
              <label>Nível</label>
              <span>{translateLevel(workoutPlan.level)}</span>
            </InfoItem>
          </Grid>
        </Section>

        {(workoutPlan.injuries || workoutPlan.availability || workoutPlan.preferences) && (
          <Section>
            <SectionTitle>Informações Adicionais</SectionTitle>
            {workoutPlan.injuries && (
              <InfoItem>
                <label>Lesões e Limitações</label>
                <span>{workoutPlan.injuries}</span>
              </InfoItem>
            )}
            {workoutPlan.availability && (
              <InfoItem>
                <label>Disponibilidade</label>
                <span>{workoutPlan.availability}</span>
              </InfoItem>
            )}
            {workoutPlan.preferences && (
              <InfoItem>
                <label>Preferências</label>
                <span>{workoutPlan.preferences}</span>
              </InfoItem>
            )}
          </Section>
        )}

        <Section>
          <SectionTitle>Plano de Treino</SectionTitle>
          {isEditingHtml ? (
            <>
              {editableHtml && renderEditableHtml(editableHtml)}
              <ButtonContainer>
                <DownloadButton onClick={handleSaveHtml} disabled={isSavingHtml}>
                  {isSavingHtml ? 'Salvando...' : 'Salvar'}
                </DownloadButton>
                <DownloadButton onClick={() => setIsEditingHtml(false)} style={{ background: '#6b7280', marginLeft: 8 }}>
                  Cancelar
                </DownloadButton>
              </ButtonContainer>
            </>
          ) : (
            <>
              {workoutPlan.htmlContent && (
                <HTMLContent dangerouslySetInnerHTML={{ __html: workoutPlan.htmlContent }} />
              )}
              <ButtonContainer>
                <DownloadButton onClick={() => {
                  setEditableHtml(workoutPlan.htmlContent);
                  setIsEditingHtml(true);
                }}>
                  Editar Tabelas
                </DownloadButton>
              </ButtonContainer>
            </>
          )}
          <ExerciseList>
            {workoutPlan.exercisesInPlan.map((exerciseInPlan: ExerciseInPlan) => (
              <EditableExercise key={exerciseInPlan.id}>
                {editingExercise?.id === exerciseInPlan.id && editingExercise.field === 'name' ? (
                  <ExerciseInput
                    value={editedValues.name || ''}
                    onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                    onBlur={() => handleBlur(exerciseInPlan.id, 'name')}
                    onKeyDown={(e) => handleKeyPress(e, exerciseInPlan.id, 'name')}
                    autoFocus
                  />
                ) : (
                  <ExerciseTitle onDoubleClick={() => handleDoubleClick(exerciseInPlan.id, 'name')}>
                    {exerciseInPlan.exercise.name}
                  </ExerciseTitle>
                )}
                <div className="details">
                  {exerciseInPlan.sets && (
                    <ExerciseDetail>
                      <ExerciseLabel>Séries:</ExerciseLabel>
                      {editingExercise?.id === exerciseInPlan.id && editingExercise.field === 'sets' ? (
                        <ExerciseValueInput
                          value={editedValues.sets || ''}
                          onChange={(e) => setEditedValues({ ...editedValues, sets: e.target.value })}
                          onBlur={() => handleBlur(exerciseInPlan.id, 'sets')}
                          onKeyDown={(e) => handleKeyPress(e, exerciseInPlan.id, 'sets')}
                          autoFocus
                        />
                      ) : (
                        <ExerciseValue onDoubleClick={() => handleDoubleClick(exerciseInPlan.id, 'sets')}>
                          {exerciseInPlan.sets}
                        </ExerciseValue>
                      )}
                    </ExerciseDetail>
                  )}
                  {exerciseInPlan.reps && (
                    <ExerciseDetail>
                      <ExerciseLabel>Repetições:</ExerciseLabel>
                      {editingExercise?.id === exerciseInPlan.id && editingExercise.field === 'reps' ? (
                        <ExerciseValueInput
                          value={editedValues.reps || ''}
                          onChange={(e) => setEditedValues({ ...editedValues, reps: e.target.value })}
                          onBlur={() => handleBlur(exerciseInPlan.id, 'reps')}
                          onKeyDown={(e) => handleKeyPress(e, exerciseInPlan.id, 'reps')}
                          autoFocus
                        />
                      ) : (
                        <ExerciseValue onDoubleClick={() => handleDoubleClick(exerciseInPlan.id, 'reps')}>
                          {exerciseInPlan.reps}
                        </ExerciseValue>
                      )}
                    </ExerciseDetail>
                  )}
                  {exerciseInPlan.rest && (
                    <ExerciseDetail>
                      <ExerciseLabel>Descanso:</ExerciseLabel>
                      {editingExercise?.id === exerciseInPlan.id && editingExercise.field === 'rest' ? (
                        <ExerciseValueInput
                          value={editedValues.rest || ''}
                          onChange={(e) => setEditedValues({ ...editedValues, rest: e.target.value })}
                          onBlur={() => handleBlur(exerciseInPlan.id, 'rest')}
                          onKeyDown={(e) => handleKeyPress(e, exerciseInPlan.id, 'rest')}
                          autoFocus
                        />
                      ) : (
                        <ExerciseValue onDoubleClick={() => handleDoubleClick(exerciseInPlan.id, 'rest')}>
                          {exerciseInPlan.rest}
                        </ExerciseValue>
                      )}
                    </ExerciseDetail>
                  )}
                  {exerciseInPlan.observations && (
                    <ExerciseObservations>
                      <ExerciseLabel>Observações:</ExerciseLabel>
                      {editingExercise?.id === exerciseInPlan.id && editingExercise.field === 'observations' ? (
                        <ExerciseObservationsTextarea
                          value={editedValues.observations || ''}
                          onChange={(e) => setEditedValues({ ...editedValues, observations: e.target.value })}
                          onBlur={() => handleBlur(exerciseInPlan.id, 'observations')}
                          onKeyDown={(e) => handleKeyPress(e, exerciseInPlan.id, 'observations')}
                          autoFocus
                        />
                      ) : (
                        <ExerciseValue onDoubleClick={() => handleDoubleClick(exerciseInPlan.id, 'observations')}>
                          {exerciseInPlan.observations}
                        </ExerciseValue>
                      )}
                    </ExerciseObservations>
                  )}
                </div>
              </EditableExercise>
            ))}
          </ExerciseList>
        </Section>
      </div>

      <ButtonContainer>
        <DownloadButton onClick={() => toPDF()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Baixar PDF
        </DownloadButton>
        <DeleteButton onClick={() => setShowDeleteModal(true)}>
          <Trash />
          Excluir Treino
        </DeleteButton>
      </ButtonContainer>

      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Excluir Plano de Treino</ModalTitle>
            <ModalText>
              Tem certeza que deseja excluir este plano de treino? Esta ação não pode ser desfeita.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton variant="danger" onClick={handleDelete}>
                Excluir
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default WorkoutPlan; 
