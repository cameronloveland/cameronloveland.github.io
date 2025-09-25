import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/data/projects";

interface CardProps {
  project: Project;
}

export default function Card({ project }: CardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
        </div>
        <div className="mt-auto">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            View Project
          </Link>
        </div>
      </div>
    </article>
  );
}
