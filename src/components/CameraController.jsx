import React from 'react';
import { useFrame } from '@react-three/fiber';

function CameraController({ mousePosition }) {
  useFrame(({ camera }) => {
    const factor = 0.001; 
    camera.position.x += (mousePosition.x * factor - camera.position.x) * 0.05;
    camera.position.y += (-mousePosition.y * factor - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default CameraController;
