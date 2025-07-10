'use client';

import { useEffect, useRef, useState } from 'react';
import { HiPause, HiPlay, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

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
  const [stationIndex, setStationIndex] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStation = stations[stationIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.1;
    audio.src = currentStation.url;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentStation.url]);

  const changeStation = (nextIndex: number) => {
    setStationIndex((nextIndex + stations.length) % stations.length);
  };

  const handlePrev = () => changeStation(stationIndex - 1);
  const handleNext = () => changeStation(stationIndex + 1);

  return (
    <div className="radio-footer">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div className="flex-1" />
        <div className="flex items-center justify-center gap-3 flex-1">
          <span className="digital-glow text-cyan-200 text-sm sm:text-base">
            {isPlaying ? currentStation.name : 'RADIO STANDBY'}
          </span>
          <div className="equalizer" aria-hidden="true">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-3 flex-1">
          <button onClick={handlePrev} aria-label="Previous station" className="button-style">
            <HiChevronLeft />
          </button>
          <button onClick={() => setIsPlaying((p) => !p)} aria-label={isPlaying ? 'Pause' : 'Play'} className="button-style">
            {isPlaying ? <HiPause /> : <HiPlay />}
          </button>
          <button onClick={handleNext} aria-label="Next station" className="button-style">
            <HiChevronRight />
          </button>
        </div>
      </div>
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
