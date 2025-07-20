"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import EarthWithLayers from "./EarthWithLayers";

type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

export default function SpinningEarth({ offset }: SpinningEarthProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                width: isMobile ? "100vw" : "150vw",
                height: isMobile ? "100vh" : "150vh",
                left: isMobile ? "0" : "-25vw",
                top: isMobile ? "0" : "-25vh",
            }}
        >
            <Canvas camera={{ position: [0, -0.2, 2.2], fov: 45 }}
                onCreated={({ camera }) => {
                    camera.layers.enable(0); // default
                    camera.layers.enable(1); // glow layer
                }}>
                <ambientLight intensity={1.4} />
                <directionalLight position={[0.8, 1.1, -0.7]} intensity={1} />
                <Suspense fallback={null}>
                    <group
                        scale={isMobile ? 0.35 : 0.4}
                        position={[
                            -(offset?.x * 0.05 || 0),
                            0 - (offset?.y * 0.15 || 0),
                            0,
                        ]}
                    >
                        <EarthWithLayers />
                    </group>
                    <Stars radius={100} depth={500} count={1000} factor={6} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.03} />
            </Canvas>
        </div>
    );
}
