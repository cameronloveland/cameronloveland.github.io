import React from 'react';

interface TemplateProps {
  title: string;
  children: React.ReactNode;
}

export default function MinimalTemplate({ title, children }: TemplateProps) {
  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      {children}
    </main>
  );
}
