import { create } from 'zustand';

type CosmicControl = {
  cometsEnabled: boolean;
  shootingStarsEnabled: boolean;
  starLayerCount: number;
  set: (partial: Partial<CosmicControl>) => void;
};

export const useCosmicControl = create<CosmicControl>((set) => ({
  cometsEnabled: true,
  shootingStarsEnabled: true,
  starLayerCount: 3,
  set: (partial) => set(partial),
}));
