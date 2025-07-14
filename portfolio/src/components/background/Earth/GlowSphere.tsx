"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function GlowSphere() {
    const glowMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color("#4fc3f7") },
                rimPower: { value: 1.5 }, // Lower for wider, more visible glow
            },
            vertexShader: `
                varying float vRim;
                void main() {
                    vec3 vNormalView = normalize(normalMatrix * normal);
                    vRim = 1.0 - abs(vNormalView.z);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float rimPower;
                varying float vRim;
                void main() {
                    float rim = pow(vRim, rimPower);
                    gl_FragColor = vec4(glowColor, rim * 1.2); // Increased opacity
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
        });
    }, []);

    return (
        <mesh layers={1}>
            <sphereGeometry args={[1.08, 128, 128]} />
            <primitive object={glowMaterial} attach="material" />
        </mesh>
    );
}
