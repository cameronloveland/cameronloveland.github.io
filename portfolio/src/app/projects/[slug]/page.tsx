import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProjectBySlug, projects } from "@/data/projects";

interface ProjectPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project not found | Cameron Loveland",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <div className="space-y-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-cyan-700 transition hover:text-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            &larr; All Projects
          </Link>
          <h1 className="font-display text-4xl font-semibold text-slate-900 sm:text-5xl">{project.title}</h1>
          <p className="text-lg text-slate-600">{project.description}</p>
        </div>
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 960px"
          />
        </div>
        <div className="space-y-6 text-base leading-relaxed text-slate-700">
          <p>{project.longDescription}</p>
          <p>
            Every engagement pairs thoughtful discovery with iterative delivery. I love partnering with design, research, and
            operations to ensure the solution scales with the organization and delights end users.
          </p>
        </div>
        <div>
          <Link
            href={project.demoUrl}
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            target="_blank"
            rel="noreferrer"
          >
            Launch Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
