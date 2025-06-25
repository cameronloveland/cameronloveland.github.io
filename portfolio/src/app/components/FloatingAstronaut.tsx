"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const astroRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleParallax = (e: Event) => {
            if (!astroRef.current) return;

            const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;

            const moveX = x * 20;
            const moveY = y * 20;
            const rotateX = y * -10;
            const rotateY = x * 10;

            astroRef.current.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
        };

        document.addEventListener("earthParallax", handleParallax as EventListener);
        return () => document.removeEventListener("earthParallax", handleParallax as EventListener);
    }, []);

    return (
        <div className="astronaut-wrapper">
            <Image
                src="/worried-astronaut.png"
                alt="Floating Astronaut"
                width={220}
                height={220}
                ref={astroRef}
            />
            <div className="thruster-flame" />
        </div>

    );
}
