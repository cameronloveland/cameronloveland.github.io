"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const astroRef = useRef<HTMLImageElement>(null);
    const [isLaunching, setIsLaunching] = useState(false);

    const spawnParticles = () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const puff = document.createElement("div");
            puff.className = "steam-puff";
            const dx = (Math.random() - 0.5) * 10; // -5 to 5px
            const dy = -30 - Math.random() * 20; // -30px to -50px
            puff.style.setProperty("--dx", `${dx}px`);
            puff.style.setProperty("--dy", `${dy}px`);
            wrapper.appendChild(puff);
            setTimeout(() => puff.remove(), 800);
        }
    };

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
        spawnParticles();

        astroRef.current.style.transition = "transform 0.6s ease-in-out";
        const y = -20 - Math.random() * 40; // -20vh to -60vh
        const r = (Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1);
        const s = 1.1 + Math.random() * 0.3; // scale between 1.1 and 1.4
        astroRef.current.style.transform = `translateY(${y}vh) rotate(${r}deg) scale(${s})`;

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
        <div className="astronaut-wrapper" onClick={handleClick} ref={wrapperRef}>
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
