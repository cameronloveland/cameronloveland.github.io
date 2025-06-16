'use client';

import { useEffect, useRef, useState } from 'react';

export default function AmbientAudioToggle() {
    const [audioOn, setAudioOn] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const voiceRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.loop = true;
            if (audioOn && voiceRef.current) {
                audioRef.current.play().catch(() => { });
                voiceRef.current.play().catch(() => { });
            } else {
                audioRef.current.pause();
            }
        }
    }, [audioOn]);

    return (
        <>
            <button
                onClick={() => setAudioOn(!audioOn)}
                className="fixed top-4 right-4 z-50 text-xs px-3 py-1 border border-cyan-400 text-cyan-300 bg-black/50 hover:bg-cyan-400/20 rounded shadow"
            >
                {audioOn ? '🔊 Audio On' : '🔇 Audio Off'}
            </button>
            <audio ref={audioRef} src="/sfx/spaceship-ambience.mp3" />
            <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />

        </>
    );
}
