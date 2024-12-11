import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGalaxyContext } from './contexts/GalaxyContext';
import { useAnimationEvents } from './hooks/useAnimationEvents';
import { createGalaxyGeometry, createJetGeometry } from './utils/geometryUtils';
import { starVertexShader, starFragmentShader } from './shaders/starShaders';
import { jetVertexShader, jetFragmentShader } from './shaders/jetShaders';
import { blackHoleVertexShader, blackHoleFragmentShader } from './shaders/blackHoleShaders';
import { AnimationState } from './types';
import PlanetView from './components/PlanetView';
import HUD from './components/HUD';
import Work from './components/Work';
import Studies from './components/Studies';
import Projects from './components/Projects';

const PARTICLE_COUNT = 100000;
const GALAXY_RADIUS = 1000;
const EVENT_HORIZON_RADIUS = 5;
const JET_HEIGHT = 1000;
const JET_RADIUS = 5;
const JET_PARTICLES = 5000;
const ANIMATION_SPEED = 0.05;
const TRANSITION_SPEED = 0.1;
const CENTRAL_STAR_SIZE = 5;
const SUPERNOVA_RADIUS = 10;
const SUPERNOVA_PROGRESS = 0.5;
const GALAXY_THICKNESS = 100; // Nueva constante para el grosor de la galaxia

const SECTIONS = {
  STUDIES: 'Estudios',
  WORK: 'Vida Laboral',
  PROJECTS: 'Proyectos',
  SKILLS: 'Habilidades',
  CONTACT: 'Contacto',
  PLANET: 'Planeta',
};

