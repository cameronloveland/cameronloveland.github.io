"use client";
import Image from "next/image";
import { useEffect } from "react";
import { SpaceBackground } from "./background";

export default function ParallaxSpace() {
  // Ensure CSS var exists on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--scrollP", "0");
  }, []);

  return (
    <>
      {/* Stars layer */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <SpaceBackground showEarth={false} />
      </div>

      {/* Earth layer */}
      <div
        aria-hidden
        className="fixed inset-0 -z-40 grid place-items-center pointer-events-none"
        style={{
          transform:
            "translateY(calc(-220px * var(--scrollP))) scale(calc(1 - 0.05 * var(--scrollP)))",
          opacity: "calc(1 - 0.65 * var(--scrollP))",
          transition: "transform 0.1s linear, opacity 0.1s linear",
        }}
      >
        <Image
          src="/textures/earth.png"
          alt=""
          width={1400}
          height={1400}
          priority
          className="select-none"
        />
      </div>
    </>
  );
}
