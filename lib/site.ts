import type { icons } from 'lucide-react';

export type LucideIconName = keyof typeof icons;

export const INSTALL_COMMAND = 'curl -fsSL https://get.databasify.io/install.sh | sudo bash';

export const TAGLINE = 'Open-source, self-hostable DBaaS alternative to DigitalOcean Managed Databases, Amazon RDS & Aiven.';
export const HEADLINE = 'Deploy database clusters without the busywork';
export const HEADLINE_LINES = ['Deploy', 'Database Clusters', 'Without the Busywork'] as const satisfies readonly [string, string, string];
export const CTA_LABELS = { getStarted: 'Get Started', starOnGitHub: 'Star on GitHub' } as const;
export const HERO_PILL = 'Open source · Apache 2.0';
export const SUBLINE = `${TAGLINE} From a single node to a highly available cluster.`;

export const SITE_URL = 'https://databasify.io';
export const SITE_TITLE = `Databasify — ${HEADLINE}`;
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: `The Databasify logo, the headline "${HEADLINE}" and the Databasify dashboard` } as const;

export const GITHUB_REPO = 'databasifylabs/databasify';

export const LINKS = {
  getStarted: 'https://docs.databasify.io/getting-started/installation/',
  docs: 'https://docs.databasify.io',
  github: `https://github.com/${GITHUB_REPO}`,
  security: 'https://docs.databasify.io/project/security/',
  contributing: 'https://docs.databasify.io/project/contributing/',
  license: `https://github.com/${GITHUB_REPO}/blob/0.x/LICENSE`,
} as const;

export const ENGINES = [
  { id: 'postgres', name: 'PostgreSQL', versions: ['17', '18'], icon: '/icons/database-providers/postgres.svg' },
  { id: 'mysql', name: 'MySQL', versions: ['8.4', '9.7'], icon: '/icons/database-providers/mysql.svg' },
  { id: 'mariadb', name: 'MariaDB', versions: ['11.4', '11.8'], icon: '/icons/database-providers/mariadb.svg' },
  { id: 'mongodb', name: 'MongoDB', versions: ['7.0', '8.0', '9.0'], icon: '/icons/database-providers/mongodb.svg' },
  { id: 'valkey', name: 'Valkey', versions: ['8', '9'], icon: '/icons/database-providers/valkey.svg' },
  { id: 'redis', name: 'Redis', versions: ['8'], icon: '/icons/database-providers/redis.svg' },
] as const;

export const FEATURES = [
  {
    title: 'Single node to HA cluster',
    body: 'Start with one node. Add up to 2 standbys and read-only nodes when you need them.',
    icon: 'Layers',
  },
  {
    title: 'Automatic failover',
    body: 'Each engine fails over with its own tooling, so it keeps working while the Databasify app is down.',
    icon: 'RefreshCcw',
  },
  {
    title: 'Point-in-time recovery',
    body: 'Archive to S3-compatible storage such as Cloudflare R2 and restore to any moment.',
    icon: 'ClockArrowDown',
  },
  {
    title: 'TLS everywhere',
    body: 'Every connection uses TLS, with private networking and firewall rules around your nodes.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Live migrations',
    body: 'Copy an existing database, keep it in sync and cut over when you are ready.',
    icon: 'ArrowRightLeft',
  },
  {
    title: 'Your own domain',
    body: 'Hostnames on your domain through Cloudflare DNS that follow the primary after a failover.',
    icon: 'Globe',
  },
  {
    title: 'Connection pools & users',
    body: 'Manage users and schemas, plus PostgreSQL connection pools and trusted sources.',
    icon: 'Users',
  },
  {
    title: 'Metrics, logs & alerts',
    body: 'Node metrics, live activity logs and email alerts in one place.',
    icon: 'Activity',
  },
  {
    title: 'Hands-off updates',
    body: 'Patch updates install on their own in a weekly maintenance window.',
    icon: 'Wrench',
  },
] as const satisfies readonly { title: string; body: string; icon: LucideIconName }[];

export const TOUR = [
  {
    id: 'clusters',
    label: 'Clusters & failover',
    body: 'Run a database on one node or as a highly available cluster. Each engine uses its own failover tooling, so a failover works even when the Databasify app is down.',
    bullets: [
      'A primary, up to 2 standbys and read-only nodes',
      'Automatic failover with three voting nodes',
      'Patroni and etcd, InnoDB Cluster, Galera, replica sets or Sentinel',
    ],
    screen: '/screens/clusters',
  },
  {
    id: 'backups',
    label: 'Backups & PITR',
    body: 'Archive to any S3-compatible bucket and restore to a point in time. Add a bucket once and pick it on any database.',
    bullets: [
      'PostgreSQL, MySQL, MariaDB and MongoDB 7.0 and 8.0',
      'Cloudflare R2, AWS S3, MinIO and other S3-compatible storage',
      'The bucket is tested before it is saved',
    ],
    screen: '/screens/backups',
  },
  {
    id: 'migrations',
    label: 'Migrations',
    body: 'Move an existing database of the same engine into Databasify. The source is checked first, then you copy it once or keep it in sync until you cut over.',
    bullets: [
      'Continuous sync with a cutover when the lag reaches zero',
      'One-time copy when you only need a snapshot',
      'Works with any reachable server of the same engine',
    ],
    screen: '/screens/migrations',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    body: 'See node status, metrics and live activity logs for every database. Email alerts tell you when something needs attention.',
    bullets: ['Node status and metrics', 'Live activity logs', 'Email alerts to the owner account'],
    screen: '/screens/monitoring',
  },
  {
    id: 'domains',
    label: 'Domains & TLS',
    body: 'Connect Cloudflare and every database gets hostnames on your own domain that follow the primary. All connections use TLS, and certificates renew on their own.',
    bullets: [
      'Hostnames on your domain through Cloudflare DNS',
      'TLS on every connection, CA optional',
      'Private networking and firewall rules',
    ],
    screen: '/screens/domains',
  },
] as const satisfies readonly {
  id: 'clusters' | 'backups' | 'migrations' | 'monitoring' | 'domains';
  label: string;
  body: string;
  bullets: readonly [string, string, string];
  screen: string;
}[];

