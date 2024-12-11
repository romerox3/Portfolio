import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import SimpleStars from './SimpleStars';
import { GalaxyProvider } from './contexts/GalaxyContext';
import './App.css';
import HUD from './components/HUD';
import Studies from './components/Studies';
import Work from './components/Work';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="App">
      <Canvas camera={{ position: [0, 6, 100], fov: 50, far: 3000 }}>
        <HUD setActiveSection={setActiveSection} activeSection={activeSection} />
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.41} />
        <Suspense fallback={null}>
          <Stars radius={1200}/>
          <GalaxyProvider>
            <SimpleStars setActiveSection={setActiveSection} activeSection={activeSection} />
          </GalaxyProvider>
        </Suspense>
      </Canvas>
      <div className="sections-container">
        {activeSection === 'STUDIES' && <Studies />}
        {activeSection === 'WORK' && <Work />}
        {activeSection === 'PROJECTS' && <Projects />}
        {activeSection === 'SKILLS' && <Skills />}
        {activeSection === 'CONTACT' && <Contact />}
      </div>
    </div>
  );
}

export default App;