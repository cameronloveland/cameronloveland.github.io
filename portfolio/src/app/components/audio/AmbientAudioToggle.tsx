'use client';
import React from 'react';

interface AmbientAudioProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    voiceRef: React.RefObject<HTMLAudioElement>;
}

export default function AmbientAudio({ audioRef, voiceRef }: AmbientAudioProps) {
    return (
        <>
            <audio ref={audioRef} src="/sfx/spaceship-ambience.mp3" />
            <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />
        </>
    );
}
