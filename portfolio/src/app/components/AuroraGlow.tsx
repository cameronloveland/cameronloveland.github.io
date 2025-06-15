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

/**
 * AuroraGlow renders a soft atmospheric rim around the Earth.
 *
 * - `radius` controls how far the glow sits from the surface.
 *   Increase it for a larger cinematic aura.
 * - `intensity` adjusts the brightness.
 * - `fade` determines how quickly the glow falls off.
 * - `color` sets the glow tint.
 */
export default function AuroraGlow({
  radius = 1.15,
  intensity = 1.2,
  fade = 2.5,
  color = '#55aaff',
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
