import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { criarApp } from '../src/app.js';
import { migrar, limparBanco, encerrar, query } from '../src/db.js';

const app = criarApp();
beforeEach(async () => { await migrar(); await limparBanco(); });
afterAll(async () => { await encerrar(); });
const publicar = (doador = 'Padaria Pão Bom') => request(app).post('/api/doacoes')
  .send({ tipo: 'Pão', quantidade: '20 unidades', validade: '2027-12-01', doador });
const aceitar = (id, ong = 'Casa Esperança') => request(app)
  .post(`/api/doacoes/${id}/aceitar`).send({ ong });
const coletar = (id, ong = 'Casa Esperança', voluntario = 'Rui') => request(app)
  .post(`/api/doacoes/${id}/coletar`).send({ ong, voluntario });
const devolver = (id, ong = 'Casa Esperança', motivo = 'sem voluntário hoje') => request(app)
  .post(`/api/doacoes/${id}/devolver`).send({ ong, motivo });

// H1: cada critério e um caso limite.
describe('H1 — histórico do doador', () => {
  it('CA1: vê duas publicações, com uma aceita pela Casa Esperança', async () => {
    const a = (await publicar()).body; const b = (await publicar()).body;
    await aceitar(a.id);
    const r = await request(app).get('/api/doadores/Padaria%20P%C3%A3o%20Bom/doacoes');
    expect(r.status).toBe(200);
    expect(r.body).toHaveLength(2);
    expect(r.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: a.id, status: 'aceita', ong: 'Casa Esperança' }),
      expect.objectContaining({ id: b.id, status: 'disponivel' })
    ]));
  });
  it('CA2: não mistura publicações de outro doador', async () => {
    await publicar('Mercado B'); await publicar();
    const r = await request(app).get('/api/doadores/Padaria%20P%C3%A3o%20Bom/doacoes');
    expect(r.body).toHaveLength(1);
    expect(r.body[0].doador).toBe('Padaria Pão Bom');
  });
  it('CA3: recusa publicação sem doador e não grava', async () => {
    const r = await request(app).post('/api/doacoes')
      .send({ tipo: 'Pão', quantidade: '20 unidades', validade: '2027-12-01' });
    expect(r.status).toBe(400);
    expect(r.body.erro).toContain('doador');
    expect((await request(app).get('/api/doacoes')).body).toHaveLength(0);
  });
  it('limite: também recusa doador com apenas espaços', async () => {
    expect((await publicar('  ')).status).toBe(400);
  });
});

describe('H2 — coleta confirmada', () => {
  it('CA1: registra status, voluntário e horário', async () => {
    const d = (await publicar()).body; await aceitar(d.id);
    const r = await coletar(d.id);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ status: 'coletada', voluntario: 'Rui' });
    expect(Date.parse(r.body.coletada_em)).not.toBeNaN();
  });
  it('CA2: impede coleta de doação ainda disponível', async () => {
    const d = (await publicar()).body;
    const r = await coletar(d.id);
    expect(r.status).toBe(400);
    expect(r.body.erro).toContain('coleta não permitida');
    expect((await request(app).get('/api/doacoes')).body[0].status).toBe('disponivel');
  });
  it('CA3: histórico do doador mostra coleta', async () => {
    const d = (await publicar()).body; await aceitar(d.id); await coletar(d.id);
    const r = await request(app).get('/api/doadores/Padaria%20P%C3%A3o%20Bom/doacoes');
    expect(r.body[0].status).toBe('coletada');
    expect(r.body[0].voluntario).toBe('Rui');
  });
  it('limite: não permite coleta duplicada ou voluntário vazio', async () => {
    const d = (await publicar()).body; await aceitar(d.id);
    expect((await coletar(d.id, 'Casa Esperança', ' ')).status).toBe(400);
    expect((await coletar(d.id)).status).toBe(200);
    expect((await coletar(d.id)).status).toBe(400);
  });
});

