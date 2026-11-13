
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

describe('Proteção do banco PostgreSQL — Entrega 3', () => {
  it('bloqueia banco de testes sem sufixo seguro', () => {
    const codigo = `
      import { limparBanco } from './src/db.js';

      try {
        await limparBanco();
        process.exit(10);
      } catch (erro) {
        if (!/bloqueado/.test(erro.message)) {
          process.exit(11);
        }
      }
    `;

    const resultado = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', codigo],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_ENV: 'test',
          VITEST: 'true',
          DATABASE_URL:
            'postgresql://user:senha@localhost:5432/prato_cheio',
          DATABASE_TEST_URL:
            'postgresql://user:senha@localhost:5432/banco_inseguro'
        }
      }
    );

    expect(resultado.status, resultado.stderr).toBe(0);
  });
});
