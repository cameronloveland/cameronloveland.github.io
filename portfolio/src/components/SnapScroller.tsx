"use client";
import { useEffect, useRef } from "react";
import ScrollDots from "./ScrollDots";

export default function SnapScroller() {
  const ref = useRef<HTMLDivElement>(null);

  // Drive CSS var --scrollP from progress between section 1 top and section 2 top
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s1 = document.getElementById("section-1");
        const s2 = document.getElementById("section-2");
        if (!s1 || !s2) return;
        const top1 = s1.getBoundingClientRect().top;
        const top2 = s2.getBoundingClientRect().top;
        const vh = window.innerHeight;
        // Normalize progress: when s1 is aligned (top=0) => 0, when s2 is aligned => 1
        const progress = 1 - Math.min(1, Math.max(0, top2 / vh));
        document.documentElement.style.setProperty("--scrollP", progress.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <ScrollDots />
      <div
        ref={ref}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        <section id="section-1" className="snap-start min-h-screen flex items-center justify-center">
          {/* your hero/cockpit content (current state) */}
        </section>

        <section id="section-2" className="snap-start min-h-screen flex items-center justify-center">
          {/* second page content */}
        </section>

        <section id="section-3" className="snap-start min-h-screen flex items-center justify-center">
          {/* third page content */}
        </section>
      </div>
    </>
  );
}
