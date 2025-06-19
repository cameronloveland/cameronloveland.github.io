export type Repo = {
  id: number;
  name: string;
  html_url: string;
  readmeSummary?: string;
  topics?: string[];
};

export const dummyRepos: Repo[] = [
  {
    id: 1,
    name: 'astro-visualizer',
    html_url: '#',
    readmeSummary: 'A 3D visualization tool for astronomy data using Three.js and React.',
    topics: ['threejs', 'react', 'visualization'],
  },
  {
    id: 2,
    name: 'weatherly',
    html_url: '#',
    readmeSummary: 'A beautiful weather dashboard powered by OpenWeatherMap API.',
    topics: ['nextjs', 'api', 'tailwindcss'],
  },
  {
    id: 3,
    name: 'portfolio-site',
    html_url: '#',
    readmeSummary: 'My personal portfolio and blog, statically generated with Next.js.',
    topics: ['nextjs', 'typescript', 'blog'],
  },
  {
    id: 4,
    name: 'taskmaster',
    html_url: '#',
    readmeSummary: 'A simple and effective task manager app.',
    topics: ['react', 'zustand', 'productivity'],
  },
  {
    id: 5,
    name: 'space-news',
    html_url: '#',
    readmeSummary: 'Aggregates the latest news from space agencies and astronomy blogs.',
    topics: ['news', 'api', 'react'],
  },
  {
    id: 6,
    name: 'code-snippets',
    html_url: '#',
    readmeSummary: 'A collection of useful code snippets for web development.',
    topics: ['javascript', 'typescript', 'snippets'],
  },
];
