import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  href?: string;
  eyebrow?: string;
  tags?: string[];
  children?: ReactNode;
}

export function Card({ title, description, href, eyebrow, tags, children }: CardProps) {
  const content = (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:-translate-y-1 group-focus-visible:shadow-xl">
      <div className="space-y-4">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-indigo/70">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        {tags && tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
      {href ? (
        <p className="mt-6 text-sm font-semibold text-brand-cyan transition group-hover:text-brand-indigo group-focus-visible:text-brand-indigo">View project →</p>
      ) : null}
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {content}
      </Link>
    );
  }

  return content;
}
