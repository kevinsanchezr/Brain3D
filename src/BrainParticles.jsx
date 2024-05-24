// BrainParticles.jsx

import React, { useEffect, useMemo, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Definir el material del shader para las partículas
const BrainParticleMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.1, 0.3, 0.6) },
  // vertex shader
  /* glsl */`
    varying vec2 vUv;
    uniform float time;
    varying float vProgress;
    attribute float randoms;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = randoms * 2. * (1. / -mvPosition.z); // Ajusta este valor para cambiar el tamaño de las partículas
    }
  `,
  // fragment shader
  /* glsl */`
    uniform float time;
    void main() {
      float disc = length(gl_PointCoord.xy - vec2(0.5));
      float opacity = 0.3 * smoothstep(0.5, 0.4, disc);
      gl_FragColor = vec4(vec3(opacity), 1.);
    }
  `
)

extend({ BrainParticleMaterial })

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

function BrainParticles({ allthecurves = [], speedMultiplier = 1 }) {
  const density = 10
  const numberOfPoints = density * allthecurves.length
  const myPoints = useRef([])
  const brainGeo = useRef()

  const positions = useMemo(() => {
    let positions = []
    for (let i = 0; i < numberOfPoints; i++) {
      positions.push(
        randomRange(-1, 1),
        randomRange(-1, 1),
        randomRange(-1, 1)
      )
    }
    return new Float32Array(positions)
  }, [numberOfPoints])


  let randoms = useMemo(() => {
    let randoms = []
    for (let i = 0; i < numberOfPoints; i++) {
      randoms.push(
        randomRange(0.3, 1.),
      )
    }
    return new Float32Array(randoms)
  }, [])



  useEffect(() => {
    for (let i = 0; i < allthecurves.length; i++) {
      for (let j = 0; j < density; j++) {
        myPoints.current.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.01 * speedMultiplier,
          curve: allthecurves[i]
        })
      }
    }
  }, [allthecurves, density, speedMultiplier])

  useFrame(() => {
    let curpositions = brainGeo.current.attributes.position.array;
    for (let i = 0; i < myPoints.current.length; i++) {
      myPoints.current[i].currentOffset += myPoints.current[i].speed;
      myPoints.current[i].currentOffset %= 1;
      let curPoint = myPoints.current[i].curve.getPointAt(myPoints.current[i].currentOffset);
      curpositions[i * 3] = curPoint.x;
      curpositions[i * 3 + 1] = curPoint.y;
      curpositions[i * 3 + 2] = curPoint.z;
    }
    brainGeo.current.attributes.position.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry attach="geometry" ref={brainGeo}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randoms"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <brainParticleMaterial
        attach="material"
        depthTest={false}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default BrainParticles
