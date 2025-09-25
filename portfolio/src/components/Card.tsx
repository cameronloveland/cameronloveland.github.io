import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  description: string;
  href?: string;
  eyebrow?: string;
  tags?: string[];
  children?: ReactNode;
  actions?: CardAction[];
}

export interface CardAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  external?: boolean;
}

export function Card({ title, description, href, eyebrow, tags, children, actions }: CardProps) {
  const content = (
    <article className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl">
      <div className="space-y-4">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-indigo">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-semibold text-brand-midnight">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-700">{description}</p>
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
      <div className="mt-6 flex flex-wrap gap-3">
        {actions?.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noreferrer noopener" : undefined}
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              action.variant === "primary"
                ? "bg-brand-midnight text-white hover:bg-brand-indigo"
                : "border border-slate-200 text-brand-midnight hover:border-brand-cyan hover:text-brand-indigo"
            }`}
          >
            {action.label}
          </Link>
        ))}
        {!actions?.length && href ? (
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-midnight transition hover:border-brand-cyan hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            View project →
          </Link>
        ) : null}
      </div>
    </article>
  );
  return content;
}
