"use client";
import { useEffect, useState } from "react";

const ids = ["section-1", "section-2", "section-3"];

export default function ScrollDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

   const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: null, threshold: 0.55 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    document.getElementById(ids[i])?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {ids.map((_, i) => (
        <button
          key={i}
          aria-label={`Go to section ${i + 1}`}
          onClick={() => jump(i)}
          className={[
            "transition-all duration-200 rounded-full",
            i === active ? "h-3 w-3 bg-cyan-300 ring ring-cyan-400" : "h-2 w-2 bg-cyan-200/50 hover:bg-cyan-200"
          ].join(" ")}
        />
      ))}
    </div>
  );
}
