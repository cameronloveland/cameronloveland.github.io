"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { EffectComposer, Selection, SelectiveBloom } from "@react-three/postprocessing";


import EarthWithLayers from "./EarthWithLayers";


type Offset = {
    x: number;
    y: number;
};

interface SpinningEarthProps {
    offset: Offset;
}

export default function SpinningEarth({ offset }: SpinningEarthProps) {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    const bloomLights = useMemo(() => [lightRef], []);
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
                <Selection>
                    <EffectComposer>
                        <SelectiveBloom
                            selectionLayer={1}
                            luminanceThreshold={0.5}
                            luminanceSmoothing={0.5}
                            intensity={0.6}
                            mipmapBlur
                            lights={bloomLights}
                        />
                    </EffectComposer>

                    <ambientLight intensity={0.4} />
                    <directionalLight ref={lightRef} position={[5, 5, 5]} intensity={1} />

                    <Suspense fallback={null}>
                        <group
                            scale={0.4} // smaller than 1 makes it smaller
                            position={[
                                -(offset?.x * 0.05 || 0),
                                0 - (offset?.y * 0.15 || 0), // more negative = lower
                                0,
                            ]}
                        >
                            <EarthWithLayers />
                        </group>

                        <Stars radius={100} depth={500} count={1000} factor={6} />
                    </Suspense>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.05} />
                </Selection>
            </Canvas>
        </div>
    );
}
