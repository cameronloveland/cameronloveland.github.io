import Link from "next/link";
import { Card } from "../components/Card";

const projects = [
  {
    title: "Space Cockpit Demo",
    description:
      "An immersive Three.js experiment that simulates a pilot's control deck with layered instrumentation, lighting, and responsive controls.",
    href: "/projects/space-cockpit",
    tags: ["Three.js", "React", "Postprocessing"],
  },
  {
    title: "Design Systems",
    description:
      "Establishing accessible component libraries with scalable design tokens and tooling that help teams ship with confidence.",
    tags: ["Design Ops", "Accessibility", "Storybook"],
  },
  {
    title: "Product Engineering",
    description:
      "Collaborating with cross-functional partners to build high-impact product experiences across web and mobile platforms.",
    tags: ["TypeScript", "Next.js", "Mobile"],
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:flex-row lg:items-center lg:justify-between" id="home">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-indigo/80">Software Engineer</p>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold text-slate-900 sm:text-5xl">Cameron Loveland</h1>
            <p className="text-lg leading-relaxed text-slate-600">
              I design and build thoughtful digital experiences that balance craft with measurable impact. From UX foundations to
              performant front-end systems, I love turning complex ideas into intuitive products.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Explore projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-brand-cyan hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get in touch
            </a>
          </div>
        </div>
        <div className="relative -mx-4 rounded-[2.5rem] bg-gradient-to-br from-brand-cyan/20 via-white to-brand-indigo/10 px-4 py-8 sm:-mx-0 sm:p-10 lg:w-1/2">
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-semibold text-slate-900">About</h2>
            <p className="text-base leading-relaxed text-slate-600">
              I bring a decade of experience building products for startups and global brands alike. My work spans design systems,
              creative tooling, and performance-focused engineering. I believe in delivering reliable software that feels as polished
              as it is practical.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-slate-400">Focus</p>
                <p>Product Engineering</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-slate-400">Strength</p>
                <p>Design Systems</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-soft sm:col-span-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">Location</p>
                <p>Seattle, WA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-slate-50 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-indigo/80">Projects</p>
            <h2 className="font-heading text-3xl font-semibold text-slate-900 sm:text-4xl">Selected work</h2>
            <p className="max-w-2xl text-base text-slate-600">
              A few highlights from recent projects that showcase product thinking, interaction design, and technical execution.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.title} title={project.title} description={project.description} href={project.href} tags={project.tags} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 text-center sm:px-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-indigo/80">Contact</p>
            <h2 className="font-heading text-3xl font-semibold text-slate-900 sm:text-4xl">Let’s build something together</h2>
            <p className="text-base leading-relaxed text-slate-600">
              Whether you’re building a new product or refining an existing experience, I’d love to collaborate.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-sm font-semibold text-slate-700">
            <Link
              href="mailto:cameron@loveland.dev"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              cameron@loveland.dev
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
              <Link
                href="https://github.com/cameronloveland"
                className="rounded-full px-4 py-2 transition hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/cameronloveland/"
                className="rounded-full px-4 py-2 transition hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
