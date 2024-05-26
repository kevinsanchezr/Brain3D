import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { data } from './Threebrain/data';
import { Tubes, createBrainCurves } from './Threebrain/BrainTubes';
import BrainParticles from './Threebrain/BrainParticles';
import SpaceParticles from './SpaceParticles';
import OverlayText from './components/OverlayText';
import CameraController from './components/CameraController';
import useMousePosition from './components/MouseHandler';


const PATHS = data.economics && data.economics[0] ? data.economics[0].paths || [] : [];
const brainCurves = createBrainCurves(PATHS);

export default function App() {
  const mousePosition = useMousePosition();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }}>
        <color attach="background" args={["black"]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {brainCurves.length > 0 && (
          <>
            <Tubes allthecurves={brainCurves} />
            <BrainParticles allthecurves={brainCurves} speedMultiplier={0.09} />
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
