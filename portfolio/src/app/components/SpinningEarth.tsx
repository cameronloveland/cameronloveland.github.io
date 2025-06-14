"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

function EarthWithLayers() {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    const [dayMap, nightMap, cloudMap] = useTexture([
        "/textures/earth.png",
        "/textures/earth-night.png",
        "/textures/earth-clouds.png",
    ]);

    // Animate rotation
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) earthRef.current.rotation.y = t * 0.05;
        if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.03;
    });

    return (
        <group rotation={[0.41, 0, 0]}>
            {/* Earth - day texture */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial map={dayMap} />
            </mesh>

            {/* Night lights overlay */}
            <mesh>
                <sphereGeometry args={[1.01, 64, 64]} />
                <meshBasicMaterial
                    map={nightMap}
                    transparent
                    blending={THREE.AdditiveBlending}
                    opacity={0.5}
                />
            </mesh>

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
        </group>
    );
}

export default function SpinningEarth({ offset }: SpinningEarthProps) {
    return (
        <div
            className="fixed left-1/2 bottom-0 pointer-events-none z-0"
            style={{
                width: "120vw",
                height: "60vw",
                minHeight: "60vh",
                maxHeight: "90vh",
                transform: "translateX(-50%) translateY(20%)",
            }}
        >
            <Canvas camera={{ position: [0, -0.2, 1.6], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <group
                        position={[
                            -(offset?.x * 0.05 || 0),
                            -0.9 - (offset?.y * 0.3 || 0),
                            0,
                        ]}
                    >
                        <EarthWithLayers />
                    </group>
                    <Stars radius={300} depth={100} count={500} factor={6} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.05} />
            </Canvas>
        </div>
    );
}
