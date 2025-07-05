'use client';

import { useEffect, useRef, useState } from 'react';

const stations = [
  { name: 'Alpha Base', url: '/sfx/spaceship-ambience.mp3' },
  { name: 'Nebula Pulse', url: '/sfx/door-open.mp3' },
  { name: 'Cosmic Drift', url: '/sfx/hover-beep.mp3' },
];

export default function RadioPlayer() {
  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = stations[index].url;
    audio.play().catch(() => {});
  }, [index]);

  const next = () => setIndex((i) => (i + 1) % stations.length);

  return (
    <div className="hud-panel mt-4">
      <aside className="hud-aside-container">
        <div className="flex justify-between items-center px-4 py-2 bg-[#0c0f1c]/80 border-b border-cyan-400/10 text-cyan-300 text-sm font-semibold uppercase">
          <span>Radio Scanner</span>
        </div>
        <div className="p-4 flex flex-col items-center gap-4 text-cyan-300">
          <div className="flex items-end gap-1 h-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-cyan-400 animate-[equalize_1s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="overflow-hidden whitespace-nowrap w-full border border-cyan-400/20 rounded bg-neutral-900/40 text-xs">
            <div className="inline-block animate-[marquee_12s_linear_infinite] px-2">
              {stations[index].name}
            </div>
          </div>
          <button
            onClick={next}
            className="hover-sound w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 shadow-[0_0_8px_2px_rgba(34,255,255,0.4)] flex items-center justify-center text-cyan-200 hover:bg-cyan-500/40"
          >
            Tune
          </button>
          <div className="flex gap-2">
            {stations.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`hover-sound w-6 h-6 rounded-full border border-cyan-400/30 text-xs flex items-center justify-center ${
                  i === index ? 'bg-cyan-400 text-black' : 'bg-neutral-800 text-cyan-300 hover:bg-cyan-500/30'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <audio ref={audioRef} />
    </div>
  );
}
