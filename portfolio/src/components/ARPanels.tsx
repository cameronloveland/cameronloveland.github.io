'use client';

import Image from 'next/image';
import useMouseParallax from '@/hooks/useMouseParallax';

function LeftARPanel() {
  const offset = useMouseParallax(0.5);

  return (
    <div
      className="pointer-events-none fixed left-4 top-8 bottom-8 w-[300px] h-[80vh] z-20 bg-transparent text-cyan-300 drop-shadow-[0_0_6px_#00ffff] flex flex-col"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <h2 className="p-3 text-center text-sm uppercase font-bold">
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
  const offset = useMouseParallax(0.5);

  return (
    <div
      className="pointer-events-none fixed right-4 top-8 bottom-8 w-[300px] h-[80vh] z-20 bg-transparent text-cyan-300 drop-shadow-[0_0_6px_#00ffff] flex flex-col"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <h2 className="p-3 text-center text-sm uppercase font-bold">
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
