import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { data } from './data';
import { Tubes, createBrainCurves } from './BrainTubes';
import BrainParticles from './BrainParticles';
import SpaceParticles from './SpaceParticles';
import OverlayText from './OverlayText';
import * as THREE from 'three';
import './stylesText.css';

const PATHS = data.economics && data.economics[0] ? data.economics[0].paths || [] : [];
const brainCurves = createBrainCurves(PATHS);

function CameraController({ mousePosition }) {
  useFrame(({ camera }) => {
    const factor = 0.001; // Reduce this factor to make the movement more subtle and slow
    camera.position.x += (mousePosition.x * factor - camera.position.x) * 0.05;
    camera.position.y += (-mousePosition.y * factor - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX - window.innerWidth / 2, y: event.clientY - window.innerHeight / 2 });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }}>
        <color attach="background" args={["black"]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {brainCurves.length > 0 && (
          <>
            <Tubes allthecurves={brainCurves} />
            <BrainParticles allthecurves={brainCurves} speedMultiplier={0.1} />
          </>
        )}
        <SpaceParticles count={500} />
        <OrbitControls />
        <CameraController mousePosition={mousePosition} />
      </Canvas>
      <OverlayText />
    </div>
  );
}
