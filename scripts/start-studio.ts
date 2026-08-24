import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const argument = (name: string): string | undefined => {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
};

const cliEntry = fileURLToPath(import.meta.resolve('mastra'));
const studioPort = process.env.STUDIO_PORT ?? argument('--port') ?? '4111';
const studioDataRoot = process.env.STUDIO_DATA_ROOT ?? argument('--data-root');
const studioStorageEnvironment =
  studioDataRoot === undefined
    ? {}
    : {
        DEMO_DATA_ROOT: studioDataRoot,
        LIBSQL_DOMAIN_URL: `file:${resolve(studioDataRoot, 'kyc.db')}`,
        LIBSQL_MASTRA_URL: `file:${resolve(studioDataRoot, 'mastra.db')}`,
        DUCKDB_URL: resolve(studioDataRoot, 'analytics.duckdb'),
        DOCUMENT_STORAGE_PATH: resolve(studioDataRoot, 'documents'),
      };
const telemetryDisabledEnvironment = {
  ...process.env,
  ...studioStorageEnvironment,
  MASTRA_TELEMETRY_DISABLED: '1',
  PORT: studioPort,
};

const child = spawn(process.execPath, [cliEntry, 'dev'], {
  cwd: process.cwd(),
  env: telemetryDisabledEnvironment,
  stdio: 'inherit',
});

const forwardSignal = (signal: NodeJS.Signals): void => {
  if (!child.killed) child.kill(signal);
};

process.once('SIGINT', () => forwardSignal('SIGINT'));
process.once('SIGTERM', () => forwardSignal('SIGTERM'));

child.once('error', error => {
  console.error('Unable to start the local Studio process.', error);
  process.exitCode = 1;
});

child.once('exit', (code, signal) => {
  if (signal !== null) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
