import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { criarApp } from '../src/app.js';
import { migrar, limparBanco, encerrar } from '../src/db.js';

const app = criarApp();

beforeEach(async () => {
  await migrar();
  await limparBanco();
});

afterAll(async () => {
  await encerrar();
});

describe('a aplicação sobe', () => {
  it('responde na verificação de saúde', async () => {
    const res = await request(app).get('/api/saude');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('publicar e listar doações', () => {
  it('mostra a doação publicada na lista de disponíveis', async () => {
    const publicacao = await request(app)
      .post('/api/doacoes')
      .send({ tipo: 'Sopa', quantidade: '10 porções', validade: '2026-09-10' });

    expect(publicacao.status).toBe(201);

    const res = await request(app).get('/api/doacoes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      tipo: 'Sopa',
      quantidade: '10 porções',
      validade: '2026-09-10',
      status: 'disponivel'
    });
  });

  it('recusa doação sem os campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/doacoes')
      .send({ tipo: 'Pães', quantidade: '20 unidades' });

    expect(res.status).toBe(400);
    expect(res.body.erro).toContain('obrigatórios');

    const lista = await request(app).get('/api/doacoes');
    expect(lista.body).toHaveLength(0);
  });
});

describe('aceitar uma doação', () => {
  async function publicar() {
    const res = await request(app)
      .post('/api/doacoes')
      .send({ tipo: 'Frutas', quantidade: '2 caixas', validade: '2026-09-10' });
    return res.body;
  }

  it('marca a doação como aceita pela ONG', async () => {
    const doacao = await publicar();

    const res = await request(app)
      .post(`/api/doacoes/${doacao.id}/aceitar`)
      .send({ ong: 'ONG Esperança' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: doacao.id,
      status: 'aceita',
      ong: 'ONG Esperança'
    });
  });

  it('remove a doação da lista de disponíveis depois de aceita', async () => {
    const doacao = await publicar();

    await request(app)
      .post(`/api/doacoes/${doacao.id}/aceitar`)
      .send({ ong: 'ONG Esperança' });

    const lista = await request(app).get('/api/doacoes');
    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(0);
  });

  it('recusa aceitar uma doação que já foi aceita por outra ONG', async () => {
    const doacao = await publicar();

    const primeira = await request(app)
      .post(`/api/doacoes/${doacao.id}/aceitar`)
      .send({ ong: 'ONG A' });
    expect(primeira.status).toBe(200);

    const segunda = await request(app)
      .post(`/api/doacoes/${doacao.id}/aceitar`)
      .send({ ong: 'ONG B' });

    expect(segunda.status).toBe(400);
    expect(segunda.body.erro).toContain('já foi aceita');
  });
});
