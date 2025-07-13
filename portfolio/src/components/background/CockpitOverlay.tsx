"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CockpitOverlay() {
    const [isOpen, setIsOpen] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsOpen(false);
            if (audioRef.current) {
                audioRef.current.volume = 0.5;
                audioRef.current.play();
            }
        }, 1500); // simulate ship opening
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="cockpit pointer-events-none fixed inset-0 overflow-hidden z-0">
            <audio ref={audioRef} src="/sfx/door-open.mp3" preload="auto" />

            {/* Top center trapezoid window */}
            <div
                className={`cockpit-panel-glow absolute top-0 w-full h-[49.75vh] bg-white/2 backdrop-blur-xs transition-transform duration-1000 ease-in-out ${!isOpen ? "-translate-y-full" : ""}`}
                style={{
                    clipPath: "polygon(20% 0, 80% 0, 62% 100%, 38% 100%)",
                }}
            />

            {/* Bottom center trapezoid window */}
            <div
                className={`cockpit-panel-glow absolute bottom-0 w-full h-[49.75vh] bg-white/2 backdrop-blur-xs transition-transform duration-1000 ease-in-out  ${!isOpen ? "translate-y-full" : ""}`}
                style={{
                    clipPath: "polygon(38% 0%, 62% 0%, 80% 100%, 20% 100%)",
                }}
            />

            {/* Left side faceted panel (half-octagon shape) */}
            <div
                className={`cockpit-panel-glow absolute top-0 left-0 w-1/2 h-full bg-white/2 backdrop-blur-xs transition-transform duration-1000 ease-in-out ${!isOpen ? "-translate-x-full" : ""}`}
                style={{
                    clipPath: `
            polygon(
              0% 0%,
              -38% 0%,
              20% 0%,
              33% -8%,
              75% 50%,
              39% 100%,
              10% 100%,
              0% 100%
            )
          `,
                }}
            />

            {/* Right side faceted panel (half-octagon shape, mirrored) */}
            <div
                className={`cockpit-panel-glow absolute top-0 right-0 w-1/2 h-full bg-white/2 backdrop-blur-xs transition-transform duration-1000 ease-in-out ${!isOpen ? "translate-x-full" : ""}`}
                style={{
                    clipPath: `
            polygon(
              100% 0%,
              138% 0%,
              80% 0%,
              67% -8%,
              25% 50%,
              61% 100%,
              90% 100%,
              100% 100%
            )
          `,
                }}
            />
        </div>
    );
}
