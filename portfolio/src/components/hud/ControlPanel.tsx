'use client';
import { useCosmicControl } from '@/lib/useCosmicControl';
import ControlRow from './ControlRow';

export default function ControlPanel() {
  const { cometsEnabled, shootingStarsEnabled, starLayerCount, set } = useCosmicControl();

  return (
    <div className="hud-panel absolute top-16 right-4 w-80 z-50 shadow-xl bg-neutral-900/80 backdrop-blur border border-cyan-500 rounded-xl">
      <h2 className="text-cyan-300 text-lg font-bold px-4 pt-3 pb-2">🛠 Scene Control</h2>

      <ControlRow
        label="Comets"
        value={cometsEnabled}
        onChange={(v) => set({ cometsEnabled: v })}
      />
      <ControlRow
        label="Shooting Stars"
        value={shootingStarsEnabled}
        onChange={(v) => set({ shootingStarsEnabled: v })}
      />
      <ControlRow
        label="Star Layers"
        value={starLayerCount}
        onChange={(v) => set({ starLayerCount: +v })}
        step={1}
      />
    </div>
  );
}
