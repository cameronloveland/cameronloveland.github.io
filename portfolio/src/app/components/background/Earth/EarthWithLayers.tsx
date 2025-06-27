"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import GlowSphere from "./GlowSphere";
import { Select } from "@react-three/postprocessing";

export default function EarthWithLayers() {
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
            <Select enabled>
                <GlowSphere />
            </Select>

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