'use client';

import { useEffect, useRef, useState } from 'react';

const stations = [
    { name: 'Deep Space One', url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
    { name: 'Radio Paradise', url: 'https://stream.radioparadise.com/aac-320' },
    { name: 'KEXP Seattle', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
    { name: 'WNYC News', url: 'https://fm939.wnyc.org/wnycfm.aac' },
    { name: 'Groove Salad (SomaFM)', url: 'https://ice3.somafm.com/groovesalad-128-mp3' },
    { name: 'Nightride FM', url: 'https://stream.nightride.fm/nightride.mp3' },
];

export default function RadioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [stationIndex, setStationIndex] = useState(0);
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
        if (index < 0 || index >= stations.length) return;

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

    const handleNext = () => changeStation((stationIndex + 1) % stations.length);
    const handlePrev = () => changeStation((stationIndex - 1 + stations.length) % stations.length);

    // Calculate visible stations (window of 3: prev, current, next)
    const getVisibleStations = () => {
        const prev = (stationIndex - 1 + stations.length) % stations.length;
        const next = (stationIndex + 1) % stations.length;
        return [stations[prev], stations[stationIndex], stations[next]];
    };
    const visibleStations = getVisibleStations();

    return (
        <div className="hud-panel text-cyan-300 font-mono text-sm h-full w-full">
            <div className="hud-aside-container flex flex-col h-full">
                {/* Header */}
                <div className="sticky top-0 z-10 px-4 pt-1 pb-2 border-b border-cyan-400/10 text-sm font-semibold uppercase">
                    <span>{isPlaying ? currentStation.name : 'RADIO STANDBY'}</span>
                </div>

                {/* Two-column content */}
                <div className="flex flex-row gap-4 px-4 py-2 w-full">
                    {/* Left: Controls */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="radio-nav-btn"
                                aria-label="Previous station"
                            >
                                ‹
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 rounded-full bg-cyan-500 text-black font-bold text-lg shadow-md hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-transform"
                            >
                                {isPlaying ? '❚❚' : '▶'}
                            </button>

                            <button
                                onClick={handleNext}
                                className="radio-nav-btn"
                                aria-label="Next station"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* Right: Station List */}
                    <ul className="flex flex-col gap-0.5 text-xs w-full">
                        {visibleStations.map((station, i) => {
                            // Map window index to real index
                            const idx = (stationIndex - 1 + i + stations.length) % stations.length;
                            const isActive = idx === stationIndex;
                            return (
                                <li
                                    key={idx}
                                    onClick={() => changeStation(idx)}
                                    className={`flex items-center gap-2 w-full px-2 py-0.5 cursor-pointer rounded-md transition 
                                        ${isActive
                                            ? 'bg-cyan-500/10 text-cyan-100 font-bold'
                                            : 'hover:bg-cyan-500/5 hover:text-cyan-100'
                                        }`}
                                >
                                    <span
                                        className={`w-8 text-center text-[10px] rounded-md border ${isActive
                                            ? 'bg-cyan-400 text-black border-cyan-400'
                                            : 'border-cyan-500/30'
                                            }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="truncate">{station.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <audio ref={audioRef} src={currentStation.url} preload="none" />
        </div>
    );
}
