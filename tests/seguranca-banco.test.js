
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

function subprocesso(codigo, vars) {
  return spawnSync(process.execPath, ['--input-type=module', '-e', codigo], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, ...vars }
  });
}

describe('isolamento dos bancos PostgreSQL', () => {
  it('bloqueia limpeza fora do ambiente de testes', () => {
    const p = subprocesso(
      `import { limparBanco } from './src/db.js';
      try { await limparBanco(); process.exit(10) }
      catch(e) { if (!/bloqueado/.test(e.message)) process.exit(11) }`,
      {
        NODE_ENV: 'production',
        VITEST: '',
        DATABASE_TEST_URL: ''
      }
    );

    expect(p.status, p.stderr).toBe(0);
  });

  it('bloqueia nome de banco de testes sem sufixo seguro', () => {
    const p = subprocesso(
      `import { limparBanco } from './src/db.js';
      try { await limparBanco(); process.exit(10) }
      catch(e) { if (!/bloqueado/.test(e.message)) process.exit(11) }`,
      {
        NODE_ENV: 'test',
        VITEST: 'true',
        DATABASE_URL: 'postgres://user:pass@localhost:5432/pratocheio',
        DATABASE_TEST_URL: 'postgres://user:pass@localhost:5432/pratocheio'
      }
    );

    expect(p.status, p.stderr).toBe(0);
  });

  it('exige conexão exclusiva DATABASE_TEST_URL e não reutiliza DATABASE_URL', () => {
    const p = subprocesso(
      `import { limparBanco } from './src/db.js';
      try { await limparBanco(); process.exit(10) }
      catch(e) { if (!/DATABASE_TEST_URL/.test(e.message)) process.exit(11) }`,
      {
        NODE_ENV: 'test',
        VITEST: 'true',
        DATABASE_TEST_URL: '',
        DATABASE_URL: 'postgres://user:pass@localhost:5432/pratocheio'
      }
    );

    expect(p.status, p.stderr).toBe(0);
  });
});
