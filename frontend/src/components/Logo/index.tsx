import { ImageContainer, LogoContainer } from './styles';

export const Logo = () => {
  return (
    <LogoContainer title="Fichas com IA">
      <ImageContainer>
        <img src="/images/logo.svg" alt="Fichas com IA logo" loading="lazy" />
        <span>F</span>
      </ImageContainer>

      <span>ichas com IA</span>
    </LogoContainer>
  );
};
