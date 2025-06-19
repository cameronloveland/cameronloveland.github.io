export type Repo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    readmeSummary: string | null;
    topics?: string[];
};


export async function getReposWithReadme() {
    const response = await fetch('https://api.github.com/users/cameronloveland/repos', {
        headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    });
    if (!response.ok) throw new Error('Failed to fetch repos');
    const repos: Repo[] = await response.json();

    // Fetch README for each repo and extract the first paragraph
    const reposWithReadme = await Promise.all(
        repos.map(async (repo) => {
            try {
                const readmeRes = await fetch(
                    `https://api.github.com/repos/cameronloveland/${repo.name}/readme`,
                    { headers: { Accept: 'application/vnd.github.v3.raw' } }
                );
                if (!readmeRes.ok) return { ...repo, readmeSummary: repo.description || "" };
                const readme = await readmeRes.text();
                // Extract the first non-empty line (or paragraph)
                const summary = readme
                    .split(/\r?\n\r?\n/) // split by paragraphs
                    .map((s) => s.trim())
                    .find((s) => s && !s.startsWith('#')) || repo.description || "";
                return { ...repo, readmeSummary: summary };
            } catch {
                return { ...repo, readmeSummary: repo.description || "" };
            }
        })
    );

    return reposWithReadme;
}
