'use client'

import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Engine, ISourceOptions } from 'tsparticles-engine';
import { loadPolygonMaskPlugin } from 'tsparticles-plugin-polygon-mask';

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadPolygonMaskPlugin(engine);
  }, []);

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    particles: {
      number: { value: 200 },
      color: { value: '#ffffff' },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 2 },
      links: { enable: false }
    },
    polygon: {
      enable: true,
      type: 'inline',
      inline: { arrangement: 'equidistant' },
      scale: 80,
      move: { radius: 10 },
      data: {
        path: 'M50 15 L61 35 L85 35 L66 50 L72 72 L50 60 L28 72 L34 50 L15 35 L39 35 Z',
        size: { width: 100, height: 100 }
      }
    }
  };

  return (
    <Particles
      id="animated-bg"
      init={particlesInit}
      options={options}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}
