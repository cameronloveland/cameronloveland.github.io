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

    return commits.slice(0, 5).map((commit: GitHubCommit) => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
    }));
}
