'use client';

export default function ThemePreview() {
    return (
        <div className="min-h-screen bg-background text-primaryText font-body px-6 py-16 space-y-14 max-w-5xl mx-auto">
            <h1 className="font-heading text-5xl text-accent tracking-widest uppercase text-center drop-shadow-[0_0_6px_#38bdf8]">
                Theme Systems Online
            </h1>

            {/* Panel Example */}
            <div className="rounded-xl bg-neutral-900/30 border border-accent/40 backdrop-blur-md shadow-inner p-6 space-y-4">
                <h2 className="text-2xl font-heading text-accent">Panel HUD</h2>
                <p className="text-secondary">
                    This panel simulates a glass-style UI component used in Projects or Logs. It uses a soft backdrop blur, accent border, and glow shadows.
                </p>
                <button className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-black rounded transition shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                    Execute System Test
                </button>
            </div>

            {/* Console Text Block */}
            <div className="bg-black/70 border border-cyan-500/40 rounded p-4 font-mono text-cyan-300 text-sm shadow-[0_0_12px_rgba(56,189,248,0.15)]">
                <p>[LOG] Ship Diagnostics: OK</p>
                <p>[CPU] 97.2% Uptime</p>
                <p>[CORE] Memory Coil Stabilized</p>
                <p>[VISOR] External camera arrays linked</p>
            </div>

            {/* Accent Glow Block */}
            <div className="h-24 bg-accent/10 border border-accent rounded flex items-center justify-center text-accent text-xl font-bold tracking-wide shadow-[0_0_16px_rgba(56,189,248,0.4)] animate-pulse">
                Neon Accent Pulse
            </div>

            {/* Secondary Color Display */}
            <div className="h-24 bg-secondary/10 border border-secondary rounded flex items-center justify-center text-secondary font-bold tracking-wide">
                Secondary Interface Zone
            </div>

            <footer className="text-center text-sm text-neutral-600 mt-10 font-mono">
                /theme · Visual system preview · Version 0.1
            </footer>
        </div>
    );
}
