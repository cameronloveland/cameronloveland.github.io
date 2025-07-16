'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface BackgroundSettings {
  starLayers: number;
  starsPerLayer: number;
  comets: number;
  shootingStars: number;
}

interface BackgroundControlsProps {
  starLayers?: number;
  starsPerLayer?: number;
  comets?: number;
  shootingStars?: number;
  onChange?: (settings: BackgroundSettings) => void;
  showReset?: boolean;
}

const DEFAULT_SETTINGS: BackgroundSettings = {
  starLayers: 3,
  starsPerLayer: 100,
  comets: 2,
  shootingStars: 3,
};

const MAX_VALUES: Record<keyof BackgroundSettings, number> = {
  starLayers: 10,
  starsPerLayer: 500,
  comets: 10,
  shootingStars: 20,
};

export default function BackgroundControls({
  starLayers = DEFAULT_SETTINGS.starLayers,
  starsPerLayer = DEFAULT_SETTINGS.starsPerLayer,
  comets = DEFAULT_SETTINGS.comets,
  shootingStars = DEFAULT_SETTINGS.shootingStars,
  onChange,
  showReset = false,
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

  const update = (key: keyof BackgroundSettings, delta: number) => {
    setSettings((prev) => {
      const value = Math.max(
        0,
        Math.min(MAX_VALUES[key], prev[key] + delta)
      );
      return { ...prev, [key]: value };
    });
  };

  const reset = () => setSettings({ ...DEFAULT_SETTINGS });

  const control = (
    label: string,
    key: keyof BackgroundSettings
  ) => {
    const value = settings[key];
    return (
      <div className="flex items-center justify-between mb-2" key={key}>
        <span className="text-cyan-300 mr-2 w-32">{label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update(key, -1)}
            disabled={value <= 0}
            className="border border-cyan-400 text-cyan-300 hover:text-cyan-200 rounded-md px-2 py-1 transition ease-in-out"
            aria-label={`Decrease ${label}`}
          >
            -
          </button>
          <motion.span
            key={String(value)}
            className="border border-cyan-400 text-cyan-300 rounded-md px-2 py-1"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.span>
          <button
            onClick={() => update(key, 1)}
            disabled={value >= MAX_VALUES[key]}
            className="border border-cyan-400 text-cyan-300 hover:text-cyan-200 rounded-md px-2 py-1 transition ease-in-out"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="hud-panel">
      {control('Star Layers', 'starLayers')}
      {control('Stars Per Layer', 'starsPerLayer')}
      {control('Comets', 'comets')}
      {control('Shooting Stars', 'shootingStars')}
      {showReset && (
        <button
          onClick={reset}
          className="mt-2 border border-cyan-400 text-cyan-300 hover:text-cyan-200 rounded-md px-2 py-1 transition ease-in-out"
        >
          Reset to Default
        </button>
      )}
    </div>
  );
}
