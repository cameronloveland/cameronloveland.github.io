'use client';

import { useEffect, useRef, useState } from 'react';

const stations = [
    { name: 'Radio Paradise', url: 'https://stream.radioparadise.com/aac-320' },
    { name: 'KEXP Seattle', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
    { name: 'WNYC News', url: 'https://fm939.wnyc.org/wnycfm.aac' },
    { name: 'Groove Salad (SomaFM)', url: 'https://ice3.somafm.com/groovesalad-128-mp3' },
    { name: 'Nightride FM', url: 'https://stream.nightride.fm/nightride.mp3' },
    { name: 'Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
];


export default function RadioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [stationIndex, setStationIndex] = useState(5);
    const [isPlaying, setIsPlaying] = useState(true);

    const currentStation = stations[stationIndex];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.1;
        audio.load();
        audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
                console.warn('Auto-play blocked or failed:', err);
                setIsPlaying(false);
            });
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
    };

    const changeStation = (index: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        setStationIndex(index);

        if (!audio.paused) {
            try {
                audio.pause();
            } catch (err) {
                console.warn('Pause failed:', err);
            }
        }

        requestAnimationFrame(() => {
            audio.src = stations[index].url;
            audio.load();

            if (isPlaying) {
                audio
                    .play()
                    .then(() => { })
                    .catch((err) => {
                        console.warn('Playback failed:', err);
                        setIsPlaying(false);
                    });
            }
        });
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto bg-black/50 border border-cyan-500/30 rounded-2xl backdrop-blur-md shadow-lg flex flex-col items-center px-6 py-4 space-y-4 hud-panel mt-4">
            {/* Station Display */}
            <div
                className="w-full text-center text-2xl text-cyan-200 tracking-widest digital-glow bg-black/40 border border-cyan-500/20 rounded-md py-2 px-4 shadow-inner"
                style={{ fontFamily: 'var(--font-digital)' }}
            >
                {isPlaying ? currentStation.name : 'RADIO STANDBY'}
            </div>

            {/* Tuner Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
                {stations.map((station, idx) => {
                    const isActive = idx === stationIndex;
                    return (
                        <button
                            key={station.name}
                            onClick={() => changeStation(idx)}
                            className={`px-3 py-1 text-xs rounded-full border transition ${isActive
                                ? 'bg-cyan-400 text-black border-cyan-400'
                                : 'bg-transparent text-cyan-300 border-cyan-500/30 hover:bg-cyan-700/20'
                                }`}
                        >
                            {String(idx + 1).padStart(2, '0')}
                        </button>
                    );
                })}
            </div>

            {/* Play / Pause Button */}
            <button
                onClick={togglePlay}
                className="w-[60px] h-[60px] rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center text-xl shadow-md hover:bg-cyan-400 transition"
            >
                {isPlaying ? '❚❚' : '▶'}
            </button>

            <audio ref={audioRef} src={currentStation.url} preload="none" />
        </div>
    );
}
