<?php

use App\Actions\Databases\Lifecycle\CreateDatabase;
use App\DTOs\Databases\EngineImage;
use App\DTOs\Databases\NewDatabase;
use App\DTOs\Migrations\MigrationSource;
use App\Enums\Databases\DatabaseStatus;
use App\Enums\Databases\NodeKind;
use App\Enums\Databases\NodeRole;
use App\Enums\Migrations\MigrationMode;
use App\Enums\Migrations\MigrationStatus;
use App\Enums\Recovery\ArchiveHealth;
use App\Enums\Servers\ServerLogStatus;
use App\Enums\Servers\ServerStatus;
use App\Models\Database;
use App\Models\DatabaseNode;
use App\Models\DnsProvider;
use App\Models\DnsZone;
use App\Models\Network;
use App\Models\NodeMetricSample;
use App\Models\Server;
use App\Models\ServerLog;
use App\Models\StorageProvider;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Queue;

$databasePath = (string) config('database.connections.sqlite.database');
$isCaptureCopy = basename($databasePath) === 'website-shots.sqlite'
    && ! str_starts_with(realpath($databasePath) ?: $databasePath, base_path())
    && in_array(config('queue.default'), [null, 'null'], true)
    && in_array(config('broadcasting.default'), [null, 'null'], true);
abort_unless($isCaptureCopy, 500, "Refusing to seed {$databasePath}: run against a website-shots.sqlite copy outside the app, with QUEUE_CONNECTION=null and BROADCAST_CONNECTION=null.");

Queue::fake();
Http::preventStrayRequests();
Process::preventStrayProcesses();

foreach (['sessions', 'cache', 'cache_locks', 'failed_jobs', 'dns_zones', 'dns_providers', 'storage_providers', 'networks', 'server_providers', 'ssh_keys'] as $table) {
    DB::table($table)->delete();
}

$user = User::query()->firstOrCreate(['email' => getenv('DEMO_EMAIL') ?: 'demo@example.com'], ['name' => 'Demo', 'password' => bcrypt('unused'), 'email_verified_at' => now()]);
$user->forceFill(['name' => 'Demo', 'password' => bcrypt(getenv('DEMO_PASSWORD') ?: '12345678')])->save();

$network = Network::query()->create(['name' => 'fra1', 'cidr' => '10.110.0.0/20']);
$servers = collect(range(1, 8))->map(function (int $number) use ($network): Server {
    usleep(5000);

    return Server::factory()->create([
        'name' => sprintf('db-fra1-%02d', $number), 'public_ip' => '203.0.113.'.(11 + $number * 6), 'private_ip' => '10.110.0.'.(1 + $number),
        'network_id' => $network->id, 'status' => ServerStatus::Ready, 'host_key_fingerprint' => 'SHA256:demo',
        'os' => 'Ubuntu 24.04', 'cpus' => 2, 'memory_mb' => 4096, 'disk_gb' => 80, 'region' => 'fra1',
        'created_at' => now()->subDays(13 - $number),
    ]);
});

$zone = DnsZone::query()->create(['dns_provider_id' => DnsProvider::factory()->create(['name' => 'Cloudflare'])->id, 'name' => 'example.com', 'external_id' => 'zone-1']);
$storage = StorageProvider::factory()->create(['name' => 'Cloudflare R2', 'endpoint' => 'https://r2.example.com', 'region' => 'auto', 'bucket' => 'databasify-backups']);

$createDatabase = fn (string $name, string $engine, string $line, string $release, array $serverIndexes): Database => resolve(CreateDatabase::class)->handle(new NewDatabase(
    $name, $engine, $servers[$serverIndexes[0]]->id, array_map(fn (int $index): string => $servers[$index]->id, array_slice($serverIndexes, 1)), versionLine: $line,
    image: new EngineImage(Database::providerFor($engine)->imageRepository(), 'sha256:'.hash('sha256', "{$engine}:{$release}"), $release),
));

$databases = collect([
    ['orders', 'mysql', '8.4', '8.4.13', [0, 1, 2]],
    ['sessions', 'valkey', '9', '9.1.3', [4]],
    ['analytics', 'postgres', '18', '18.6', [5]],
    ['shop', 'mariadb', '11.8', '11.8.9', [6]],
])->mapWithKeys(function (array $spec, int $order) use ($createDatabase): array {
    [$name, $engine, $line, $release, $serverIndexes] = $spec;
    usleep(5000);
    $database = $createDatabase($name, $engine, $line, $release, $serverIndexes);
    $database->finishOperation();
    $database->update(['status' => DatabaseStatus::Ready, 'created_at' => now()->subDays(10 - $order)]);
    $database->nodes()->orderBy('position')->get()->each(fn (DatabaseNode $node, int $position) => $node->update(['role' => $position === 0 ? NodeRole::Primary : NodeRole::Replica, 'engine_version' => $release]));

    return [$name => $database];
});

