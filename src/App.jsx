// App.jsx

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { data } from './data'
import { Tubes, createBrainCurves } from './BrainTubes'
import BrainParticles from './BrainParticles' // Importa el componente BrainParticles
import * as THREE from 'three'

// Verificar si data.economics y data.economics[0] están definidos
const PATHS = data.economics && data.economics[0] ? data.economics[0].paths || [] : []
const brainCurves = createBrainCurves(PATHS)

export default function App() {
  return (
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
      <OrbitControls />
    </Canvas>
  )
}
