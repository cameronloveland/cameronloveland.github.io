"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function AtmosphereRing() {
    const material = useMemo(() => {
        const m = new THREE.ShaderMaterial({
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
                    float dist = length(vUv - 0.5);
                    float alpha = smoothstep(0.5, 0.3, dist);
                    gl_FragColor = vec4(color, alpha * 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        m.toneMapped = false;
        return m;
    }, []);

    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.05, 1.3, 64]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
