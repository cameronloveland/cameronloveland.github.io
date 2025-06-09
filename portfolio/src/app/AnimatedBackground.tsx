'use client'

import Particles from 'react-tsparticles';
import type { ISourceOptions } from 'tsparticles-engine';

export default function AnimatedBackground() {
  const options: ISourceOptions = {
    fullScreen: { enable: true, zIndex: -30 },
    background: { color: '#000000' },
    fpsLimit: 60,
    particles: {
      number: { value: 200 },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.3, max: 0.8 },
        animation: { enable: true, speed: 2, minimumValue: 0.3, sync: false }
      },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.2 },
      twinkle: { particles: { enable: true, frequency: 0.05, opacity: 1 } }
    }
  };

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Particles id="stars" options={options} style={{ position: 'absolute', inset: 0 }} />
      <div
        className="absolute inset-0 bg-bottom bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/earth.svg')",
          backgroundAttachment: 'fixed'
        }}
      />
    </div>
  );
}
