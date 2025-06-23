import React from "react";

export function Footer() {
    return (
        <footer className=" text-xs fixed bottom-0 w-full px-6 py-4 flex items-center justify-between bg-neutral-500-950/40 text-neutral-400 text-sm  border-neutral-800 z-40">
            <div className="flex-1 ">© {new Date().getFullYear()} Cameron Loveland</div>
            <div className="flex-1 text-right">
            </div>
        </footer >
    );
}