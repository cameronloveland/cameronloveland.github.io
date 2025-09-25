
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

type GitHubRepo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    topics?: string[];
    stargazers_count: number;
    fork: boolean;
    language: string | null;
    pushed_at: string;
};

export type Repo = GitHubRepo & {
    readmeSummary: string;
};

function toPlainText(markdown: string) {
    return markdown
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^\)]+\)/g, "")
        .replace(/\[[^\]]+\]\(([^\)]+)\)/g, "$1")
        .replace(/#+\s*/g, "")
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export async function getReposWithReadme(): Promise<Repo[]> {
    try {
        const res = await fetch('https://api.github.com/users/cameronloveland/repos', {
            headers: {
                Accept: 'application/vnd.github.v3+json'
            },
            next: { revalidate: 3600 },
        });
        if (!res.ok) { throw new Error('Failed to fetch repos'); }
        const repos = await res.json() as GitHubRepo[];

        const reposWithReadme: Repo[] = await Promise.all(
            repos.map(async (repo): Promise<Repo> => {
                try {

                    const readmeRes = await fetch(
                        `https://api.github.com/repos/cameronloveland/${repo.name}/readme`,
                        {
                            headers: { Accept: 'application/vnd.github.v3.raw' },
                        },

                    );
                    if (!readmeRes.ok) {
                        const fallback = toPlainText(repo.description ?? "");
                        return { ...repo, readmeSummary: fallback };
                    }
                    const readme = await readmeRes.text();
                    const summary = readme
                        .split(/\r?\n\r?\n/)
                        .map((s) => s.trim())
                        .find((s) => s && !s.startsWith('#')) || repo.description || "";
                    return { ...repo, readmeSummary: toPlainText(summary) };
                } catch {
                    const fallback = toPlainText(repo.description ?? "");
                    return { ...repo, readmeSummary: fallback };
                }
            })
        );

        return reposWithReadme;
    } catch {
        return [];
    }
}
