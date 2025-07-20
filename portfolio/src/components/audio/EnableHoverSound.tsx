"use client";
import { useEffect, useRef } from "react";

export default function HoverSoundGlobal({ enabled }: { enabled: boolean }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastPlayRef = useRef(0);

    useEffect(() => {
        if (!enabled) {
            // Clean up audio when disabled
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            return;
        }

        // Create audio element with proper attributes
        audioRef.current = new Audio('/sfx/ui-click-menu-modern-interface-select-small-01-230473.mp3');
        audioRef.current.volume = 0.1;
        audioRef.current.preload = 'auto';

        const handleHover = () => {
            const now = Date.now();
            if (now - lastPlayRef.current < 200) return;
            lastPlayRef.current = now;

            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((error) => {
                    console.log('Hover sound failed to play:', error.message);
                });
            }
        };

        const attachHoverListeners = () => {
            document.querySelectorAll('a, .hover-sound').forEach((element) => {
                element.removeEventListener('mouseenter', handleHover); // Clean up existing listeners
                element.addEventListener('mouseenter', handleHover);
            });
        };

        // Initial attachment
        attachHoverListeners();

        // Watch for DOM changes to attach listeners to new elements
        const observer = new MutationObserver(() => {
            attachHoverListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            // Clean up all event listeners
            document.querySelectorAll('a, .hover-sound').forEach((element) => {
                element.removeEventListener('mouseenter', handleHover);
            });
            // Clean up audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [enabled]);

    return null;
}
