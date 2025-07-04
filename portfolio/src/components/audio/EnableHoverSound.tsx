"use client";
import { useEffect, useRef } from "react";

export default function HoverSoundGlobal({ enabled }: { enabled: boolean }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastPlayRef = useRef(0);

    useEffect(() => {
        if (!enabled) return;

        audioRef.current = new Audio('/sfx/ui-click-menu-modern-interface-select-small-01-230473.mp3');
        audioRef.current.volume = 0.1;

        const handleHover = () => {
            const now = Date.now();
            if (now - lastPlayRef.current < 200) return;
            lastPlayRef.current = now;

            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { });
            }
        };

        const attachHoverListeners = () => {
            document.querySelectorAll('a, .hover-sound').forEach((a) => {
                a.removeEventListener('mouseenter', handleHover); // just in case
                a.addEventListener('mouseenter', handleHover);
            });
        };

        attachHoverListeners();

        const observer = new MutationObserver(() => {
            attachHoverListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            document.querySelectorAll('a, .hover-sound').forEach((a) => {
                a.removeEventListener('mouseenter', handleHover);
            });
        };
    }, [enabled]);

    return null;
}
