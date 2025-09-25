export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  demoUrl: string;
};

export const projects: Project[] = [
  {
    slug: "mission-control",
    title: "Mission Control Dashboard",
    description:
      "Real-time telemetry and alerting platform for monitoring complex satellite constellations.",
    image: "/images/mission-control.svg",
    longDescription:
      "Mission Control Dashboard combines satellite health, telemetry, and anomaly detection into a single, responsive workspace. Built with Next.js and WebGL visualizations, it empowers operators to triage issues in seconds with curated alerts, replay tools, and collaborative annotations.",
    demoUrl: "https://github.com/cameronloveland/mission-control",
  },
  {
    slug: "aurora-studio",
    title: "Aurora Experience Studio",
    description:
      "Low-code builder for immersive product tours that adapt to any device and brand palette.",
    image: "/images/aurora-studio.svg",
    longDescription:
      "Aurora Studio lets marketing teams compose cinematic product walkthroughs with drag-and-drop scenes, dynamic lighting, and native analytics. The authoring UI leverages 3D canvases and server actions to generate optimized media for web and mobile distribution.",
    demoUrl: "https://github.com/cameronloveland/aurora-studio",
  },
  {
    slug: "atlas-insights",
    title: "Atlas Insights",
    description:
      "AI-assisted research companion that summarises meetings, highlights risks, and recommends next steps.",
    image: "/images/atlas-insights.svg",
    longDescription:
      "Atlas Insights captures multi-stream meeting data, transcribes in real time, and distills decision-ready summaries enriched with sentiment analysis. A modular pipeline orchestrates transcription, embeddings, and vector search to surface the most actionable intelligence for product and leadership teams.",
    demoUrl: "https://github.com/cameronloveland/atlas-insights",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
