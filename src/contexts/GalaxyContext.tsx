import React, { createContext, useContext } from 'react';
import { useGalaxyAnimation } from '../hooks/useGalaxyAnimation';

const PARTICLE_COUNT = 100000;
export const GALAXY_RADIUS = 500;

const GalaxyContext = createContext<ReturnType<typeof useGalaxyAnimation> | null>(null);

export const GalaxyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const galaxyState = useGalaxyAnimation(PARTICLE_COUNT, GALAXY_RADIUS);
  return <GalaxyContext.Provider value={galaxyState}>{children}</GalaxyContext.Provider>;
};

export const useGalaxyContext = () => {
  const context = useContext(GalaxyContext);
  if (!context) {
    throw new Error('useGalaxyContext must be used within a GalaxyProvider');
  }
  return context;
};