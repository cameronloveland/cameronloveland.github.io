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
    fullScreen: { enable: true, zIndex: -1 },
    fpsLimit: 60,
    background: { color: '#000000' },
    particles: {
      number: { value: 200, density: { enable: false } },
      color: { value: '#ffffff' },
      opacity: { value: 0.5 },
      size: { value: 2 },
      move: { enable: true, speed: 2 },
      links: { enable: false }
    },
    polygon: {
      enable: true,
      type: 'inline',
      inline: { arrangement: 'equidistant' },
      draw: { enable: true, stroke: { width: 0.5, color: 'rgba(255,255,255,0.2)' } },
      move: { radius: 10 },
      scale: 1,
      url: '/star.svg'
    }
  };

  return (
    <Particles
      id="animated-bg"
      init={particlesInit}
      options={options}
      style={{ position: 'absolute', inset: 0, zIndex: -1 }}
    />
  );
}
