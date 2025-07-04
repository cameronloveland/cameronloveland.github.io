'use client';

import Image from 'next/image';
import useMouseParallax from '@/hooks/useMouseParallax';

function LeftARPanel() {
  const offset = useMouseParallax(5);

  return (
    <div
      className="pointer-events-none fixed left-4 top-8 bottom-8 w-[300px] h-[80vh] z-20 bg-cyan-300/10 backdrop-blur-sm border border-cyan-500/20 rounded-md ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-cyan-300 font-mono flex flex-col"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <h2 className="p-3 text-center text-sm uppercase font-bold border-b border-cyan-500/20">
        Hackathon Projects
      </h2>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
        <p>Project Alpha</p>
        <p>Project Beta</p>
        <p>Project Gamma</p>
      </div>
    </div>
  );
}

function RightARPanel() {
  const offset = useMouseParallax(5);

  return (
    <div
      className="pointer-events-none fixed right-4 top-8 bottom-8 w-[300px] h-[80vh] z-20 bg-cyan-300/10 backdrop-blur-sm border border-cyan-500/20 rounded-md ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-cyan-300 font-mono flex flex-col"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <h2 className="p-3 text-center text-sm uppercase font-bold border-b border-cyan-500/20">
        Captain’s Log Dev Blog
      </h2>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        <div className="flex gap-2 items-start">
          <Image src="/next.svg" alt="Blog" width={40} height={40} className="rounded-sm" />
          <p className="flex-1">First Entry: Launch Sequence Completed</p>
        </div>
      </div>
    </div>
  );
}

export default function ARPanels() {
  return (
    <>
      <LeftARPanel />
      <RightARPanel />
    </>
  );
}
