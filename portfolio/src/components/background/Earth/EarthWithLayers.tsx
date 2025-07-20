"use client";

import React, { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import GlowSphere from "./GlowSphere";
import ScanSweep from "./ScanSweep";

interface Props {
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
  scanning?: boolean;
}
export default function EarthWithLayers({ onPointerOver, onPointerOut, onPointerMove, scanning }: Props) {
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
        <group rotation={[0.41, 0, 0]} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onPointerMove={onPointerMove}>
            {/* Glow effect around the Earth */}
            <GlowSphere />
            <ScanSweep active={!!scanning} />

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