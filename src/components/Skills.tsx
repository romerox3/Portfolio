import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotateIn = keyframes`
  from { transform: rotateY(-90deg); opacity: 0; }
  to { transform: rotateY(0); opacity: 1; }
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
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`;

const SkillItem = styled.div`
  background-color: rgba(0, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  animation: ${rotateIn} 0.5s ease-out;
  animation-fill-mode: both;

  &:hover {
    transform: scale(1.1) rotateY(360deg);
    background-color: rgba(0, 255, 255, 0.2);
  }
`;

const Skills = () => {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Three.js',
    'HTML5', 'CSS3', 'Python', 'Docker', 'Git', 'SQL', 'NoSQL',
    'RESTful APIs', 'GraphQL', 'AWS', 'CI/CD', 'Agile Methodologies'
  ];

  return (
    <SectionContainer>
      <SectionTitle>Habilidades</SectionTitle>
      <SkillsContainer>
        {skills.map((skill, index) => (
          <SkillItem key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {skill}
          </SkillItem>
        ))}
      </SkillsContainer>
    </SectionContainer>
  );
};

export default Skills;