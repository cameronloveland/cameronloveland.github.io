import React from "react";
import { MdEmail } from "react-icons/md";

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full px-6 py-4 flex items-center justify-between bg-neutral-950/80 text-neutral-400 text-sm border-t border-neutral-800 z-40">
            <div className="flex-1">© {new Date().getFullYear()} Cameron Loveland</div>
            <div className="flex-1 text-right">
                <a
                    href="mailto:"
                    className="hover:text-white transition inline-flex items-center gap-2"
                >
                    <MdEmail className="w-5 h-5" />
                    cameron.loveland
                </a>
            </div>
        </footer>
    );
}