describe('H3 — devolução pela ONG', () => {
  it('CA1: devolução volta à lista sem ONG e com motivo', async () => {
    const d = (await publicar()).body; await aceitar(d.id);
    const r = await devolver(d.id);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ status: 'disponivel', ong: null, motivo_devolucao: 'sem voluntário hoje' });
    expect(r.body.aceita_em).toBeNull();
    const lista = await request(app).get('/api/doacoes');
    expect(lista.body.map(x => x.id)).toContain(d.id);
  });
  it('CA2: doação coletada não pode ser devolvida', async () => {
    const d = (await publicar()).body; await aceitar(d.id); await coletar(d.id);
    const r = await devolver(d.id);
    expect(r.status).toBe(400);
    expect((await request(app).get('/api/doadores/Padaria%20P%C3%A3o%20Bom/doacoes')).body[0].status).toBe('coletada');
  });
  it('CA3: outra ONG não pode devolver uma doação', async () => {
    const d = (await publicar()).body; await aceitar(d.id);
    expect((await devolver(d.id, 'Outra ONG')).status).toBe(400);
    const r = await request(app).get('/api/doadores/Padaria%20P%C3%A3o%20Bom/doacoes');
    expect(r.body[0]).toMatchObject({ status: 'aceita', ong: 'Casa Esperança' });
  });
  it('limite: motivo obrigatório; a ONG anterior pode aceitar novamente', async () => {
    const d = (await publicar()).body; await aceitar(d.id);
    expect((await devolver(d.id, 'Casa Esperança', ' ')).status).toBe(400);
    expect((await devolver(d.id)).status).toBe(200);
    expect((await aceitar(d.id)).status).toBe(200);
  });
});

describe('H4 — resultado mensal', () => {
  const mensal = mes => request(app).get(`/api/relatorios/mensal?mes=${mes}`);
  it('CA1: 3 publicadas, 2 aceitas, 1 coletada em 5h', async () => {
    const d1 = (await publicar()).body;
    const d2 = (await publicar()).body;
    const d3 = (await publicar()).body;
    await aceitar(d1.id); await aceitar(d2.id); await coletar(d1.id);
    await query(`UPDATE doacoes SET criada_em = '2026-11-10T08:00:00Z',
      aceita_em = CASE WHEN id IN ($1,$2) THEN '2026-11-10T09:00:00Z'::timestamptz ELSE NULL END,
      coletada_em = CASE WHEN id = $1 THEN '2026-11-10T13:00:00Z'::timestamptz ELSE NULL END
      WHERE id IN ($1,$2,$3)`, [d1.id,d2.id,d3.id]);
    const r = await mensal('2026-11');
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ mes: '2026-11', publicadas: 3, aceitas: 2, coletadas: 1, tempo_medio_horas: 5 });
  });
  it('CA2: mês sem coletas retorna null, não zero', async () => {
    const d = (await publicar()).body;
    await query("UPDATE doacoes SET criada_em = '2026-11-10T08:00:00Z' WHERE id = $1", [d.id]);
    const r = await mensal('2026-11');
    expect(r.body).toMatchObject({ publicadas: 1, coletadas: 0, tempo_medio_horas: null });
  });
  it('CA3: publicada em outubro, coletada em novembro, conta coleta em novembro', async () => {
    const d = (await publicar()).body; await aceitar(d.id); await coletar(d.id);
    await query(`UPDATE doacoes SET criada_em = '2026-10-31T20:00:00Z',
      aceita_em = '2026-11-01T00:00:00Z', coletada_em = '2026-11-01T01:00:00Z'
      WHERE id = $1`, [d.id]);
    const nov = await mensal('2026-11');
    const out = await mensal('2026-10');
    expect(nov.body).toMatchObject({ publicadas: 0, aceitas: 1, coletadas: 1, tempo_medio_horas: 5 });
    expect(out.body).toMatchObject({ publicadas: 1, aceitas: 0, coletadas: 0, tempo_medio_horas: null });
  });
  it('limite: mês inválido retorna HTTP 400', async () => {
    expect((await mensal('2026-13')).status).toBe(400);
  });
});

describe('Critérios originais — painel semanal de expiradas', () => {
  it('mostra a quantidade de doações vencidas sem coleta na semana', async () => {
    const d1 = (await publicar()).body;
    const d2 = (await publicar()).body;
    const d3 = (await publicar()).body;
    await query("UPDATE doacoes SET validade = '2020-01-07' WHERE id IN ($1,$2,$3)", [d1.id,d2.id,d3.id]);
    await aceitar(d3.id); await coletar(d3.id);
    const r = await request(app).get('/api/relatorios/expiradas?inicio=2020-01-06');
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ inicio: '2020-01-06', expiradas_sem_coleta: 2 });
  });
  it('sem doações vencidas retorna zero', async () => {
    const r = await request(app).get('/api/relatorios/expiradas?inicio=2020-01-06');
    expect(r.status).toBe(200);
    expect(r.body.expiradas_sem_coleta).toBe(0);
  });
});