export const STEPS = [
  { title: 'Install Databasify', body: 'Run one command on a Linux server with at least 1 GB of memory.' },
  {
    title: 'Add your servers',
    body: 'Connect servers over SSH, or order them on DigitalOcean, Hetzner, Vultr or Linode.',
  },
  { title: 'Create a database', body: 'Pick an engine and version, then connect over TLS.' },
] as const;

export const COMPARISON = [
  {
    row: 'Servers and data',
    managed: "Run on the provider's infrastructure",
    databasify: 'Run on servers you own or rent, under your account',
  },
  {
    row: 'Price model',
    managed: 'Priced by the provider for the managed service',
    databasify: 'Free software. You pay only for your own servers',
  },
  {
    row: 'Engines',
    managed: 'Engines and versions depend on the provider',
    databasify: 'PostgreSQL, MySQL, MariaDB, MongoDB, Valkey and Redis in one place',
  },
  {
    row: 'Lock-in',
    managed: 'Tied to one provider and its tooling',
    databasify: 'Move between providers or run on your own hardware',
  },
  {
    row: 'Open source',
    managed: 'Closed service',
    databasify: 'Apache 2.0 licensed',
  },
  {
    row: 'Where it runs',
    managed: "Only where the provider offers it",
    databasify: 'Anywhere you can reach over SSH, or on DigitalOcean, Hetzner, Vultr and Linode',
  },
] as const;

export const SECTIONS = {
  features: { heading: 'Everything a managed database gives you', subline: 'On servers you control.' },
  tour: { heading: 'A closer look', subline: 'The parts of Databasify you will use every day.' },
  howItWorks: { heading: 'How it works' },
  comparison: { heading: 'Managed database service vs Databasify', topicLabel: 'Topic', scrollLabel: 'Managed database service compared with Databasify' },
  faq: { heading: 'Frequently asked questions' },
  finalCta: { heading: 'Run your own managed databases', subline: 'Install Databasify on one server and create your first database in minutes.' },
} as const;

export const FAQ = [
  {
    q: 'What is Databasify?',
    a: 'Databasify is an open-source alternative to DigitalOcean Managed Databases, Amazon RDS and Aiven. It creates and runs PostgreSQL, MySQL, MariaDB, MongoDB, Valkey and Redis databases on your own servers, from a single node to a highly available cluster.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Databasify is open source under the Apache 2.0 license. You pay only for the servers you run it on.',
  },
  {
    q: 'Which engines does it support?',
    a: 'PostgreSQL 17 and 18, MySQL 8.4 and 9.7, MariaDB 11.4 and 11.8, MongoDB 7.0, 8.0 and 9.0, Valkey 8 and 9, and Redis 8.',
  },
  {
    q: 'Do I need my own servers?',
    a: 'You need servers, but you do not have to set them up by hand. Add them over SSH, or let Databasify order them on DigitalOcean, Hetzner, Vultr or Linode. Databasify itself installs with one command on a Linux server with at least 1 GB of memory.',
  },
  {
    q: 'Is it production-ready (HA, failover, backups)?',
    a: 'Each engine uses its own high-availability tooling: Patroni and etcd for PostgreSQL, InnoDB Cluster for MySQL, Galera for MariaDB, replica sets for MongoDB and Sentinel for Valkey and Redis. A cluster has a primary, up to 2 standbys and read-only nodes, and automatic failover works with three voting nodes. Point-in-time recovery to S3-compatible storage is available for PostgreSQL, MySQL, MariaDB and MongoDB 7.0 and 8.0. It is not available for MongoDB 9.0, Valkey and Redis. PostgreSQL, Valkey and Redis replicate asynchronously, so a failover can lose the last writes.',
  },
  {
    q: 'How do updates work?',
    a: 'Databasify checks daily for newer engine images within each database\'s version line. Patch updates install automatically in a weekly one-hour maintenance window, standbys first. You can also install an available update right away.',
  },
  {
    q: 'Can I migrate from my current provider?',
    a: 'Yes. Migrate from any reachable server of the same engine. Copy the data once, or keep it in sync and cut over when the lag reaches zero. Continuous sync needs some source settings, which the source check reports before anything is copied.',
  },
  {
    q: 'Which operating systems are supported?',
    a: 'Ubuntu 24.04 and 26.04, Debian 12 and 13, Rocky Linux 9 and AlmaLinux 9 (with SELinux enforcing).',
  },
  {
    q: 'Where is my data?',
    a: 'On the servers you add, in your own account or on your own hardware. Connections use TLS, and point-in-time recovery archives go to the S3-compatible bucket you choose.',
  },
] as const;
