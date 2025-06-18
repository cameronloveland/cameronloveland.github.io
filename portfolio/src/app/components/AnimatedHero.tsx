'use client';
import { useEffect, useState } from 'react';

export default function AnimatedHero({ onFadeOut }: { onFadeOut: () => void }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFadeOut(); // trigger header change
        }, 5000);

        return () => clearTimeout(timer);
    }, [onFadeOut]);

    return (
        <section
            className={`w-full max-w-2xl flex flex-col items-center text-center mb-12 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <img
                src="https://github.com/cameronloveland.png"
                alt="Cameron Loveland"
                className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow mb-4 opacity-0 animate-fade-in delay-[100ms]"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight opacity-0 animate-fade-in delay-[300ms]">
                Cameron Loveland
            </h1>
            <p className="text-neutral-400 text-md opacity-0 animate-fade-in delay-[500ms]">
                Software Engineer
            </p>
            <p className="text-neutral-500 italic text-sm mt-1 opacity-0 animate-fade-in delay-[700ms]">
                Welcome aboard — this is my interactive portfolio site.
            </p>
        </section>
    );
}
