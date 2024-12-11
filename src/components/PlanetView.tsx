import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Entity {
  id: number;
  position: [number, number];
  energy: number;
  age: number;
}

interface PlanetViewProps {
  entities: Entity[];
  foodMap: number[][];
}

const PlanetView: React.FC<PlanetViewProps> = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [foodMap, setFoodMap] = useState<number[][]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.entities && Array.isArray(data.entities)) {
        setEntities(data.entities);
      }
      if (data && data.food_map && Array.isArray(data.food_map)) {
        setFoodMap(data.food_map);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (meshRef.current && foodMap.length > 0) {
      const geometry = meshRef.current.geometry as THREE.SphereGeometry;
      const positionAttribute = geometry.getAttribute('position');
      const colors = [];

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        vertex.normalize();

        const lat = Math.acos(vertex.y) / Math.PI;
        const lon = (Math.atan2(vertex.z, vertex.x) / Math.PI + 1) / 2;

        const x = Math.floor(lon * foodMap.length);
        const y = Math.floor(lat * foodMap[0].length);

        const color = foodMap[x][y] ? new THREE.Color(0x00ff00) : new THREE.Color(0x0000ff);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }
  }, [foodMap]);

  return (
    <mesh ref={meshRef} position={[500, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} />
      <meshStandardMaterial vertexColors />
      {entities.map((entity) => (
        <mesh key={entity.id} position={[entity.position[0] / 10 - 5, entity.position[1] / 10 - 5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={0xff0000} />
        </mesh>
      ))}
    </mesh>
  );
};

export default PlanetView;
