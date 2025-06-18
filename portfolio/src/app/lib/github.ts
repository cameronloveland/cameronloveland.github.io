// lib/getCommits.ts

export async function getRecentCommits() {
    const res = await fetch(
        "https://api.github.com/repos/cameronloveland/cameronloveland.github.io/commits?per_page=5",
        {
            headers: {
                Accept: "application/vnd.github.v3+json",
                // Optional: include a token if rate-limited
                // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
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

    return commits.slice(0, 4).map((commit: GitHubCommit) => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
    }));
}

export async function getBranches() {
    const res = await fetch(
        "https://api.github.com/repos/cameronloveland/cameronloveland.github.io/branches",
        {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
            next: { revalidate: 3600 },
        }
    );
    if (!res.ok) throw new Error("Failed to fetch branches");
    const branches = await res.json();

    type GitHubBranch = {
        name: string;
        protected: boolean;
    };

    return branches.slice(0, 5).map((branch: GitHubBranch) => ({
        message: `Branch: ${branch.name}`,
        date: new Date().toISOString(),
        author: 'GitHub',
    }));

}
export async function getOpenPRs() {
    const res = await fetch(
        "https://api.github.com/repos/cameronloveland/cameronloveland.github.io/pulls?state=open&per_page=5",
        {
            headers: {
                Accept: "application/vnd.github.v3+json",
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

    return prs.slice(0, 5).map((pr: GitHubPR) => ({
        message: `PR: ${pr.title}`,
        url: pr.html_url,
        author: pr.user.login,
        date: pr.created_at,
    }));
}
