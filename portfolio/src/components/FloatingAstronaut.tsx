"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const containerRef = useRef<HTMLDivElement>(null);
    const puffContainerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isLaunching, setIsLaunching] = useState(false);

    const spawnParticles = () => {
        const container = puffContainerRef.current;
        if (!container) return;

        const count = Math.floor(Math.random() * 3) + 3; // 3-5 puffs

        for (let i = 0; i < count; i++) {
            const puff = document.createElement("div");
            puff.className = "steam-puff";

            puff.style.position = "absolute";
            puff.style.top = "50%";
            puff.style.left = "50%";
            puff.style.transform = "translate(-50%, -50%)";
            puff.style.pointerEvents = "none";

            container.appendChild(puff);

            const angle = Math.random() * 2 * Math.PI;
            const distance = 30 + Math.random() * 40;
            const scale = 0.8 + Math.random() * 0.6;
            const rotation = Math.random() * 360;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            puff.animate(
                [
                    {
                        transform: "translate(-50%, -50%) scale(1)",
                        opacity: 0.8,
                    },
                    {
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotation}deg)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: 800,
                    easing: "ease-out",
                    fill: "forwards",
                }
            );

            setTimeout(() => puff.remove(), 1000);
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

    const handleClick = () => {
        if (!containerRef.current || isLaunching) return;
        setIsLaunching(true);
        spawnParticles();

        containerRef.current.style.transition = "transform 0.6s ease-in-out";
        const y = -20 - Math.random() * 40; // -20vh to -60vh
        const r = (Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1);
        const s = 1.1 + Math.random() * 0.3; // scale between 1.1 and 1.4
        containerRef.current.style.transform = `translateY(${y}vh) rotate(${r}deg) scale(${s})`;

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
        <div className="astronaut-wrapper" onClick={handleClick}>
            <div className="astronaut" ref={containerRef}>
                <div className="puff-container" ref={puffContainerRef} />
                <Image
                    src="/worried-astronaut.png"
                    alt="Floating Astronaut"
                    width={220}
                    height={220}
                    ref={imgRef}
                />
            </div>
        </div>
    );
}
