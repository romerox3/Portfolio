import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SectionContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ffff;
  border-radius: 15px;
  color: #00ffff;
  font-family: 'Orbitron', sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 1s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const StudyItem = styled.div`
  margin-bottom: 30px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StudyTitle = styled.h3`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const StudyDetails = styled.p`
  font-size: 1.1em;
  margin-bottom: 5px;
`;

const Studies = () => (
  <SectionContainer>
    <SectionTitle>Educación</SectionTitle>
    <StudyItem>
      <StudyTitle>Universidad de Córdoba</StudyTitle>
      <StudyDetails>Grado en Ingeniería Informática, Ingeniería informática</StudyDetails>
      <StudyDetails>2011 - 2015 · SIN FINALIZAR</StudyDetails>
    </StudyItem>
    <StudyItem>
      <StudyTitle>CES Lope de Vega</StudyTitle>
      <StudyDetails>Técnico Superior en Administración de Sistemas Informáticos en Red</StudyDetails>
      <StudyDetails>2009 - 2011</StudyDetails>
    </StudyItem>
    <StudyItem>
      <StudyTitle>IES Tierno Galván</StudyTitle>
      <StudyDetails>Técnico en Explotación de Sistemas Informáticos, Informática</StudyDetails>
      <StudyDetails>2007 - 2009</StudyDetails>
    </StudyItem>
  </SectionContainer>
);

export default Studies;