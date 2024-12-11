import * as THREE from 'three';

export const createGalaxyGeometry = (particleCount: number, galaxyRadius: number) => {
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const textures = new Float32Array(particleCount);
  const opacities = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount * 3);
  const branchesCount = 8;
  const spinFactor = 2;
  const randomness = 0.4;
  const randomnessPower = 10;
  const centralBulgeSize = galaxyRadius * 4;
  const diskThickness = galaxyRadius * 0.02;
  const proximities = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * galaxyRadius;
    const spinAngle = radius * spinFactor;
    const branchAngle = ((i % branchesCount) / branchesCount) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
    const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
    const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Ajustar la altura (y) para crear un disco con más grosor en el centro
    const diskHeight = Math.exp(-radius / (galaxyRadius * 0.3)) * diskThickness;
    positions[i3 + 1] = (Math.random() - 0.5) * diskHeight + randomY;

    // Ajustar velocidades para la rotación
    const angle = Math.atan2(positions[i3 + 2], positions[i3]);
    velocities[i3] = -Math.sin(angle) * 0.1;
    velocities[i3 + 1] = 0;
    velocities[i3 + 2] = Math.cos(angle) * 0.1;

    // Ajustar tamaños y opacidades
    const distanceToCenter = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2);
    sizes[i] = Math.max(1.5, 4 * (1 - distanceToCenter / galaxyRadius));
    opacities[i] = Math.max(0.2, 1 - distanceToCenter / galaxyRadius);

    // Asignar texturas (colores) basadas en la posición
    const random = Math.random();
    if (random < 0.4) {
      textures[i] = 0;
    } else if (random < 0.7) {
      textures[i] = 1;
    } else if (random < 0.9) {
      textures[i] = 3;
    } else {
      textures[i] = 2;
    }

    proximities[i] = 0;
  }

  return { positions, sizes, textures, opacities, velocities, proximities };
};

export const createJetGeometry = (jetParticles: number, jetHeight: number, jetRadius: number) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(jetParticles * 2 * 3);
  const colors = new Float32Array(jetParticles * 2 * 3);
  const sizes = new Float32Array(jetParticles * 2);
  const opacities = new Float32Array(jetParticles * 2);
  const velocities = new Float32Array(jetParticles * 2 * 3);

  for (let i = 0; i < jetParticles * 2; i++) {
    const angle = Math.random() * Math.PI * 2;
    const height = Math.random() * jetHeight;
    const radius = Math.random() * jetRadius;
    const isUpperJet = i < jetParticles;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = isUpperJet ? height : -height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    velocities[i * 3] = Math.random() * 0.1;
    velocities[i * 3 + 1] = Math.random() * 0.1;
    velocities[i * 3 + 2] = Math.random() * 0.1;

    const color = new THREE.Color();
    color.setHSL(0.6, 1, 0.5 + Math.random() * 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = isUpperJet ? 2 : 1.5;
    opacities[i] = isUpperJet ? 0.01 : 0.005;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  return geometry;
};