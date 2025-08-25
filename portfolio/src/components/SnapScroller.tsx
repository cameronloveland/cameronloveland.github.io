"use client";
import { useEffect, useRef, ReactNode, Children } from "react";
import ScrollDots from "./ScrollDots";

interface SnapScrollerProps {
  children: ReactNode;
}

export default function SnapScroller({ children }: SnapScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Drive CSS var --scrollP from progress between section 1 top and section 2 top
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s2 = document.getElementById("section-2");
        if (!s2) return;
        const top2 = s2.getBoundingClientRect().top;
        const vh = window.innerHeight;
        // Normalize progress: when s1 is aligned (top=0) => 0, when s2 is aligned => 1
        const progress = 1 - Math.min(1, Math.max(0, top2 / vh));
        document.documentElement.style.setProperty("--scrollP", progress.toFixed(4));
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const sections = Children.toArray(children);

  return (
    <>
      <ScrollDots />
      <div
        ref={ref}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {sections.map((child, i) => (
          <section
            key={i}
            id={`section-${i + 1}`}
            className={
              "snap-start min-h-screen" +
              (i === 0 ? "" : " flex items-center justify-center")
            }
          >
            {child}
          </section>
        ))}
      </div>
    </>
  );
}
