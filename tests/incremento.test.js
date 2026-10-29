import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { criarApp } from '../src/app.js';
import { migrar, limparBanco, encerrar } from '../src/db.js';
const app = criarApp();
beforeEach(async () => { await migrar(); await limparBanco(); });
afterAll(async () => { await encerrar(); });
const publicar = (doador = 'Padaria A') => request(app).post('/api/doacoes')
  .send({ tipo: 'Pão', quantidade: '10 unidades', validade: '2026-12-01', doador });

describe('Incrementos do Trabalho 2', () => {
  it('doador acompanha as próprias doações, sem misturar outro identificador', async () => {
    await publicar(); await publicar('Mercado B');
    const res = await request(app).get('/api/doadores/Padaria%20A/doacoes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].doador).toBe('Padaria A');
  });
  it('cancela doação disponível e impede aceite posterior', async () => {
    const d = (await publicar()).body;
    const c = await request(app).post(`/api/doacoes/${d.id}/cancelar`).send({ doador: 'Padaria A' });
    expect(c.status).toBe(200); expect(c.body.status).toBe('cancelada');
    const a = await request(app).post(`/api/doacoes/${d.id}/aceitar`).send({ ong: 'ONG A' });
    expect(a.status).toBe(400);
    expect((await request(app).get('/api/doacoes')).body).toHaveLength(0);
  });
  it('não permite cancelar com outro doador nem após aceite', async () => {
    const d = (await publicar()).body;
    expect((await request(app).post(`/api/doacoes/${d.id}/cancelar`).send({ doador: 'Outro' })).status).toBe(400);
    await request(app).post(`/api/doacoes/${d.id}/aceitar`).send({ ong: 'ONG A' });
    expect((await request(app).post(`/api/doacoes/${d.id}/cancelar`).send({ doador: 'Padaria A' })).status).toBe(400);
  });
  it('somente ONG que aceitou confirma coleta uma única vez', async () => {
    const d = (await publicar()).body;
    await request(app).post(`/api/doacoes/${d.id}/aceitar`).send({ ong: 'ONG A' });
    expect((await request(app).post(`/api/doacoes/${d.id}/coletar`).send({ ong: 'ONG B' })).status).toBe(400);
    const c = await request(app).post(`/api/doacoes/${d.id}/coletar`).send({ ong: 'ONG A' });
    expect(c.status).toBe(200); expect(c.body.status).toBe('coletada');
    expect(c.body.coletada_em).toBeTruthy();
    expect((await request(app).post(`/api/doacoes/${d.id}/coletar`).send({ ong: 'ONG A' })).status).toBe(400);
  });
  it('relatório de aceites preserva contagem após coleta', async () => {
    const d = (await publicar()).body;
    await request(app).post(`/api/doacoes/${d.id}/aceitar`).send({ ong: 'ONG A' });
    await request(app).post(`/api/doacoes/${d.id}/coletar`).send({ ong: 'ONG A' });
    const mes = new Date().toISOString().slice(0, 7);
    const r = await request(app).get(`/api/relatorios/aceitas?mes=${mes}`);
    expect(r.status).toBe(200); expect(r.body).toEqual({ mes, aceitas: 1 });
    expect((await request(app).get('/api/relatorios/aceitas?mes=abc')).status).toBe(400);
  });
  it('limpeza em contexto de teste opera sem banco externo', async () => {
    const d = (await publicar()).body;
    expect(d.id).toBeGreaterThan(0);
    await limparBanco();
    expect((await request(app).get('/api/doacoes')).body).toHaveLength(0);
  });

  it('História 5: mantém o cancelamento no histórico do doador', async () => {
  // Dado
  const publicacao = await publicar('Padaria A');
  expect(publicacao.status).toBe(201);
  const id = publicacao.body.id;

  // Quando
  const cancelamento = await request(app)
    .post(`/api/doacoes/${id}/cancelar`)
    .send({ doador: 'Padaria A' });

  // Então
  expect(cancelamento.status).toBe(200);
  expect(cancelamento.body.status).toBe('cancelada');

  const historico = await request(app)
    .get('/api/doadores/Padaria%20A/doacoes');

  expect(historico.status).toBe(200);
  expect(historico.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id,
        status: 'cancelada',
        doador: 'Padaria A'
      })
    ])
  );
});
});
