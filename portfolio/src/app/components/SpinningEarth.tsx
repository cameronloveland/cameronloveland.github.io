"use client";

import React from "react";
import { Stars, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import AuroraGlow from "./AuroraGlow";

type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

function Earth() {
    const earthTexture = useTexture("/earth-texture.jpg");

    return (
        // Earth's actual axial tilt is about 23.5 degrees (~0.41 radians)
        <mesh rotation={[0.41, 0, 0]}>
            {/* Smaller radius */}
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial map={earthTexture} transparent={false} opacity={1} />
        </mesh>
    );
}

export default function SpinningEarth({ offset }: SpinningEarthProps) {
    return (
        <div
            className="fixed left-1/2 bottom-0 pointer-events-none z-0"
            style={{
                width: "120vw",      // Slightly wider than viewport
                height: "60vw",      // Height based on width for a rounder field, adjust as needed
                minHeight: "60vh",   // Ensures enough height on short screens
                maxHeight: "90vh",   // Prevents overflow on tall screens
                transform: "translateX(-50%) translateY(20%)", // center horizontally
            }}
        >
            <Canvas camera={{ position: [0, -0.2, 1.6], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    {/* Earth is fixed at the bottom center, only top half visible */}
                    <group position={[
                        -(offset?.x * 0.05 || 0), // invert X for mirrored horizontal movement
                        -0.9 - (offset?.y * 0.3 || 0), // invert Y for mirrored vertical movement
                        0
                    ]}>
                        <Earth />
                        <AuroraGlow />
                    </group>
                    <Stars radius={300} depth={100} count={500} factor={6} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.05} />
            </Canvas>
        </div>
    );
}