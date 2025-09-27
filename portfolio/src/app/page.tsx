import { getReposWithReadme } from "../api/github";
import Image from "next/image";
import Link from "next/link";

const writingHighlights = [
  {
    title: "Rebooting my portfolio",
    description:
      "Kicking off a simpler space for my work — what I'm building next and how I make it approachable.",
    dateLabel: "Coming soon",
    href: "https://github.com/cameronloveland",
  },
  {
    title: "Build logs & notes",
    description:
      "A running journal of experiments, prototypes, and lessons learned while shipping new ideas.",
    dateLabel: "Coming soon",
    href: "https://github.com/cameronloveland?tab=repositories",
  },
  {
    title: "Bolt.new hackathon — Tavernborn",
    description: "Built a small prototype for the Bolt.new dev hackathon. I put together a short demo and submission on Devpost.",
    dateLabel: "June",
    href: "https://devpost.com/software/tavernborn",
  },
];

function formatRepoName(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function Home() {
  const repos = await getReposWithReadme();

  const curatedProjects = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 6);

  // augment curated projects with manual entries/fallbacks
  const extraProjects = [
    {
      id: -1,
      name: 'tavernborn-devpost',
      description: 'Tavernborn — dev hackathon entry on Bolt.new',
      html_url: 'https://devpost.com/software/tavernborn',
      homepage: 'https://devpost.com/software/tavernborn',
      topics: ['hackathon'],
      stargazers_count: 0,
      fork: false,
      language: null,
      pushed_at: new Date().toISOString(),
      readmeSummary: 'Devpost submission for the Tavernborn hackathon build.',
      previewImage: null,
      default_branch: 'main',
    },
    {
      id: -2,
      name: 'tavernborn-live',
      description: 'Tavernborn — live site (stub)',
      html_url: '#',
      homepage: '#',
      topics: ['games'],
      stargazers_count: 0,
      fork: false,
      language: null,
      pushed_at: new Date().toISOString(),
      readmeSummary: 'Placeholder for the full Tavernborn live release (coming soon).',
      previewImage: null,
      default_branch: 'main',
    },
  ];

  const allProjects = [...extraProjects, ...curatedProjects];

  return (
    <div className="page">
      <header className="hero">
        <div className="wrapper">
          <nav className="hero__nav" aria-label="Primary">
            <Link href="/" className="nav-pill">Home</Link>
            <a href="#projects">Projects</a>
            <a href="#blog">Blog</a>
            <a className="nav-pill" href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>

          {/* Title above name */}
          <p className="hero__eyebrow">Software Engineer</p>
          {/* Name larger */}
          <h2 className="hero__name">Cameron Loveland</h2>
          <h1 className="hero__subtitle">Personal Portfolio</h1>
          <p className="hero__summary">
            What I&apos;m doing lately
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#projects">
              Explore projects
            </a>
          </div>

          {/* hero project preview removed per request */}
        </div>
      </header>

      <section id="projects" className="section">
        <div className="wrapper">
          <div className="section-header">
            <h2 className="section-title">Featured projects</h2>
            <p className="section-description">
              A rotating selection of work from GitHub. Each project includes a short summary so you can get a feel
              for the idea before diving in.
            </p>
          </div>

          {allProjects.length > 0 ? (
            <div className="card-grid">
              {allProjects.map((repo) => {
                const projectLink = repo.homepage || repo.html_url;
                // determine project type slug and label (prefer topics)
                const topicCandidate = Array.isArray(repo.topics) && repo.topics.length > 0 ? repo.topics[0].toString().toLowerCase().replace(/\s+/g, '-') : null;
                let projectTypeSlug = topicCandidate || 'project';
                // if this is the portfolio repo, treat it as web-design
                if (repo.name === 'cameronloveland.github.io' || repo.name === 'cameronloveland.github.io'.toLowerCase()) {
                  projectTypeSlug = 'web-design';
                }
                // derive a display label for the banner
                const projectTypeLabelMap: Record<string, string> = {
                  'hackathon': 'Hackathon',
                  'games': 'Game',
                  'web-design': 'Web design',
                  'website': 'Website',
                  'project': 'Project',
                };
                const projectTypeLabel = projectTypeLabelMap[projectTypeSlug] || projectTypeSlug.replace(/-/g, ' ');

                return (
                  <article key={repo.id} className="card">
                    <div className="card-image-wrap">
                      <Image
                        src={repo.previewImage || '/file.svg'}
                        alt={`${repo.name} preview`}
                        className="card-image"
                        width={800}
                        height={420}
                        unoptimized
                      />

                      {/* colorful banner for project type */}
                      <div className={`project-type-banner project-type-${projectTypeSlug}`}>{projectTypeLabel}</div>
                    </div>
                    <h3>{formatRepoName(repo.name)}</h3>
                    <p>{repo.readmeSummary || "Project details coming soon."}</p>

                    <div className="tag-list" aria-label="Project metadata">
                      {repo.language ? <span className="tag">{repo.language}</span> : null}
                      {repo.stargazers_count > 0 ? (
                        <span className="tag">★ {repo.stargazers_count}</span>
                      ) : null}
                      {Array.isArray(repo.topics)
                        ? repo.topics.slice(0, 3).map((topic) => (
                          <span key={topic} className="tag">
                            {topic}
                          </span>
                        ))
                        : null}
                    </div>

                    <div className="card-footer">
                      <a className="button button--primary" href={projectLink} target="_blank" rel="noopener noreferrer">
                        View project
                      </a>
                      <a className="button button--ghost" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        Code
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="section-description">
              Project highlights will appear here once GitHub repositories are ready to showcase.
            </p>
          )}
        </div>
      </section>

      <section id="writing" className="section">
        <div className="wrapper">
          <div className="section-header">
            <h2 className="section-title">Writing & updates</h2>
            <p className="section-description">
              Long-form notes, behind-the-scenes breakdowns, and a running changelog of what I&apos;m exploring. First
              entries are on the way — check back soon.
            </p>
          </div>

          <div className="writing-list">
            {writingHighlights.map((entry) => (
              <article key={entry.title} className="writing-item">
                <time aria-label="Publishing status">{entry.dateLabel}</time>
                <h3>
                  <a href={entry.href} target="_blank" rel="noopener noreferrer">
                    {entry.title}
                  </a>
                </h3>
                <p>{entry.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrapper footer-inner">
          <span>© {new Date().getFullYear()} Cameron Loveland. Built with intention and plenty of coffee.</span>
          <div className="footer-links" aria-label="Secondary links">
            <a href="mailto:hello@cameronloveland.com">Email</a>
            <a href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
