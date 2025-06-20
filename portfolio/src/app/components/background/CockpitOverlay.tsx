'use client';

import React from 'react';

export default function CockpitOverlay() {
    return (
        <div className="cockpit pointer-events-none fixed inset-0 overflow-hidden flex items-end justify-center">
            {/* Center flipped isosceles trapezoid window only */}
            <div
                className="h-[70vh] w-[60vw] bg-white/1 top-0 absolute"
                style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
                }}
            />

        </div>
    );
}