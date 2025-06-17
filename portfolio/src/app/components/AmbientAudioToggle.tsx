'use client';
import { useEffect, useRef, useState } from 'react';

export function useAudioToggle() {
    const [audioOn, setAudioOn] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const voiceRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current || !voiceRef.current) return;
        audioRef.current.volume = 0.2;
        audioRef.current.loop = true;

        if (audioOn) {
            audioRef.current.play().catch(() => { });
            voiceRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
        }
    }, [audioOn]);

    return {
        audioOn,
        setAudioOn,
        elements: (
            <>
                <audio ref={audioRef} src="/sfx/spaceship-ambience.mp3" />
                <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />
            </>
        ),
    };
}
