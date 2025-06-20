"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import AtmosphereRing from "./AtmosphereRing";


type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

function GlowSphere() {
    return (
        <>
            {/* Inner faint halo */}
            <mesh>
                <sphereGeometry args={[1.01, 64, 64]} />
                <meshBasicMaterial
                    color="#4fc3f7"
                    transparent
                    opacity={0.03}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Middle diffused glow */}
            <mesh>
                <sphereGeometry args={[1.03, 256, 256, 60, 85]} />
                <meshBasicMaterial
                    color="#4fc3f7"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Outer haze */}
            {/* <mesh>
                <sphereGeometry args={[1.35, 64, 64]} />
                <meshBasicMaterial
                    color="#4fc3f7"
                    transparent
                    opacity={0.015}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh> */}
        </>
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
            {/* Equatorial atmospheric ring */}
            <AtmosphereRing />


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
                width: "100vw",       // Match viewport width
                height: "100vh",      // Match viewport height
                left: "0",
                top: "0",
            }}
        >
            <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} onCreated={({ camera }) => {
                camera.layers.enable(0); // default
                camera.layers.enable(1); // glow layer
            }}>
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}
                        luminanceSmoothing={0.5}
                        intensity={0.9}
                    />
                </EffectComposer>

                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <group
                        scale={0.72}
                        position={[
                            0,           // Center horizontally
                            -0.8,        // Lower the earth (negative y moves it down)
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
