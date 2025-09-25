import Link from "next/link";

import Card from "@/components/Card";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section
        id="hero"
        className="relative isolate bg-white px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32"
      >
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 rounded-l-[200px] bg-gradient-to-br from-cyan-100 via-white to-indigo-100 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.45)] sm:block" />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Software Engineer</p>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              I build reliable products that feel effortless to use.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              I partner with product teams to craft performant, accessible web experiences—from resilient design systems to
              immersive data visualizations that help people make better decisions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                View My Work
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-300 hover:text-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
          <div className="flex flex-1 justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Recent wins</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                    Shipping beautiful experiences, on-time and on-spec.
                  </h2>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>✨ Led rebuild of analytics dashboard adopted by 4 global teams.</li>
                  <li>⚙️ Built reusable component kit reducing QA defects by 35%.</li>
                  <li>🚀 Partnered with research to launch AI prototype in 6 weeks.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">About</h2>
          <p className="mt-6 text-lg text-slate-600">
            I specialize in translating complex requirements into clear, maintainable software. From rapid prototypes to
            large-scale launches, I care deeply about craftsmanship, accessibility, and collaborating with multidisciplinary teams
            to deliver outcomes that matter.
          </p>
        </div>
      </section>

      <section id="projects" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Projects</p>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Selected work that highlights craft and impact
            </h2>
            <p className="text-lg text-slate-600">
              Interfaces engineered for clarity, performance, and measurable business outcomes.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-900 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Contact</p>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to create something exceptional?
            </h2>
            <p className="text-lg text-slate-200">
              Drop me a line and let&apos;s explore how I can support your next initiative.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:hello@cameronloveland.dev"
              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              Email Me
            </Link>
            <Link
              href="https://www.linkedin.com/in/cameronloveland"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn
            </Link>
            <Link
              href="https://github.com/cameronloveland"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
