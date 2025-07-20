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

export default function SpaceBackgroundController() {
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
        <div
            className="absolute top-8 z-50 w-full max-w-xs mx-auto scale-85"
            style={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                padding: 0,
            }}
        >
            {/* Styled header like radioplayer */}
            <div className="flex items-center justify-between px-2 pt-0 pb-1 border-b border-cyan-400/10 text-cyan-300 text-xs font-semibold uppercase overflow-hidden mb-2">
                <span className="tracking-widest font-mono text-cyan-300 text-sm">Space Elements</span>
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
                        className="py-1"
                    />
                ))}
            </div>
            {/* Render the background with current settings, but hidden (for effect) */}
            <div style={{ display: "none" }}>
                <SpaceBackground
                    comets={comets}
                    starLayers={starLayers}
                    starsPerLayer={starsPerLayer}
                    shootingStars={shootingStars}
                />
            </div>
            <style jsx global>{`
                /* Custom slider styles for this controller */
                #comets,
                #starLayers,
                #starsPerLayer,
                #shootingStars {
                    height: 2px !important;
                    min-height: 2px !important;
                    background: #164e63 !important;
                    border-radius: 0 !important;
                }
                #comets::-webkit-slider-thumb,
                #starLayers::-webkit-slider-thumb,
                #starsPerLayer::-webkit-slider-thumb,
                #shootingStars::-webkit-slider-thumb {
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 50%;
                    background: #22d3ee;
                    border: none;
                    box-shadow: 0 0 2px #22d3ee80;
                    cursor: pointer;
                    appearance: none;
                }
                #comets::-moz-range-thumb,
                #starLayers::-moz-range-thumb,
                #starsPerLayer::-moz-range-thumb,
                #shootingStars::-moz-range-thumb {
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 50%;
                    background: #22d3ee;
                    border: none;
                    box-shadow: 0 0 2px #22d3ee80;
                    cursor: pointer;
                }
                #comets::-ms-thumb,
                #starLayers::-ms-thumb,
                #starsPerLayer::-ms-thumb,
                #shootingStars::-ms-thumb {
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 50%;
                    background: #22d3ee;
                    border: none;
                    box-shadow: 0 0 2px #22d3ee80;
                    cursor: pointer;
                }
                /* Remove default focus outline for slider thumbs */
                #comets:focus,
                #starLayers:focus,
                #starsPerLayer:focus,
                #shootingStars:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}