"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const astroRef = useRef<HTMLImageElement>(null);
    const [isLaunching, setIsLaunching] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!astroRef.current || isLaunching) return;

            const { innerWidth, innerHeight } = window;
            const offsetX = (e.clientX - innerWidth / 2) / innerWidth;
            const offsetY = (e.clientY - innerHeight / 2) / innerHeight;

            const moveX = offsetX * -20;
            const moveY = offsetY * -20;
            const rotateX = offsetY * -10;
            const rotateY = offsetX * -10;

            astroRef.current.style.transform = `
        translate(${moveX}px, ${moveY}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
        };

        if (!isLaunching) {
            window.addEventListener("mousemove", handleMouseMove);
        }
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isLaunching]);

    const handleClick = () => {
        if (!astroRef.current || isLaunching) return;
        setIsLaunching(true);
        astroRef.current.style.transition = "transform 0.6s ease-out";
        astroRef.current.style.transform = "translateY(-100vh) rotate(-20deg) scale(1.2)";

        setTimeout(() => {
            if (!astroRef.current) return;
            astroRef.current.style.transition = "transform 1s ease-in";
            astroRef.current.style.transform = "";

            setTimeout(() => {
                setIsLaunching(false);
            }, 1000);
        }, 600);
    };

    return (
        <div className="astronaut-wrapper" onClick={handleClick}>
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
