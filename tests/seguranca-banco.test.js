import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('proteção contra limpeza fora de testes', () => {
  it('impede limparBanco em processo normal, sem alterar a doação', () => {
    const dir = mkdtempSync(join(tmpdir(), 'prato-seguranca-'));
    try {
      const arquivo = join(dir, 'real.sqlite');
      const codigo = `import {migrar,query,limparBanco,encerrar} from './src/db.js';
        await migrar();
        await query("INSERT INTO doacoes(tipo,quantidade,validade) VALUES(?,?,?)", ['Arroz','5kg','2027-01-01']);
        let bloqueou=false;
        try { await limparBanco(); } catch(e) { bloqueou=/bloqueado/.test(e.message); }
        const {rows}=await query('SELECT COUNT(*) as total FROM doacoes');
        await encerrar();
        if (!bloqueou || rows[0].total!==1) process.exit(9);`;
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], {
        cwd: process.cwd(), encoding: 'utf8',
        env: { ...process.env, VITEST: '', NODE_ENV: 'production', DATABASE_FILE: arquivo }
      });
      expect(result.status, result.stderr).toBe(0);
      expect(readFileSync(arquivo).length).toBeGreaterThan(0);
    } finally { rmSync(dir, {recursive:true,force:true}); }
  });
  it('força banco em memória mesmo com DATABASE_FILE externo durante testes', () => {
    const dir = mkdtempSync(join(tmpdir(), 'prato-isolado-'));
    try {
      const arquivo = join(dir,'nao-deve-ser-criado.sqlite');
      const codigo = `import {migrar,query,limparBanco,encerrar} from './src/db.js';
        await migrar(); await limparBanco();
        const {rows}=await query('SELECT COUNT(*) AS total FROM doacoes');
        await encerrar(); if(rows[0].total!==0) process.exit(8);`;
      const result = spawnSync(process.execPath, ['--input-type=module','-e',codigo], {
        cwd: process.cwd(), encoding:'utf8',
        env: { ...process.env, VITEST:'true',NODE_ENV:'test',DATABASE_FILE:arquivo }
      });
      expect(result.status, result.stderr).toBe(0);
      expect(() => readFileSync(arquivo)).toThrow();
    } finally { rmSync(dir,{recursive:true,force:true}); }
  });
});
