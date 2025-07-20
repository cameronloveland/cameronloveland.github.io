"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ScanSweep({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current && active) {
      ref.current.rotation.y = clock.getElapsedTime() * 2;
    }
  });

  if (!active) return null;
  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <ringGeometry args={[1.05, 1.08, 64]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
    </mesh>
  );
}
