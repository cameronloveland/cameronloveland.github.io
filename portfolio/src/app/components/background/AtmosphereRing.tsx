"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function AtmosphereRing() {
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color("#4fc3f7") },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - 0.5); // center of ring
          float ring = smoothstep(0.45, 0.4, dist) - smoothstep(0.5, 0.45, dist); // inner to outer edge
          float alpha = ring * 0.6;
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
        });
    }, []);

    return (
        <mesh rotation={[0, 0, 0]} position={[0, 0, 0.02]}>
            <ringGeometry args={[1.02, 1.3, 128]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
