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

    const prevStation = () => {
        const idx = (stationIndex - 1 + stations.length) % stations.length;
        changeStation(idx);
    };

    const nextStation = () => {
        const idx = (stationIndex + 1) % stations.length;
        changeStation(idx);
    };

    return (
        <div className="radio-footer">
            <div className="flex-1 hidden sm:block" />

            <div className="flex flex-col items-center justify-center text-center flex-1">
                <div
                    className="station-title text-cyan-200 digital-glow"
                    style={{ fontFamily: 'var(--font-digital)' }}
                >
                    {isPlaying ? currentStation.name : 'RADIO STANDBY'}
                </div>
                <div className="equalizer mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="bar" />
                    ))}
                </div>
            </div>

            <div className="controls flex items-center justify-end gap-2 flex-1">
                <button onClick={prevStation} title="Previous" className="button-style">
                    ◀◀
                </button>
                <button onClick={togglePlay} title="Play/Pause" className="button-style text-lg">
                    {isPlaying ? '❚❚' : '▶'}
                </button>
                <button onClick={nextStation} title="Next" className="button-style">
                    ▶▶
                </button>
                <audio ref={audioRef} src={currentStation.url} preload="none" />
            </div>
        </div>
    );
}
