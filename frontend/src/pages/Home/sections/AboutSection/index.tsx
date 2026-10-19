import { HomeBaseSection } from '../../../../layouts/HomeBaseSection';
import { DescriptionContainer, SectionContainer } from './styles';

export const AboutSection = () => {
  return (
    <HomeBaseSection
      id="about"
      heading="Sobre"
      description="A gestão de fichas de treino pode ser uma tarefa complexa e demorada, 
      exigindo atenção aos detalhes e organização. Nesse contexto, o Fichas com IA, 
      gerenciador de fichas de treino com inteligência artificial, pode transformar 
      essa experiência."
    >
      <DescriptionContainer>
        <SectionContainer>
          <img
            src="/images/blood-report.svg"
            alt="Ficha de treino com exercícios e símbolo de IA"
            loading="lazy"
          />
          <p>
            Com essa aplicação, as fichas de treino podem ser geradas e gerenciadas
            de forma inteligente, evitando assim que o processo seja feito de forma
            manual e demorada.
          </p>
        </SectionContainer>

        <SectionContainer className="text-right">
          <img
            src="/images/frame-6-1.svg"
            alt="Bloco de notas"
            loading="lazy"
          />
          <p>
            Além disso, a plataforma propõe-se a fornecer, aos utilizadores, uma
            interface intuitiva para o gerenciamento de fichas de treino, disponibilizando
            opções de organização e personalização, bem como método de acompanhamento
            do progresso dos alunos. Desse modo, provendo mais uma
            funcionalidade, agora voltada para o aspecto gerencial, que faz o
            manual virar digital, o demorado se tornar ágil, o sinônimo de
            gestão de treinos ser Fichas com IA
          </p>
        </SectionContainer>

        <SectionContainer>
          <img
            src="/images/saly-42.svg"
            alt="Computador com números binarios sendo exibidos na tela"
            loading="lazy"
          />
          <p>
            Dessa maneira abre uma série de possibilidades aos usuários, que
            podem usar o tempo restante para outras atividades mais importantes
            ou até mesmo para seu descanso e lazer, contando com uma ferramenta
            que mantém uma constante precisão.
          </p>
        </SectionContainer>
      </DescriptionContainer>
    </HomeBaseSection>
  );
};
