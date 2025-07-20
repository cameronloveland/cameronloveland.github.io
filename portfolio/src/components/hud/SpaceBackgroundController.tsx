'use client'
import React, { useState } from "react";
import { SpaceBackground } from "../background";

// Dynamic slider component
function SliderControl({
    label,
    id,
    min,
    max,
    step = 1,
    value,
    onChange,
    className = "",
}: {
    label: string;
    id: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (v: number) => void;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-2 py-2 ${className}`}>
            <label
                htmlFor={id}
                className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-1"
            >
                {label}
            </label>
            <div className="flex items-center gap-3">
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 rounded-lg bg-neutral-700"
                />
                <span className="text-cyan-200 font-mono text-sm w-8 text-right">{value}</span>
            </div>
        </div>
    );
}

export function SpaceBackgroundController({ visible = false }: { visible: boolean }) {
    // Default values match SpaceBackground defaults
    const [comets, setComets] = useState(10);
    const [starLayers, setStarLayers] = useState(3);
    const [starsPerLayer, setStarsPerLayer] = useState(100);
    const [shootingStars, setShootingStars] = useState(10);

    // Slider configuration
    const sliders = [
        {
            label: "Comets",
            id: "comets",
            min: 0,
            max: 30,
            value: comets,
            onChange: setComets,
        },
        {
            label: "Star Layers",
            id: "starLayers",
            min: 1,
            max: 6,
            value: starLayers,
            onChange: setStarLayers,
        },
        {
            label: "Stars/Layer",
            id: "starsPerLayer",
            min: 10,
            max: 300,
            step: 10,
            value: starsPerLayer,
            onChange: setStarsPerLayer,
        },
        {
            label: "Shooting Stars",
            id: "shootingStars",
            min: 0,
            max: 20,
            value: shootingStars,
            onChange: setShootingStars,
        },
    ];

    return (
        <>
            {visible ? (
                <div
                    className={`hud-panel-clear fixed left-1/2 top-0 z-50 max-w-xs w-full -translate-x-1/2 transition-transform duration-500 ${visible ? 'translate-y-0' : '-translate-y-full'} shadow-lg`}
                    style={{ borderRadius: '0 0 1rem 1rem' }
                    }
                >
                    <div className="flex items-center justify-between px-4 pt-1 pb-2 border-b border-cyan-400/10 text-cyan-300 text-sm font-semibold uppercase overflow-hidden mb-4">
                        <span className="tracking-widest font-mono text-cyan-300 text-base">Space Elements</span>
                        <div className="flex gap-2">
                            <span className="w-1 h-1 rounded-full bg-cyan-300 animate-pulse shadow-lg" title="Active"></span>
                        </div>
                    </div>
                    <div>
                        {sliders.map(slider => (
                            <SliderControl
                                key={slider.id}
                                label={slider.label}
                                id={slider.id}
                                min={slider.min}
                                max={slider.max}
                                step={slider.step}
                                value={slider.value}
                                onChange={slider.onChange}
                            />
                        ))}
                    </div>
                    <div style={{ display: "none" }}>
                        <SpaceBackground
                            comets={comets}
                            starLayers={starLayers}
                            starsPerLayer={starsPerLayer}
                            shootingStars={shootingStars}
                        />
                    </div>
                </div >
            ) : null}
        </>
    );
}

export default SpaceBackgroundController;
