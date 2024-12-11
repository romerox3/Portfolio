import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PlanetView from './PlanetView';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
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
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const ProjectItem = styled.div`
  margin-bottom: 30px;
  transition: all 0.3s ease;
  padding: 15px;
  border-radius: 10px;

  &:hover {
    background-color: rgba(0, 255, 255, 0.1);
    transform: scale(1.03);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const ProjectDescription = styled.p`
  font-size: 1.1em;
  margin-bottom: 5px;
`;

const CarouselContainer = styled.div<{ show: boolean }>`
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(20px)'};
  .slick-prev, .slick-next {
    color: #00ffff;
    &:before {
      color: #00ffff;
    }
  }
`;

const PlanetViewContainer = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(20px)'};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
`;

const Projects = () => {
  const [showPlanet, setShowPlanet] = useState(false);
  const [planetData, setPlanetData] = useState<{ entities: any[], foodMap: number[][] } | null>(null);

  useEffect(() => {
    if (showPlanet && !planetData) {
      setPlanetData({
        entities: [
          { id: 1, position: [0.5, 0.5], energy: 100, age: 10 },
          { id: 2, position: [0.7, 0.3], energy: 80, age: 5 },
        ],
        foodMap: Array(100).fill(Array(100).fill(0).map(() => Math.random() > 0.5 ? 1 : 0)),
      });
    }
  }, [showPlanet, planetData]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <SectionContainer>
      <SectionTitle>Proyectos</SectionTitle>
      <PlanetViewContainer show={showPlanet}>
        {planetData && <PlanetView entities={planetData.entities} foodMap={planetData.foodMap} />}
      </PlanetViewContainer>
      <CarouselContainer show={!showPlanet}>
        <Slider {...settings}>
          <ProjectItem>
            <ProjectTitle>Zoenia World</ProjectTitle>
            <ProjectDescription>
              Un mundo virtual donde entidades autónomas evolucionan y aprenden utilizando inteligencia artificial.
            </ProjectDescription>
          </ProjectItem>
          <ProjectItem>
            <ProjectTitle>Portfolio 3D</ProjectTitle>
            <ProjectDescription>
              Un portfolio interactivo en 3D utilizando Three.js y React para mostrar proyectos y habilidades de una manera única.
            </ProjectDescription>
          </ProjectItem>
          <ProjectItem>
            <ProjectTitle>Legendary Forge</ProjectTitle>
            <ProjectDescription>
              Un juego de rol y estrategia donde los jugadores crean y gestionan su propia forja.
            </ProjectDescription>
          </ProjectItem>
        </Slider>
      </CarouselContainer>
    </SectionContainer>
  );
};

export default Projects;