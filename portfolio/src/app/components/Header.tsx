'use client';

import { useState, useEffect, useRef } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

export default function Header() {
    const [audioOn, setAudioOn] = useState(false);
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

    return (
        <header className="fixed top-0 left-0 w-full z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-900 fade-in-delayed transition-opacity duration-700 opacity-0">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 " >
                <a
                    href="https://github.com/cameronloveland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" flex items-center gap-3 hover:text-cyan-300 transition"
                    aria-label="GitHub Portfolio"
                >
                    <img
                        src="https://github.com/cameronloveland.png"
                        alt="Cameron Loveland"
                        className="w-8 h-8 rounded-full border-2 border-neutral-700 shadow-sm"
                    />
                    <span className="text-white font-bold text-lg tracking-tight">
                        Cameron Loveland <span className="text-neutral-400">/ Portfolio</span>
                    </span>
                </a>

                {/* Social icons centered */}
                <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
                    <a
                        href="https://github.com/cameronloveland"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-cyan-300 transition"
                        aria-label="GitHub"
                    >
                        <FaGithub className="text-lg" />
                    </a>
                    <a
                        href="https://linkedin.com/in/your-linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-cyan-300 transition"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin className="text-lg" />
                    </a>
                    <a
                        href="https://twitter.com/your-twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-cyan-300 transition"
                        aria-label="Twitter"
                    >
                        <FaXTwitter className="text-lg" />
                    </a>
                </nav>

                {/* Audio toggle */}

                <button
                    onClick={() => setAudioOn(!audioOn)}
                    title="Toggle ambient audio"
                    className={`text-neutral-500 hover:text-cyan-300 text-lg hover:text-cyan-300 ${audioOn ? 'text-cyan-300' : 'text-neutral-500'}`}
                >
                    {audioOn ? <HiSpeakerWave /> : <HiSpeakerXMark />}
                </button>

            </div>

            {/* Audio elements */}
            <audio ref={audioRef} src="/sfx/spaceship-ambience.mp3" />
            <audio ref={voiceRef} src="/sfx/voice-welcome.mp3" />
        </header>
    );
}
