import React from "react";

const MiddleComponent: React.FC = () => {
    return (
        <div className="hud-aside-container">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-950 text-sm font-semibold uppercase text-neutral-400">
                <span>Middle Component</span>
                {/* Optional: Add a right-aligned label or count here if needed */}
            </div>
            {/* Body */}
            <div className="p-4">
                {/* Body content goes here */}
            </div>
        </div>
    );
};

export default MiddleComponent;