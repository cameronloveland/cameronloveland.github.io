
export async function getRecentCommits() {
    const res = await fetch(
        "https://api.github.com/repos/cameronloveland/cameronloveland.github.io/commits?per_page=6",
        {
            headers: {
                Accept: "application/vnd.github.v3+json"
            },
            next: { revalidate: 3600 }, // Revalidate every hour
        }
    );

    if (!res.ok) throw new Error("Failed to fetch commits");

    const commits = await res.json();

    type GitHubCommit = {
        commit: {
            message: string;
            author: {
                name: string;
                date: string;
            };
        };
        html_url: string;
    };

    return commits.map((commit: GitHubCommit) => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
    }));
}

export async function getOpenPRs() {
    const res = await fetch(
        "https://api.github.com/repos/cameronloveland/cameronloveland.github.io/pulls?state=open&per_page=6",
        {
            headers: {
                Accept: "application/vnd.github.v3+json"
            },
            next: { revalidate: 3600 },
        }
    );
    if (!res.ok) throw new Error("Failed to fetch PRs");
    const prs = await res.json();

    type GitHubPR = {
        title: string;
        html_url: string;
        user: {
            login: string;
        };
        created_at: string;
    };

    return prs.map((pr: GitHubPR) => ({
        message: `PR: ${pr.title}`,
        url: pr.html_url,
        author: pr.user.login,
        date: pr.created_at,
    }));
}

export type Repo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    readmeSummary: string | null;
    topics?: string[];
};

export async function getReposWithReadme() {
    const res = await fetch('https://api.github.com/users/cameronloveland/repos', {
        headers: {
            Accept: 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 },
    });
    console.log(res);
    if (!res.ok) { throw new Error('Failed to fetch repos'); }
    const repos = await res.json() as Repo[];

    const reposWithReadme = await Promise.all(
        repos.map(async (repo) => {
            try {

                const readmeRes = await fetch(
                    `https://api.github.com/repos/cameronloveland/${repo.name}/readme`,
                    {
                        headers: { Accept: 'application/vnd.github.v3.raw' },
                    },

                );
                if (!readmeRes.ok) return { ...repo, readmeSummary: repo.description || "" };
                const readme = await readmeRes.text();
                const summary = readme
                    .split(/\r?\n\r?\n/)
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
