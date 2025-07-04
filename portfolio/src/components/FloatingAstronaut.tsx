"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
<<<<<<< HEAD
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
=======
    const astroRef = useRef<HTMLImageElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
>>>>>>> 2572270cb837703fe3d1df99345cd6d36b08c390
    const [isLaunching, setIsLaunching] = useState(false);

    const spawnParticles = () => {
        const wrapper = containerRef.current;
        if (!wrapper) return;
        const count = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < count; i++) {
            const puff = document.createElement("div");
            puff.className = "steam-puff";

            const angle = Math.random() * 2 * Math.PI;
            const distance = 40 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const scale = 0.9 + Math.random() * 0.5;
            const rotation = Math.random() * 360;

            puff.style.position = "absolute";
            puff.style.top = "50%";
            puff.style.left = "50%";
            puff.style.width = "6px";
            puff.style.height = "40px";
            puff.style.borderRadius = "50% 50% 20% 20%";
            puff.style.background = "linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(100, 180, 255, 0.6), rgba(50, 120, 255, 0.1))";
            puff.style.filter = "blur(1px) drop-shadow(0 0 6px rgba(150, 220, 255, 0.6))";
            puff.style.pointerEvents = "none";
            puff.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`;
            puff.style.opacity = "0.7";
            puff.style.animation = "jetPuff 0.4s ease-out forwards";
            puff.style.zIndex = "-1";
            puff.style.transformOrigin = "center center";

            wrapper.appendChild(puff);
            setTimeout(() => puff.remove(), 800);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || isLaunching) return;

            const { innerWidth, innerHeight } = window;
            const offsetX = (e.clientX - innerWidth / 2) / innerWidth;
            const offsetY = (e.clientY - innerHeight / 2) / innerHeight;

            const moveX = offsetX * -20;
            const moveY = offsetY * -20;
            const rotateX = offsetY * -10;
            const rotateY = offsetX * -10;

            containerRef.current.style.transform = `
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

    const spawnParticles = () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const puff = document.createElement("div");
            puff.className = "steam-puff";

            const offset = (Math.random() - 0.5) * 6; // -3px to +3px
            Object.assign(puff.style, {
                left: `calc(50% + ${offset}px)`
            });

            wrapper.appendChild(puff);

            setTimeout(() => puff.remove(), 800);
        }
    };

    const handleClick = () => {
<<<<<<< HEAD
        if (!containerRef.current || isLaunching) return;
=======
        if (!astroRef.current || isLaunching) return;
        spawnParticles();
>>>>>>> 2572270cb837703fe3d1df99345cd6d36b08c390
        setIsLaunching(true);
<<<<<<< Updated upstream

        astroRef.current.style.transition = "transform 0.6s ease-in-out";
        const y = -20 - Math.random() * 40; // -20vh to -60vh
        const r = (Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1);
        const s = 1.1 + Math.random() * 0.3; // scale between 1.1 and 1.4
        astroRef.current.style.transform = `translateY(${y}vh) rotate(${r}deg) scale(${s})`;
=======
        spawnParticles();

        containerRef.current.style.transition = "transform 0.6s ease-in-out";
        const y = -20 - Math.random() * 40; // -20vh to -60vh
        const r = (Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1);
        const s = 1.1 + Math.random() * 0.3; // scale between 1.1 and 1.4
        containerRef.current.style.transform = `translateY(${y}vh) rotate(${r}deg) scale(${s})`;
>>>>>>> Stashed changes

        setTimeout(() => {
            if (!containerRef.current) return;
            containerRef.current.style.transition = "transform 1s ease-in";
            containerRef.current.style.transform = "";

            setTimeout(() => {
                setIsLaunching(false);
            }, 1000);
        }, 600);
    };

    return (
<<<<<<< HEAD
        <div className="astronaut-wrapper" onClick={handleClick}>
            <div className="astronaut" ref={containerRef}>
                <Image
                    src="/worried-astronaut.png"
                    alt="Floating Astronaut"
                    width={220}
                    height={220}
                    ref={imgRef}
                />
            </div>
=======
        <div className="astronaut-wrapper" onClick={handleClick} ref={wrapperRef}>
            <Image
                src="/worried-astronaut.png"
                alt="Floating Astronaut"
                width={220}
                height={220}
                ref={astroRef}
            />
            <div className="thruster-flame" />
>>>>>>> 2572270cb837703fe3d1df99345cd6d36b08c390
        </div>
    );
}
