import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const WorkItem = styled.div`
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(10px);
    box-shadow: -5px 0 10px rgba(0, 255, 255, 0.3);
  }
`;

const WorkTitle = styled.h3`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const WorkDetails = styled.p`
  font-size: 1.1em;
  margin-bottom: 5px;
`;

const Work = () => (
  <SectionContainer>
    <SectionTitle>Experiencia Laboral</SectionTitle>
    <WorkItem>
      <WorkTitle>Backend Engineer - Adsviu</WorkTitle>
      <WorkDetails>oct. 2022 - abr. 2024 · 1 año 7 meses</WorkDetails>
      <WorkDetails>Contribución al desarrollo de proyectos como NoFakes, una plataforma de revisión de reseñas de negocios, 
        Adsviu, un servidor de publicidad contextual basado en Machine Learning, y Multimarkts, una plataforma integral 
        para publicidad contextual. Utilizando Node.js, Docker y otras tecnologías para optimizar la entrega de anuncios 
        y maximizar la efectividad de las campañas publicitarias.</WorkDetails>
    </WorkItem>
    <WorkItem>
      <WorkTitle>Full Stack Developer - Wealize</WorkTitle>
      <WorkDetails>nov. 2019 - oct. 2022 · 3 años</WorkDetails>
      <WorkDetails>Córdoba y alrededores, España</WorkDetails>
    </WorkItem>
    <WorkItem>
      <WorkTitle>Software Developer - TangramBPM</WorkTitle>
      <WorkDetails>abr. 2017 - nov. 2019 · 2 años 8 meses</WorkDetails>
    </WorkItem>
    <WorkItem>
      <WorkTitle>Software Developer - Hospital Reina Sofía</WorkTitle>
      <WorkDetails>may. 2011 - jul. 2011 · 3 meses</WorkDetails>
      <WorkDetails>Prácticas en Hospital Reina Sofía, participando en el desarrollo de una aplicación web para la gestión de los 
        pacientes de la UCI.</WorkDetails>
    </WorkItem>
    <WorkItem>
      <WorkTitle>Database Administrator - Onda Pasión</WorkTitle>
      <WorkDetails>may. 2009 - jul. 2009 · 3 meses</WorkDetails>
    </WorkItem>
  </SectionContainer>
);

export default Work;