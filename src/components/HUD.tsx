import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import styled, { keyframes } from 'styled-components';

interface HUDProps {
  setActiveSection: (section: string | null) => void;
  activeSection: string | null;
}

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
  }
`;

const HUDContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #00ffff;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
`;

const Title = styled.h1`
  font-size: 3em;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.5em;
  margin-bottom: 40px;
  max-width: 800px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const Button = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)'};
  border: 2px solid #00ffff;
  border-radius: 25px;
  color: #00ffff;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2em;
  padding: 10px 20px;
  transition: all 0.3s ease;
  animation: ${props => props.active ? pulseAnimation : 'none'} 2s infinite;

  &:hover {
    background-color: rgba(0, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const HUD: React.FC<HUDProps> = ({ setActiveSection, activeSection }) => {
  const [showPlanet, setShowPlanet] = useState(false);

  const sections = [
    { id: 'STUDIES', name: 'Estudios' },
    { id: 'WORK', name: 'Vida Laboral' },
    { id: 'PROJECTS', name: 'Proyectos' },
    { id: 'SKILLS', name: 'Habilidades' },
    { id: 'CONTACT', name: 'Contacto' },
  ];

  const handleViewPlanet = () => {
    setShowPlanet(true);
    setActiveSection("PLANET");
    console.log(activeSection);
  };

  return (
    <Html fullscreen>
      <HUDContainer>
        <Title>Antonio Romero Cañete</Title>
        <Subtitle>
          "Al igual que los agujeros negros desafían las leyes de la física, la programación enfrenta retos que distorsionan el tiempo, los recursos y la lógica,
          empujando los límites de lo que podemos comprender y resolver."
        </Subtitle>
        <Subtitle>
          Software Engineer | Full Stack Developer | Clean Coder
        </Subtitle>
        <ButtonContainer>
          {sections.map(section => (
            <Button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              active={activeSection === section.id}
            >
              {section.name}
            </Button>
          ))}
          <Button
            onClick={handleViewPlanet}
            active={showPlanet}
          >
            {showPlanet ? 'Ver Proyectos' : 'Ver Planeta'}
          </Button>
        </ButtonContainer>
      </HUDContainer>
    </Html>
  );
};

export default HUD;