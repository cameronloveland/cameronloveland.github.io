"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const astroRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!astroRef.current) return;

            const { innerWidth, innerHeight } = window;
            const offsetX = (e.clientX - innerWidth / 2) / innerWidth;
            const offsetY = (e.clientY - innerHeight / 2) / innerHeight;

            const moveX = offsetX * 20;
            const moveY = offsetY * 20;
            const rotateX = offsetY * -10;
            const rotateY = offsetX * 10;

            astroRef.current.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <Image
            src="/worried-astronaut.png"
            alt="Floating Astronaut"
            width={120}
            height={120}
            ref={astroRef}
            className="floating-astronaut"
        />
    );
}
