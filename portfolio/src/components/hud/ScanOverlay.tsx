"use client";
import { motion } from "framer-motion";

interface Props {
  progress: number;
  position: { x: number; y: number };
  visible: boolean;
}

export default function ScanOverlay({ progress, position, visible }: Props) {
  if (!visible) return null;
  return (
    <div
      className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.x, top: position.y }}
    >
      <div className="bg-neutral-800/80 text-primaryText text-xs font-mono p-2 rounded shadow-lg w-28">
        <motion.div
          className="h-1 bg-accent mb-1"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
        <div className="text-center tracking-widest">SCANNING</div>
      </div>
    </div>
  );
}
