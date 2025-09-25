import { getReposWithReadme } from "../api/github";

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

  return (
    <div className="page">
      <header className="hero">
        <div className="wrapper">
          <nav className="hero__nav" aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#writing">Writing</a>
            <a href="https://github.com/cameronloveland" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>

          <p className="hero__eyebrow">Cameron Loveland · Software Engineer</p>
          <h1 className="hero__title">Building thoughtful, easy-to-use experiences.</h1>
          <p className="hero__summary">
            I focus on crafting intuitive interfaces and resilient systems. This space keeps everything in one
            place — recent projects, experiments, and long-form updates as I keep building.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#projects">
              Explore projects
            </a>
            <a
              className="button button--ghost"
              href="mailto:hello@cameronloveland.com"
              aria-label="Email Cameron"
            >
              Say hello
            </a>
          </div>
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

          {curatedProjects.length > 0 ? (
            <div className="card-grid">
              {curatedProjects.map((repo) => {
                const projectLink = repo.homepage || repo.html_url;
                return (
                  <article key={repo.id} className="card">
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
                        Source
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
