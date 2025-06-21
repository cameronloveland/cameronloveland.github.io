"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Stars } from "@react-three/drei";
import { Object3D } from "three";

export default function Starfield() {
    const starsRef = useRef<Object3D>(null);

    useLayoutEffect(() => {
        if (starsRef.current) {
            starsRef.current.traverse((obj) => {
                obj.layers.set(0);
            });
        }
    }, []);

    return (
        <Stars
            ref={starsRef}
            radius={100}
            depth={500}
            count={1000}
            factor={6}
            fade
        />
    );
}
