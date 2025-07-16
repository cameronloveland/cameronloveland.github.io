'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface BackgroundSettings {
  starLayers: number;
  starsPerLayer: number;
  comets: number;
  shootingStars: number;
}

export interface BackgroundControlsProps {
  starLayers?: number;
  starsPerLayer?: number;
  comets?: number;
  shootingStars?: number;
  onChange?: (settings: BackgroundSettings) => void;
  showReset?: boolean;
}

const DEFAULTS: BackgroundSettings = {
  starLayers: 3,
  starsPerLayer: 100,
  comets: 2,
  shootingStars: 3,
};

export default function BackgroundControls({
  starLayers = DEFAULTS.starLayers,
  starsPerLayer = DEFAULTS.starsPerLayer,
  comets = DEFAULTS.comets,
  shootingStars = DEFAULTS.shootingStars,
  onChange,
  showReset = true,
}: BackgroundControlsProps) {
  const [settings, setSettings] = useState<BackgroundSettings>({
    starLayers,
    starsPerLayer,
    comets,
    shootingStars,
  });

  useEffect(() => {
    onChange?.(settings);
  }, [settings, onChange]);

  const update = (key: keyof BackgroundSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const control = (
    label: string,
    key: keyof BackgroundSettings,
    min: number,
    max: number
  ) => (
    <div className="flex items-center gap-2 py-1">
      <span className="w-32 text-cyan-300">{label}</span>
      <button
        onClick={() => update(key, Math.max(min, settings[key] - 1))}
        className="px-2 py-1 border border-cyan-400 rounded-md hover:text-cyan-200 transition ease-in-out"
      >
        -
      </button>
      <motion.input
        key={settings[key]}
        type="number"
        min={min}
        max={max}
        value={settings[key]}
        onChange={(e) =>
          update(key, Math.max(min, Math.min(max, parseInt(e.target.value) || 0)))
        }
        className="w-20 text-center border border-cyan-400 rounded-md bg-transparent text-cyan-300 px-2 py-1"
        initial={{ scale: 0.95, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        animate={{ scale: 1, boxShadow: '0 0 8px rgba(34,211,238,0.6)' }}
        transition={{ duration: 0.2 }}
      />
      <button
        onClick={() => update(key, Math.min(max, settings[key] + 1))}
        className="px-2 py-1 border border-cyan-400 rounded-md hover:text-cyan-200 transition ease-in-out"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="hud-panel text-sm">
      <aside className="hud-aside-container space-y-2">
        {control('Star Layers', 'starLayers', 0, 10)}
        {control('Stars per Layer', 'starsPerLayer', 0, 500)}
        {control('Comets', 'comets', 0, 10)}
        {control('Shooting Stars', 'shootingStars', 0, 20)}
        {showReset && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setSettings({ ...DEFAULTS })}
              className="px-4 py-1 border border-cyan-400 rounded-md hover:text-cyan-200 transition ease-in-out"
            >
              Reset to Default
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
