import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cliEntry = fileURLToPath(import.meta.resolve('mastra'));
const telemetryDisabledEnvironment = {
  ...process.env,
  MASTRA_TELEMETRY_DISABLED: '1',
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
