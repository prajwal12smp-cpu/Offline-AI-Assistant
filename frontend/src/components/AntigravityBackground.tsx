import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Icosahedron, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

function FloatingObjects() {
  const { mouse, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle parallax effect responding to mouse
      const targetX = (mouse.x * viewport.width) / 20;
      const targetY = (mouse.y * viewport.height) / 20;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 2);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Purple wireframe Icosahedron */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron args={[1, 0]} position={[-3, 1, -5]}>
          <meshStandardMaterial color="#b129ff" wireframe opacity={0.6} transparent />
        </Icosahedron>
      </Float>

      {/* Cyan slightly glass torus */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Torus args={[0.8, 0.2, 16, 32]} position={[3, -2, -3]}>
          <meshStandardMaterial color="#00e5ff" transparent opacity={0.7} roughness={0.1} metalness={0.5} />
        </Torus>
      </Float>

      {/* Secondary glowing box */}
      <Float speed={1} rotationIntensity={1} floatIntensity={1.5}>
        <Box args={[1.2, 1.2, 1.2]} position={[1, 3, -8]}>
           <meshStandardMaterial color="#5544ff" wireframe />
        </Box>
      </Float>
      
      {/* Background large dim sphere */}
      <Float speed={0.5} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron args={[2, 1]} position={[-4, -3, -10]}>
          <meshStandardMaterial color="#9922ff" wireframe opacity={0.2} transparent />
        </Icosahedron>
      </Float>
    </group>
  );
}

export function AntigravityBackground() {
  return (
    <div className="absolute inset-0 -z-10 antialiased overflow-hidden pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
        <ambientLight intensity={0.4} />
        
        {/* Colorful lighting to enhance neon look */}
        <directionalLight position={[10, 10, 5]} intensity={2} color="#00d8ff" />
        <pointLight position={[-10, -10, -5]} intensity={3} color="#b129ff" />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        
        {/* Starfield */}
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={1.5} />
        
        <FloatingObjects />
      </Canvas>
      {/* Overlay to fade bottom into background color */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 bg-background/20" />
    </div>
  );
}
