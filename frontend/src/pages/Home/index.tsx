import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';

const NeuralNetworkBackground = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
  overflow: hidden;
`;

const AnimatedSVG = styled.svg`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0; left: 0;
  opacity: 0.5;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem 1.5rem 3rem;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: ${({ theme }) => theme.color.primary};
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.color.secondary};
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 120px;
  padding-left: 6vw;
  padding-right: 2vw;
  max-width: 700px;
`;

const HeroWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  position: relative;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeroImages = styled.div`
  position: fixed;
  right: 5vw;
  top: 8vw;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 2;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

const HeroImage = styled.img`
  width: 800px;
  max-width: 60vw;
  border-radius: 1.5rem;
  box-shadow: 0 12px 48px 0 rgba(79,70,229,0.28), 0 2px 16px 0 rgba(79,70,229,0.18);
  background: #fff;
  margin-bottom: 1.5rem;
  &:nth-child(2) {
    margin-top: -60px;
    margin-left: 40px;
    opacity: 0.95;
  }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 2.5rem;
  margin-bottom: 4rem;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #1e1e1e;
  margin-bottom: 1rem;
  text-align: left;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 480px;
  margin: 0 0 1.5rem 0;
  text-align: left;
`;

const HeroSVG = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Benefits = styled.section`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 4rem;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const Benefit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 220px;
  text-align: center;
  svg {
    color: ${({ theme }) => theme.color.primary};
    font-size: 2.2rem;
  }
  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #222;
    margin: 0.5rem 0 0.2rem 0;
  }
  p {
    color: #6b7280;
    font-size: 1rem;
  }
`;

const Steps = styled.section`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-bottom: 4rem;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  max-width: 180px;
  h4 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #222;
    margin: 0.5rem 0 0.2rem 0;
  }
  p {
    color: #6b7280;
    font-size: 0.98rem;
  }
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  color: #b0b0b0;
  font-size: 0.98rem;
  padding: 2rem 0 1rem 0;
  margin-top: auto;
`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <NeuralNetworkBackground>
        <AnimatedSVG viewBox="0 0 1440 900" preserveAspectRatio="none">
          <circle id="n1" cx="200" cy="200" r="4" fill="#6D28D9">
            <animate attributeName="cy" values="200;220;200" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle id="n2" cx="400" cy="300" r="3.5" fill="#4F46E5">
            <animate attributeName="cy" values="300;320;300" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle id="n3" cx="700" cy="180" r="4" fill="#A78BFA">
            <animate attributeName="cy" values="180;200;180" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle id="n4" cx="1100" cy="400" r="3.5" fill="#6D28D9">
            <animate attributeName="cy" values="400;420;400" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle id="n5" cx="900" cy="600" r="4" fill="#4F46E5">
            <animate attributeName="cy" values="600;620;600" dur="6s" repeatCount="indefinite" />
          </circle>
          <line x1="200" y1="200" x2="400" y2="300" stroke="#A78BFA" strokeWidth="1.2" opacity="0.5">
            <animate attributeName="y2" values="300;320;300" dur="7s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="300" x2="700" y2="180" stroke="#6D28D9" strokeWidth="1.2" opacity="0.4">
            <animate attributeName="y2" values="180;200;180" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="180" x2="1100" y2="400" stroke="#4F46E5" strokeWidth="1.2" opacity="0.4">
            <animate attributeName="y2" values="400;420;400" dur="8s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="180" x2="900" y2="600" stroke="#A78BFA" strokeWidth="1.2" opacity="0.3">
            <animate attributeName="y2" values="600;620;600" dur="6s" repeatCount="indefinite" />
          </line>
        </AnimatedSVG>
      </NeuralNetworkBackground>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Header>
          <Logo>
            <img src="/images/logo.svg" alt="IaGYm Logo" style={{ height: '2.2rem' }} />
            <span>Sua IA para o treino</span>
          </Logo>
          <NavButton onClick={() => navigate('/login')}>Entrar</NavButton>
        </Header>
        <Main>
          <HeroWrapper>
            <Hero>
              <HeroSVG>
                {/* SVG minimalista IA/dumbbell */}
                <img src="/images/logo.svg" alt="IaGYm Logo" style={{ height: '10rem', width: '10rem'  }} />
              </HeroSVG>
              <HeroTitle>Seu treino, sua evolução. Simples assim.</HeroTitle>
              <HeroSubtitle>
                Descubra o poder da personalização com IA. Treinos inteligentes, rápidos e sob medida para você.
              </HeroSubtitle>
              <NavButton onClick={() => navigate('/login')}>Começar Agora</NavButton>
            </Hero>
            <HeroImages>
              <HeroImage src="/images/Demo2.png" alt="Demonstração 1" />
              <HeroImage src="/images/Demo1.png" alt="Demonstração 2" style={{marginTop: '-160px'}} />
            </HeroImages>
          </HeroWrapper>
          <Benefits>
            <Benefit>
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="8" y="14" width="16" height="8" rx="4" fill="#6D28D9"/><circle cx="12" cy="18" r="2" fill="#fff"/><circle cx="20" cy="18" r="2" fill="#fff"/><rect x="14" y="10" width="4" height="4" rx="2" fill="#A78BFA"/></svg>
              <h3>IA Inteligente</h3>
              <p>Planos que aprendem com você e evoluem a cada treino.</p>
            </Benefit>
            <Benefit>
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="6" y="14" width="20" height="4" rx="2" fill="#4F46E5"/><rect x="4" y="12" width="2" height="8" rx="1" fill="#A78BFA"/><rect x="26" y="12" width="2" height="8" rx="1" fill="#A78BFA"/></svg>
              <h3>Praticidade</h3>
              <p>Ficha pronta em segundos, sem complicação ou enrolação.</p>
            </Benefit>
            <Benefit>
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="13" r="5" fill="#6D28D9"/><rect x="8" y="20" width="16" height="6" rx="3" fill="#A78BFA"/></svg>
              <h3>Foco em Você</h3>
              <p>Personalização total para seu objetivo e rotina.</p>
            </Benefit>
          </Benefits>
          <Steps>
            <Step>
              <h4>1. Responda</h4>
              <p>Conte seus objetivos e o que você quer.</p>
            </Step>
            <Step>
              <h4>2. IA Cria</h4>
              <p>Receba um treino sob medida em segundos.</p>
            </Step>
            <Step>
              <h4>3. Evolua</h4>
              <p>Acompanhe seu progresso e ajuste sempre que quiser.</p>
            </Step>
          </Steps>
        </Main>
        <Footer>
          © 2025 IaGYm. Todos os direitos reservados.
        </Footer>
      </Container>
    </>
  );
};

export default Home;
