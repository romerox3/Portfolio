import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { AnimationState } from '../types';

const INITIAL_BLACK_HOLE_SIZE = 0.1;
const BLACK_HOLE_GROWTH_RATE = 0.01;
const ATTRACTION_POWER = 1;
const CENTRAL_STAR_MAX_SIZE = 10;
const SUPERNOVA_DURATION = 5; // segundos
const SCHWARZSCHILD_RADIUS = 2; // Radio de Schwarzschild para efectos visuales
const ANIMATION_SPEED = 0.1;
const G = 6.67430e-11; // Constante gravitacional

export const useGalaxyAnimation = (particleCount: number, galaxyRadius: number) => {
  const [animationState, setAnimationState] = useState(AnimationState.INITIAL_ROTATION);
  const [blackHoleSize, setBlackHoleSize] = useState(INITIAL_BLACK_HOLE_SIZE);
  const [absorbedMass, setAbsorbedMass] = useState(0);
  const [centralStarSize, setCentralStarSize] = useState(5);
  const [supernovaProgress, setSupernovaProgress] = useState(0);
  const [blackHoleInitialized, setBlackHoleInitialized] = useState(false);
  const startTime = useRef(Date.now());

  const updateAnimation = useCallback((time: number, elapsedTime: number, absorbed: number) => {
    setAbsorbedMass(prev => prev + absorbed);
    if (animationState === AnimationState.INITIAL_ROTATION) {
      if (elapsedTime > 20) {
        setAnimationState(AnimationState.CENTRAL_STAR_GROWTH);
      }
    } else if (animationState === AnimationState.CENTRAL_STAR_GROWTH) {
      setCentralStarSize(prev => Math.min(prev + 0.05, CENTRAL_STAR_MAX_SIZE));
      if (centralStarSize >= CENTRAL_STAR_MAX_SIZE) {
        setAnimationState(AnimationState.SUPERNOVA_EXPLOSION);
      }
    } else if (animationState === AnimationState.SUPERNOVA_EXPLOSION) {
      setSupernovaProgress(prev => Math.min(prev + 1 / (60 * SUPERNOVA_DURATION), 1));
      if (supernovaProgress >= 1) {
        setAnimationState(AnimationState.BLACK_HOLE_FORMATION);
      }
    } else if (animationState === AnimationState.BLACK_HOLE_FORMATION) {
      setBlackHoleSize(prev => prev + BLACK_HOLE_GROWTH_RATE * (1 + absorbedMass / 10000 / particleCount));
    }
  }, [animationState, centralStarSize, supernovaProgress, absorbedMass, particleCount]);

  const updateParticles = useCallback((positions: Float32Array, velocities: Float32Array, sizes: Float32Array, opacities: Float32Array, proximities: Float32Array, time: number) => {
    let absorbed = 0;
    const center = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      if (i3 + 2 >= positions.length || i3 + 2 >= velocities.length) break;

      const particlePosition = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      const particleVelocity = new THREE.Vector3(velocities[i3], velocities[i3 + 1], velocities[i3 + 2]);

      const radius = particlePosition.length();
      const angle = Math.atan2(particlePosition.z, particlePosition.x);
      const newAngle = angle + time * 0.1 * ANIMATION_SPEED * (1 / (radius + 1));

      particlePosition.x = Math.cos(newAngle) * radius;
      particlePosition.z = Math.sin(newAngle) * radius;


      // Rotación diferencial alrededor del eje Y
      const distanceToCenter = Math.sqrt(particlePosition.x * particlePosition.x + particlePosition.z * particlePosition.z);
      const baseRotationSpeed = 0.001; // Velocidad base de rotación
      const rotationSpeed = baseRotationSpeed * Math.pow(galaxyRadius / (distanceToCenter + 1), 0.5);
      
      const cosTheta = Math.cos(rotationSpeed);
      const sinTheta = Math.sin(rotationSpeed);
      
      const x = particlePosition.x * cosTheta - particlePosition.z * sinTheta;
      const z = particlePosition.x * sinTheta + particlePosition.z * cosTheta;

      particlePosition.x = x;
      particlePosition.z = z;
      
      // Añadir una pequeña perturbación aleatoria
      particlePosition.x += (Math.random() - 0.5) * 0.01;
      particlePosition.y += (Math.random() - 0.5) * 0.01;
      particlePosition.z += (Math.random() - 0.5) * 0.01;


      if (animationState === AnimationState.BLACK_HOLE_FORMATION) {
        if (!blackHoleInitialized) {
          const distanceToCenter = particlePosition.length();
          const pushThreshold = blackHoleSize * 10000; // Ajusta este valor según sea necesario
          
          if (distanceToCenter < pushThreshold) {
            const pushStrength = 1 - (distanceToCenter / pushThreshold);
            const pushDirection = particlePosition.clone().normalize();
            const pushForce = pushDirection.multiplyScalar(pushStrength * 3); // Ajusta el factor 0.01 para controlar la fuerza del empuje
            
            particleVelocity.add(pushForce);
          }
          setBlackHoleInitialized(true);
        }

        const distanceToCenter = particlePosition.distanceTo(center);
        
        // Factor de atracción basado en la distancia
        const attractionFactor = distanceToCenter * 0.1;
        
        // Dirección hacia el centro
        const directionToCenter = center.clone().sub(particlePosition).normalize();
        
        // Velocidad basada en la distancia al centro
        const speed = 0.0001 * attractionFactor;
        
        // Actualizar la velocidad de la partícula
        particleVelocity.lerp(directionToCenter.multiplyScalar(speed), 0.1);
        
        // Actualizar la posición de la partícula
        particlePosition.add(particleVelocity);
      
        const adjustedSchwarzschildRadius = SCHWARZSCHILD_RADIUS * blackHoleSize;
      
        if (distanceToCenter < adjustedSchwarzschildRadius) {
          // La partícula ha sido absorbida
          absorbed++;
      
          // Mover la partícula al centro (0,0,0) gradualmente
          particlePosition.lerp(center, 0.001);
      
          // Reducir la velocidad gradualmente
          particleVelocity.multiplyScalar(0.9);

        }

        // Calcula la proximidad basada en la distancia al centro
        const proximityThreshold = blackHoleSize * 2; // Ajusta este valor según sea necesario
        proximities[i] = Math.max(0, 1 - distanceToCenter / proximityThreshold);
      }

      positions[i3] = particlePosition.x;
      positions[i3 + 1] = particlePosition.y;
      positions[i3 + 2] = particlePosition.z;
      velocities[i3] = particleVelocity.x;
      velocities[i3 + 1] = particleVelocity.y;
      velocities[i3 + 2] = particleVelocity.z;
    }

    return absorbed;
  }, [animationState, blackHoleSize, particleCount, galaxyRadius]);

  return {
    animationState,
    blackHoleSize,
    absorbedMass,
    centralStarSize,
    supernovaProgress,
    updateParticles,
    updateAnimation,
    setAnimationState,
    startTime: startTime.current,
  };
};