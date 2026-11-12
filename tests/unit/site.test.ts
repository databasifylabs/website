import { describe, expect, it } from 'vitest';
import {
  COMPARISON,
  FAQ,
  FEATURES,
  HEADLINE,
  HEADLINE_LINES,
  INSTALL_COMMAND,
  LINKS,
  STEPS,
  SUBLINE,
  TAGLINE,
  TOUR,
} from '@/lib/site';

describe('site content', () => {
  it('uses the exact install command and links', () => {
    expect(INSTALL_COMMAND).toBe('curl -fsSL https://get.databasify.io/install.sh | sudo bash');
    expect(LINKS).toEqual({
      getStarted: 'https://docs.databasify.io/getting-started/installation/',
      docs: 'https://docs.databasify.io',
      github: 'https://github.com/databasifylabs/databasify',
      security: 'https://docs.databasify.io/project/security/',
      contributing: 'https://docs.databasify.io/project/contributing/',
      license: 'https://github.com/databasifylabs/databasify/blob/0.x/LICENSE',
    });
    expect(TAGLINE).toBe('Open-source, self-hostable DBaaS alternative to DigitalOcean Managed Databases, Amazon RDS & Aiven.');
    expect(TOUR.map((t) => t.screen)).toEqual(['/screens/clusters', '/screens/backups', '/screens/migrations', '/screens/monitoring', '/screens/domains']);
  });

  it('stacks the headline sentence on three lines', () => {
    expect(HEADLINE).toBe('Deploy database clusters without the busywork');
    expect(HEADLINE_LINES).toEqual(['Deploy', 'Database Clusters', 'Without the Busywork']);
    expect(HEADLINE_LINES.join(' ').toLowerCase()).toBe(HEADLINE.toLowerCase());
  });

  it('has the section sizes the page expects', () => {
    expect(FEATURES).toHaveLength(9);
    expect(TOUR.map((t) => t.id)).toEqual(['clusters', 'backups', 'migrations', 'monitoring', 'domains']);
    expect(STEPS).toHaveLength(3);
    expect(FAQ).toHaveLength(9);
    expect(COMPARISON.length).toBeGreaterThan(0);
  });

  it('never claims forbidden things anywhere in the copy', () => {
    const all = JSON.stringify({ TAGLINE, SUBLINE, FEATURES, TOUR, STEPS, COMPARISON, FAQ }).toLowerCase();
    for (const bad of ['clusters, not single', '$', 'per month', 'testimonial', 'downloads']) {
      expect(all).not.toContain(bad);
    }
    expect(all).toContain('from a single node to a highly available cluster');
  });

  it('FAQ says PITR is not available for Valkey, Redis and MongoDB 9.0', () => {
    expect(FAQ.map((f) => f.a).join(' ')).toMatch(/not available for MongoDB 9\.0, Valkey and Redis/);
  });
});
