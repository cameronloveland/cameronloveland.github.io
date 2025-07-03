'use client';
import { useRef } from 'react';

export function useHoverSound(src = '/sfx/hover-beep.mp3') {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    if (!audioRef.current) {
        const audio = new Audio(src);
        audio.volume = 0.25;
        audioRef.current = audio;
    }

    const play = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    return { onMouseEnter: play };
}
