import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Cockpit Demo | Cameron Loveland",
  description:
    "Explore the interactive 3D cockpit demo showcasing immersive UI design, layered instrumentation, and real-time effects.",
};

const cockpitDemoUrl = "/docs/index.html";

export default function SpaceCockpitPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
        <div className="space-y-6 text-left">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-cyan hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            ← Back to portfolio
          </Link>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-indigo/80">Project</p>
            <h1 className="font-heading text-4xl font-semibold text-slate-900 sm:text-5xl">Space Cockpit Demo</h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600">
              This concept explores how cinematic UI patterns translate to the browser. The 3D cockpit layers real-time lighting,
              post-processing, and spatial audio to create a focused command center experience for spaceflight simulation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={cockpitDemoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Launch demo
            </Link>
            <Link
              href="https://github.com/cameronloveland"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-brand-cyan hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              View more work
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-soft">
          <iframe
            src={cockpitDemoUrl}
            title="Space cockpit interactive demo"
            className="aspect-video w-full"
            loading="lazy"
          />
        </div>
        <div className="space-y-4 text-base leading-relaxed text-slate-600">
          <p>
            Built with Three.js, React Three Fiber, and a layer of post-processing effects, the cockpit demonstrates how advanced
            visual experiences can remain performant and accessible on the web. Every element—from depth-of-field to parallaxed UI
            panels—responds to the user, creating a sense of immersion without sacrificing usability.
          </p>
          <p>
            The project also informed broader design system work, inspiring motion principles and interaction patterns that now
            appear across other product experiences.
          </p>
        </div>
      </section>
    </div>
  );
}