$lastBackupAt = now()->setTime(3, 0)->isFuture() ? now()->subDay()->setTime(3, 0) : now()->setTime(3, 0);
$orders = $databases['orders'];
$orders->addNode($servers[3]->id, NodeKind::ReadOnly, 'orders-reports')->update(['role' => NodeRole::Replica, 'engine_version' => '8.4.13']);
$orders->update(['dns_zone_id' => $zone->id]);

$orders->pointInTimeRecovery()->create([
    'storage_provider_id' => $storage->id, 'path' => 'mysql/orders/'.now()->subDays(9)->format('YmdHis'),
    'retention_days' => 7, 'backup_hour' => 3, 'health' => ArchiveHealth::Healthy, 'backups_count' => 7,
    'earliest_restorable_at' => now()->subDays(7)->setTime(3, 0), 'latest_restorable_at' => now()->subSeconds(14),
    'last_backup_at' => $lastBackupAt,
    'checked_at' => now()->subMinute(),
])->forceFill(['created_at' => now()->subDays(9)])->save();

$analytics = $databases['analytics'];
$analytics->startMigration($analytics->primary(), new MigrationSource('10.20.0.14', 5432, 'migrator', 'unused', databases: ['events']), MigrationMode::OneTime)
    ->update(['status' => MigrationStatus::Completed, 'started_at' => now()->subDays(3)->subMinutes(12), 'finished_at' => now()->subDays(3), 'created_at' => now()->subDays(3)->subMinutes(12)]);
usleep(5000);
$source = new MigrationSource('legacy-pg.example.com', 5432, 'migrator', 'unused', databases: ['analytics', 'events']);
$analytics->startOperation("Migrate from {$source->address()}");
$analytics->startMigration($analytics->primary(), $source, MigrationMode::Continuous)
    ->update(['status' => MigrationStatus::Syncing, 'lag_seconds' => 2, 'started_at' => now()->subMinutes(47)]);
$analytics->update(['operation_started_at' => now()->subMinutes(47)]);

$wave = fn (int $minute, float $base, float $swing, float $period): float => round($base + $swing * sin($minute / $period) + mt_rand(-100, 100) / 100 * $swing * 0.25, 2);
mt_srand(7);
$orders->nodes()->orderBy('position')->get()->each(function (DatabaseNode $node, int $position) use ($wave): void {
    $load = [1.0, 0.55, 0.45, 0.4][$position];
    $queries = 0;
    $samples = collect(range(360, 0))->map(function (int $minutesAgo) use ($node, $load, $wave, &$queries): array {
        $opsPerSecond = max(50, $wave($minutesAgo, 1180 * $load, 260 * $load, 9));
        $queries += (int) ($opsPerSecond * 60);

        return [
            'id' => (string) str()->uuid(), 'database_node_id' => $node->id, 'sampled_at' => now()->subMinutes($minutesAgo)->startOfMinute(),
            'cpu_percent' => $wave($minutesAgo, 34 * $load, 9 * $load, 7), 'load_1m' => $wave($minutesAgo, 0.9 * $load, 0.3 * $load, 7),
            'memory_percent' => $wave($minutesAgo, 58 - 6 * (1 - $load), 2, 40), 'disk_percent' => round(41 - $minutesAgo / 360, 2),
            'connections' => (int) $wave($minutesAgo, 64 * $load, 14 * $load, 11), 'ops_per_second' => $opsPerSecond, 'query_total' => $queries,
        ];
    });
    $samples->chunk(200)->each(fn ($chunk) => NodeMetricSample::query()->insert($chunk->values()->all()));
});

collect([
    ['Create database', 0, 10 * 24 * 60],
    ['Enable point-in-time recovery', 0, 9 * 24 * 60],
    ['Add read-only node', 3, 6 * 24 * 60],
    ['Set the domain', 0, 3 * 24 * 60],
    ['Base backup', 0, (int) abs(now()->diffInMinutes($lastBackupAt))],
    ['Rotate certificates', 1, 95],
    ['Retune configuration', 0, 21],
])->each(fn (array $log) => ServerLog::factory()->for($servers[$log[1]])->for($orders)->create([
    'name' => $log[0], 'status' => ServerLogStatus::Succeeded, 'created_at' => now()->subMinutes($log[2]), 'updated_at' => now()->subMinutes($log[2])->addSeconds(40),
]));

echo json_encode([
    'database' => $databasePath,
    'databases' => Database::query()->pluck('id', 'name'),
    'servers' => Server::query()->count(),
    'nodes' => DatabaseNode::query()->count(),
    'samples' => NodeMetricSample::query()->count(),
]), "\n";
