"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";

import { Bloom, EffectComposer } from "@react-three/postprocessing";


import EarthWithLayers from "./EarthWithLayers";


type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
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
            <Canvas camera={{ position: [0, -0.2, 2.2], fov: 45 }}

                onCreated={({ camera }) => {
                    camera.layers.enable(0); // default
                    camera.layers.enable(1); // glow layer

                }}>
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        luminanceThreshold={0.5}
                        luminanceSmoothing={0.5}
                        intensity={0}
                    />
                </EffectComposer>

                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <group
                        scale={0.4} // smaller than 1 makes it smaller
                        position={[
                            -(offset?.x * 0.05 || 0),
                            0 - (offset?.y * 1.5 || 0), // more negative = lower
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
