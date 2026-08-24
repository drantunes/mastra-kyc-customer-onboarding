import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

type Service = Readonly<{
  name: string;
  script: string;
  host: string;
  port: number;
  url: string;
  environment?: NodeJS.ProcessEnv;
}>;

const scriptRoot = resolve(import.meta.dirname, '..');
const repositoryRoot = existsSync(resolve(scriptRoot, 'portal/package.json')) ? scriptRoot : resolve(scriptRoot, '..');
const isProjectedTemplate = existsSync(resolve(repositoryRoot, 'src/main.ts'));

const parsePort = (name: string, fallback: number): number => {
  const value = process.env[name];
  const port = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }
  return port;
};

const host = process.env.HOST ?? '127.0.0.1';
const apiPort = parsePort('PORT', 4111);
const studioPort = parsePort('STUDIO_PORT', 4112);
const portalPort = parsePort('DEV_PORTAL_PORT', 5173);
const services: readonly Service[] = [
  {
    name: 'API',
    script: isProjectedTemplate ? 'dev:api' : 'dev:app',
    host,
    port: apiPort,
    url: `http://127.0.0.1:${String(apiPort)}`,
    environment: { PORTAL_ORIGIN: `http://127.0.0.1:${String(portalPort)}` },
  },
  {
    name: 'Mastra Studio',
    script: isProjectedTemplate ? 'dev:studio' : 'dev',
    host,
    port: studioPort,
    url: `http://127.0.0.1:${String(studioPort)}`,
    environment: {
      STUDIO_PORT: String(studioPort),
      STUDIO_DATA_ROOT: process.env.STUDIO_DATA_ROOT ?? './data/studio',
      PORTAL_ORIGIN: `http://127.0.0.1:${String(portalPort)}`,
    },
  },
  {
    name: 'Portal',
    script: 'dev:portal',
    host: '127.0.0.1',
    port: portalPort,
    url: `http://127.0.0.1:${String(portalPort)}`,
    environment: {
      DEV_PORTAL_PORT: String(portalPort),
      VITE_API_BASE_URL: `http://127.0.0.1:${String(apiPort)}`,
    },
  },
];

const duplicatePort = services.find(
  (service, index) => services.findIndex(candidate => candidate.port === service.port) !== index,
);
if (duplicatePort !== undefined) {
  throw new Error(`Development services cannot share port ${String(duplicatePort.port)}`);
}

const assertPortAvailable = async (service: Service): Promise<void> =>
  new Promise((resolvePromise, reject) => {
    const server = createServer();
    server.unref();
    server.once('error', (error: NodeJS.ErrnoException) => {
      const reason =
        error.code === 'EADDRINUSE' ? 'is already in use' : `is unavailable (${error.code ?? 'unknown error'})`;
      reject(new Error(`${service.name} cannot start because ${service.host}:${String(service.port)} ${reason}`));
    });
    server.listen({ host: service.host, port: service.port, exclusive: true }, () => {
      server.close(error => {
        if (error === undefined) resolvePromise();
        else reject(error);
      });
    });
  });

await Promise.all(services.map(assertPortAvailable));

console.log('Starting the complete local review environment:');
for (const service of services) console.log(`- ${service.name}: ${service.url}`);

const npmEntry = process.env.npm_execpath;
const npmExecutable = npmEntry === undefined ? (process.platform === 'win32' ? 'npm.cmd' : 'npm') : process.execPath;
const children = new Map<string, ChildProcess>();
let shuttingDown = false;

const terminate = (child: ChildProcess, signal: NodeJS.Signals): void => {
  if (child.pid === undefined || child.exitCode !== null || child.signalCode !== null) return;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch {
    // The process may have exited between the state check and signal delivery.
  }
};

const shutdown = (signal: NodeJS.Signals, exitCode: number): void => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  for (const child of children.values()) terminate(child, signal);
  const force = setTimeout(() => {
    for (const child of children.values()) terminate(child, 'SIGKILL');
  }, 5_000);
  force.unref();
};

process.once('SIGINT', () => shutdown('SIGINT', 130));
process.once('SIGTERM', () => shutdown('SIGTERM', 143));

await new Promise<void>(resolvePromise => {
  let active = services.length;
  for (const service of services) {
    const child = spawn(npmExecutable, [...(npmEntry === undefined ? [] : [npmEntry]), 'run', service.script], {
      cwd: repositoryRoot,
      detached: process.platform !== 'win32',
      env: { ...process.env, ...service.environment },
      stdio: 'inherit',
    });
    children.set(service.name, child);
    child.once('error', error => {
      console.error(`${service.name} failed to start:`, error.message);
      shutdown('SIGTERM', 1);
    });
    child.once('exit', (code, signal) => {
      active -= 1;
      if (!shuttingDown) {
        console.error(`${service.name} stopped unexpectedly (${signal ?? String(code ?? 1)})`);
        shutdown('SIGTERM', code === null || code === 0 ? 1 : code);
      }
      if (active === 0) resolvePromise();
    });
  }
});