const SimpleStars = ({activeSection, setActiveSection}: {activeSection: string | null, setActiveSection: (section: string | null) => void}) => {
  const { camera } = useThree();
  const {
    animationState,
    blackHoleSize,
    absorbedMass,
    updateParticles,
    updateAnimation,
    setAnimationState,
    startTime,
  } = useGalaxyContext();

  useAnimationEvents(setAnimationState, startTime);

  const points = useRef<THREE.Points>(null);
  const blackHoleRef = useRef<THREE.Mesh>(null);
  const jetRef = useRef<THREE.Points>(null);
  const time = useRef(0);

  const centralStarRef = useRef<THREE.Mesh>(null);

  const whiteStarTexture = useLoader(THREE.TextureLoader, '/white_star.png');
  const redStarTexture = useLoader(THREE.TextureLoader, '/red_star.png');
  const blueStarTexture = useLoader(THREE.TextureLoader, '/blue_star.png');
  const yellowStarTexture = useLoader(THREE.TextureLoader, '/yellow_star.png');

  const { positions, sizes, textures, opacities, velocities, proximities } = useMemo(() => createGalaxyGeometry(PARTICLE_COUNT, GALAXY_RADIUS), []);
  const jetGeometry = useMemo(() => createJetGeometry(JET_PARTICLES, JET_HEIGHT, JET_RADIUS), []);

  const centralStarGeometry = useMemo(() => new THREE.SphereGeometry(2, 32, 32), []);
  const centralStarMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffff00 }), []);

  const blackHoleGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const blackHoleMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: blackHoleVertexShader,
    fragmentShader: blackHoleFragmentShader,
    side: THREE.FrontSide,
  }), []);

  useEffect(() => {
    let animationFrameId: number;
    if (activeSection && activeSection in SECTIONS) {
      const sectionPositions = {
        STUDIES: new THREE.Vector3(-100, 200, 0),
        WORK: new THREE.Vector3(-400, 50, 600),
        PROJECTS: new THREE.Vector3(0, 0, 100),
        SKILLS: new THREE.Vector3(-800, 0, 0),
        CONTACT: new THREE.Vector3(0, 700, 0),
        PLANET: new THREE.Vector3(550, 0, 0),
      };
      const targetPosition = sectionPositions[activeSection as keyof typeof sectionPositions];
      const startPosition = camera.position.clone();
      const startTime = Date.now();
      const duration = 2000; // Duración de la animación en milisegundos

      const animateCamera = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateCamera);
        }
      };

      animateCamera();
    } else {
      camera.lookAt(0, 0, 0);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeSection, camera, GALAXY_RADIUS]);

  // Función de easing para una animación más suave
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useFrame((state) => {
    time.current = state.clock.getElapsedTime();
    if (points.current) {
      const material = points.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.getElapsedTime();
      const geometry = points.current.geometry
      const positionAttribute = geometry.getAttribute('position');
      const sizeAttribute = geometry.getAttribute('size');
      const velocityAttribute = geometry.getAttribute('velocity');
      const opacityAttribute = geometry.getAttribute('opacity');

      if (positionAttribute && sizeAttribute && velocityAttribute && opacityAttribute) {
        const time = state.clock.getElapsedTime() * ANIMATION_SPEED;
        const elapsedTime = (Date.now() - startTime) / 1000 * TRANSITION_SPEED;

        const positions = positionAttribute.array as Float32Array;
        const sizes = sizeAttribute.array as Float32Array;
        const velocities = velocityAttribute.array as Float32Array;
        const opacities = opacityAttribute.array as Float32Array;

        const absorbed = updateParticles(positions, velocities, sizes, opacities, proximities, time);
        updateAnimation(time, elapsedTime, absorbed);

        positionAttribute.needsUpdate = true;
        sizeAttribute.needsUpdate = true;
        opacityAttribute.needsUpdate = true;
        velocityAttribute.needsUpdate = true;
      } else {
        console.warn('Algunos atributos de geometría no están disponibles');
      }
    } else {
      console.warn('points.current o geometry.attributes.position no están disponibles');
    }

    if (blackHoleRef.current) {
      blackHoleRef.current.scale.setScalar(blackHoleSize / EVENT_HORIZON_RADIUS);
    }

    if (centralStarRef.current) {
      if (animationState === AnimationState.CENTRAL_STAR_GROWTH) {
        centralStarRef.current.scale.setScalar(CENTRAL_STAR_SIZE / 5);
      } else if (animationState === AnimationState.SUPERNOVA_EXPLOSION) {
        centralStarRef.current.scale.setScalar((CENTRAL_STAR_SIZE + SUPERNOVA_PROGRESS * SUPERNOVA_RADIUS) / 5);
      } else if (animationState >= AnimationState.BLACK_HOLE_FORMATION) {
        centralStarRef.current.visible = false;
      }
    }

    if (jetRef.current && animationState === AnimationState.JET_FORMATION) {
      const jetPositions = jetRef.current.geometry.attributes.position.array as Float32Array;
      const jetOpacities = jetRef.current.geometry.attributes.opacity.array as Float32Array;
      // Actualizar posiciones y opacidades del chorro
      for (let i = 0; i < JET_PARTICLES * 2; i++) {
        const i3 = i * 3;
        jetPositions[i3 + 1] += (i < JET_PARTICLES ? 1 : -1) * 5 * ANIMATION_SPEED;
        if (jetPositions[i3 + 1] > JET_HEIGHT || jetPositions[i3 + 1] < -JET_HEIGHT) {
          jetPositions[i3 + 1] = 0;
        }
        jetOpacities[i] = Math.random();
      }
      jetRef.current.geometry.attributes.position.needsUpdate = true;
      jetRef.current.geometry.attributes.opacity.needsUpdate = true;
    }

    // Animación de la cámara
    if (!activeSection) {
      const elapsedTime = state.clock.getElapsedTime();
      const targetPosition = new THREE.Vector3(
        GALAXY_RADIUS * 0.6 * Math.cos(elapsedTime * 0.1),
        GALAXY_RADIUS * 0.3,
        GALAXY_RADIUS * 0.6 * Math.sin(elapsedTime * 0.1)
      );
      camera.position.lerp(targetPosition, 0.01);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-velocity" count={PARTICLE_COUNT} array={velocities} itemSize={3} />
          <bufferAttribute attach="attributes-texture" count={PARTICLE_COUNT} array={textures} itemSize={1} />
          <bufferAttribute attach="attributes-opacity" count={PARTICLE_COUNT} array={opacities} itemSize={1} />
          <bufferAttribute attach="attributes-proximity" count={PARTICLE_COUNT} array={proximities} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          fragmentShader={starFragmentShader}
          vertexShader={starVertexShader}
          uniforms={{
            time: { value: time.current },
            timeOffset: { value: 0 },
          }}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.01}
        />
      </points>
      <mesh ref={centralStarRef} geometry={centralStarGeometry} material={centralStarMaterial} />
      <mesh ref={blackHoleRef} geometry={blackHoleGeometry} material={blackHoleMaterial} />
      <points ref={jetRef}>
        <bufferGeometry {...jetGeometry} />
        <shaderMaterial
          fragmentShader={jetFragmentShader}
          vertexShader={jetVertexShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <PlanetView entities={[]} foodMap={[[]]} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
      </EffectComposer>
    </>
  );
};

export default SimpleStars;