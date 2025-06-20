"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

function GlowSphere() {
    const glowMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
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
                        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(glowColor, intensity);
                    }
                `,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true,
            }),
        []
    );

    return (
        <mesh>
            <sphereGeometry args={[1.05, 64, 64]} />
            <primitive object={glowMaterial} attach="material" />
        </mesh>
    );
}


function EarthWithLayers() {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    const [dayMap, cloudMap] = useTexture([
        "/textures/earth.png",
        "/textures/earth-clouds.png",
    ]);

    // Animate rotation
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) earthRef.current.rotation.y = t * 0.01;
        if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.03;
    });

    return (
        <group rotation={[0.41, 0, 0]}>
            {/* Glow effect around the Earth */}
            <GlowSphere />


            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[1.02, 64, 64]} />
                <meshPhongMaterial
                    map={cloudMap}
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                />
            </mesh>

            {/* Earth - main sphere */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial map={dayMap} />
            </mesh>
        </group>
    );
}

export default function SpinningEarth({ offset }: SpinningEarthProps) {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                width: "150vw",       // Wider than the screen
                height: "150vh",      // Taller than the screen
                left: "-25vw",        // Center horizontally
                top: "-25vh",         // Center vertically
            }}
        >
            <Canvas camera={{ position: [0, -0.2, 2.2], fov: 45 }} onCreated={({ camera }) => {
                camera.layers.enable(0); // default
                camera.layers.enable(1); // glow layer
            }}>
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}  // even faint tones glow
                        luminanceSmoothing={0.5}   // soften edge transitions
                        intensity={0.9}            // gentle strength
                    />
                </EffectComposer>

                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <group
                        scale={0.8} // smaller than 1 makes it smaller
                        position={[
                            -(offset?.x * 0.05 || 0),
                            -1.1 - (offset?.y * 0.3 || 0), // more negative = lower
                            0,
                        ]}
                    >
                        <EarthWithLayers />
                    </group>

                    <Stars radius={100} depth={500} count={1000} factor={6} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.05} />
            </Canvas>
        </div>
    );
}
