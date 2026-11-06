import { describe, expect, it } from 'vitest';
import { fetchStarCount, placeholderStarCount } from '@/lib/github';

function mockFetch(status: number, body: unknown): typeof fetch {
  return () => Promise.resolve(new Response(JSON.stringify(body), { status }));
}

describe('fetchStarCount', () => {
  it('returns the count for a public repo', async () => {
    expect(await fetchStarCount('a/b', mockFetch(200, { private: false, stargazers_count: 12 }))).toBe(12);
  });

  it.each([
    [404, {}],
    [403, { message: 'rate limit' }],
    [200, { private: true, stargazers_count: 3 }],
  ])('returns null for %s %j', async (status, body) => {
    expect(await fetchStarCount('a/b', mockFetch(status, body))).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    expect(await fetchStarCount('a/b', () => Promise.reject(new Error('x')))).toBeNull();
  });

  it('requests the repo from the GitHub API with a timeout', async () => {
    let request: { url: string; signal?: AbortSignal | null } | undefined;
    const fetcher: typeof fetch = (input, init) => {
      request = { url: String(input), signal: init?.signal };
      return Promise.resolve(new Response(JSON.stringify({ private: false, stargazers_count: 1 })));
    };

    await fetchStarCount('databasifylabs/databasify', fetcher);

    expect(request?.url).toBe('https://api.github.com/repos/databasifylabs/databasify');
    expect(request?.signal).toBeInstanceOf(AbortSignal);
  });
});

describe('placeholderStarCount', () => {
  it('reads a whole number', () => {
    expect(placeholderStarCount('1234')).toBe(1234);
  });

  it.each([[undefined], [''], ['abc'], ['-5'], ['1.5']])('returns null for %j', (value) => {
    expect(placeholderStarCount(value)).toBeNull();
  });
});
