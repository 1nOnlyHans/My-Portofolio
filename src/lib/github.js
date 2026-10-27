const BASE = "https://api.github.com";

export const GITHUB_USERNAME = "1nOnlyHans";

export const githubRoutes = {
  user: (username = GITHUB_USERNAME) => `${BASE}/users/${username}`,
  repos: (username = GITHUB_USERNAME, { sort = "updated", perPage = 30, page = 1 } = {}) =>
    `${BASE}/users/${username}/repos?sort=${sort}&per_page=${perPage}&page=${page}`,
  repo: (owner, repo) => `${BASE}/repos/${owner}/${repo}`,
  languages: (owner, repo) => `${BASE}/repos/${owner}/${repo}/languages`,
  readme: (owner, repo) => `${BASE}/repos/${owner}/${repo}/readme`,
  commits: (owner, repo, perPage = 10) =>
    `${BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  // Third-party proxy (scrapes the public profile graph; GitHub's own endpoint has no CORS).
  contributions: (username = GITHUB_USERNAME) =>
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
  events: (username = GITHUB_USERNAME, perPage = 100) =>
    `${BASE}/users/${username}/events/public?per_page=${perPage}`,
};

// Usage: const repos = await githubFetch(githubRoutes.repos());
export async function githubFetch(url, signal) {
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  return res.json();
}
