"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FloatingAstronaut() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const puffContainerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLaunching, setIsLaunching] = useState(false);
    const [isFlying, setIsFlying] = useState(false);
    const [direction, setDirection] = useState({ x: 0, y: 0 });
    const directionRef = useRef({ x: 0, y: 0 });
    const [thrustedImage, setThrustedImage] = useState("/astronaut-thrusted-1.png");

    const positionRef = useRef({ x: 0, y: 0 });
    const keysRef = useRef({ up: false, down: false, left: false, right: false });

    const spawnParticles = () => {
        const container = puffContainerRef.current;
        if (!container) return;
        const count = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < count; i++) {
            const puff = document.createElement("div");
            puff.className = "steam-puff";

            Object.assign(puff.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background:
                    "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(150,220,255,0.6) 60%, rgba(50,120,255,0.2) 100%)",
                filter: "blur(4px) drop-shadow(0 0 10px rgba(150,220,255,0.9))",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                opacity: "0.85",
                zIndex: "-1",
                transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
            });

            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const scale = 1.4 + Math.random() * 0.8;
            const rotation = Math.random() * 360;

            container.appendChild(puff);

            requestAnimationFrame(() => {
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                puff.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`;
                puff.style.opacity = "0";
            });

            setTimeout(() => puff.remove(), 1000);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || isLaunching || isFlying) return;

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
            scale(1.03)
`;
        };

        if (!isLaunching && !isFlying) {
            window.addEventListener("mousemove", handleMouseMove);
        }
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isLaunching, isFlying]);

    useEffect(() => {
        const updateDirection = () => {
            const x = (keysRef.current.right ? 1 : 0) - (keysRef.current.left ? 1 : 0);
            const y = (keysRef.current.down ? 1 : 0) - (keysRef.current.up ? 1 : 0);
            directionRef.current = { x, y };
            setDirection({ x, y });
            setIsFlying(x !== 0 || y !== 0);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLaunching) return;
            switch (e.key) {
                case 'w':
                case 'W':
                case 'ArrowUp':
                    keysRef.current.up = true;
                    break;
                case 's':
                case 'S':
                case 'ArrowDown':
                    keysRef.current.down = true;
                    break;
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    keysRef.current.left = true;
                    break;
                case 'd':
                case 'D':
                case 'ArrowRight':
                    keysRef.current.right = true;
                    break;
                default:
                    return;
            }
            updateDirection();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'w':
                case 'W':
                case 'ArrowUp':
                    keysRef.current.up = false;
                    break;
                case 's':
                case 'S':
                case 'ArrowDown':
                    keysRef.current.down = false;
                    break;
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    keysRef.current.left = false;
                    break;
                case 'd':
                case 'D':
                case 'ArrowRight':
                    keysRef.current.right = false;
                    break;
                default:
                    return;
            }
            updateDirection();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isLaunching]);

    useEffect(() => {
        if (!isFlying || isLaunching || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const rect = wrapper.getBoundingClientRect();
        positionRef.current = { x: rect.left, y: rect.top };

        wrapper.style.animationPlayState = 'paused';
        wrapper.style.top = `${rect.top}px`;
        wrapper.style.left = `${rect.left}px`;

        let last = performance.now();
        let particleTimer = 0;

        const speed = 0.3; // px per ms

        let animationRef: number;
        const step = (time: number) => {
            const dt = time - last;
            last = time;

            positionRef.current.x += directionRef.current.x * speed * dt;
            positionRef.current.y += directionRef.current.y * speed * dt;

            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            positionRef.current.x = Math.min(maxX, Math.max(0, positionRef.current.x));
            positionRef.current.y = Math.min(maxY, Math.max(0, positionRef.current.y));

            wrapper.style.top = `${positionRef.current.y}px`;
            wrapper.style.left = `${positionRef.current.x}px`;

            if (containerRef.current) {
                const tilt = 5;
                containerRef.current.style.transform = `rotateZ(${directionRef.current.x * -tilt}deg) rotateX(${directionRef.current.y * tilt}deg)`;
            }

            particleTimer += dt;
            if (particleTimer > 100) {
                spawnParticles();
                particleTimer = 0;
            }

            animationRef = requestAnimationFrame(step);
        };

        animationRef = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(animationRef);
            wrapper.style.animationPlayState = 'running';
            wrapper.style.top = '';
            wrapper.style.left = '';
            if (containerRef.current) {
                containerRef.current.style.transform = '';
            }
        };
    }, [isFlying, isLaunching]);

    const handleClick = () => {
        if (!containerRef.current || isLaunching) return;
        setIsLaunching(true);
        spawnParticles();

        const nextVariant = Math.random() > 0.5 ? 1 : 2;
        setThrustedImage(`/thrusted-astronaut-${nextVariant}.png`);

        if (audioRef.current?.src) {
            const puffSound = new Audio(audioRef.current.src);
            puffSound.volume = 0.3;
            puffSound.play().catch(() => { });
        }


        containerRef.current.style.transition = "transform 0.6s ease-in-out";
        const x = (Math.random() * 100 - 50) + "vw";
        const y = (Math.random() * 100 - 50) + "vh";
        const r = (Math.random() * 540 - 360) + "deg";
        const s = 1 + Math.random() * 1.5;
        containerRef.current.style.transform = `translate(${x}, ${y}) rotate(${r}) scale(${s})`;

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
        <div className="astronaut-wrapper" onClick={handleClick} ref={wrapperRef}>
            <div className="astronaut-parallax relative" ref={containerRef}>
                <div ref={puffContainerRef} className="absolute inset-0 pointer-events-none z-0" />
                <Image
                    src={
                        isLaunching || isFlying
                            ? thrustedImage
                            : "/worried-astronaut.png"
                    }
                    alt="Floating Astronaut"
                    width={220}
                    height={220}
                    ref={imgRef}
                    className="relative z-10 transition-transform duration-800"
                />
                <audio ref={audioRef} src="/sfx/steam-puff.mp3" preload="auto" />
            </div>
        </div>

    );
}
