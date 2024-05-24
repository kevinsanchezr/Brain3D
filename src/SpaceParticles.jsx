import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceParticles = ({ count = 1000 }) => {
  const particlesRef = useRef();
  const velocities = useRef(new Float32Array(count * 3));

  // Inicializar las posiciones y velocidades de las partículas
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    velocities.current[i * 3] = (Math.random() - 0.5) * 0.002;
    velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

    randoms[i] = Math.random();
  }

  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      particlesRef.current.geometry.setAttribute(
        'randoms',
        new THREE.BufferAttribute(randoms, 1)
      );
    }
  }, [positions, randoms]);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities.current[i * 3];
        positions[i * 3 + 1] += velocities.current[i * 3 + 1];
        positions[i * 3 + 2] += velocities.current[i * 3 + 2];

        // Reset position if particles go out of bounds
        if (positions[i * 3] > 5 || positions[i * 3] < -5) {
          positions[i * 3] = (Math.random() - 0.5) * 10;
        }
        if (positions[i * 3 + 1] > 5 || positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        }
        if (positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) {
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <shaderMaterial
        uniforms={{
          time: { value: 0 }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </points>
  );
};

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  attribute float randoms;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = randoms * 20.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  void main() {
    float disc = length(gl_PointCoord.xy - vec2(0.5));
    float opacity = 0.3 * smoothstep(0.5, 0.4, disc);
    gl_FragColor = vec4(vec3(1.0), opacity);
  }
`;

export default SpaceParticles;
