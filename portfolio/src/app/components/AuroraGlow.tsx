'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, ShaderMaterial, Vector3 } from 'three';

interface AuroraGlowProps {
  radius?: number;        // Scale of the aurora sphere relative to the earth
  intensity?: number;     // Multiplier for glow brightness
  fade?: number;          // Controls how quickly the glow fades
  color?: string | number; // Color of the aurora
}

export default function AuroraGlow({
  radius = 1.05,
  intensity = 0.8,
  fade = 1.5,
  color = '#50fcd5',
}: AuroraGlowProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { camera } = useThree();

  // Update view vector each frame so rim lighting responds to camera
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.viewVector.value.copy(camera.position);
    }
  });

  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        side={BackSide}
        blending={AdditiveBlending}
        uniforms={{
          glowColor: { value: new Color(color) },
          viewVector: { value: new Vector3() },
          intensity: { value: intensity },
          fade: { value: fade },
        }}
        vertexShader={`
          uniform vec3 viewVector;
          uniform float intensity;
          uniform float fade;
          varying float vIntensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 viewDir = normalize(viewVector - (modelViewMatrix * vec4(position, 1.0)).xyz);
            vIntensity = intensity * pow(1.0 - dot(vNormal, viewDir), fade);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          varying float vIntensity;
          void main() {
            gl_FragColor = vec4(glowColor * vIntensity, vIntensity);
          }
        `}
      />
    </mesh>
  );
}
