import React from "react";

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full px-6 py-4 flex items-center justify-between bg-neutral-950/80 text-neutral-400 text-sm border-t border-neutral-800 z-40">
            <div className="flex-1">© {new Date().getFullYear()} Cameron Loveland</div>
            <div className="flex-1 text-right">
            </div>
        </footer >
    );
}