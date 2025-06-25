"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function GlowSphere() {
    const glowMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color("#4fc3f7") },
            },
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(glowColor, intensity * 0.4); // softer ring
        }
      `,

            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            depthTest: true,
            toneMapped: false,
            side: THREE.BackSide,
        });
    }, []);

    return (
        <mesh layers={1} renderOrder={1}>
            {/* Slightly larger radius than clouds */}
            <sphereGeometry args={[1.06, 64, 64]} />
            <primitive object={glowMaterial} attach="material" />
        </mesh>
    );
}
