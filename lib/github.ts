const TIMEOUT_MS = 5000;

type RepoResponse = { private?: boolean; stargazers_count?: number };

export async function fetchStarCount(repo: string, fetcher: typeof fetch = fetch): Promise<number | null> {
  try {
    const response = await fetcher(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status !== 200) {
      return null;
    }
    const body = (await response.json()) as RepoResponse;
    if (body.private !== false || typeof body.stargazers_count !== 'number') {
      return null;
    }
    return body.stargazers_count;
  } catch {
    return null;
  }
}
