"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const astroRef = useRef<HTMLImageElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!astroRef.current || isAnimating) return;

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

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isAnimating]);

    const handleClick = () => {
        if (!astroRef.current || isAnimating) return;
        const el = astroRef.current;
        setIsAnimating(true);
        el.style.transition = "transform 0.4s ease-in";
        el.style.transform = "translateY(-100vh) rotate(-20deg) scale(1.2)";

        setTimeout(() => {
            if (!astroRef.current) return;
            el.style.transition = "transform 0.6s ease-out";
            el.style.transform = "translateY(0) rotate(0deg) scale(1)";

            setTimeout(() => {
                setIsAnimating(false);
            }, 600);
        }, 400);
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
