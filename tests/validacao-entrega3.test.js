
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

describe('Validação da Entrega 3', () => {

  it('lista as doações em ordem de publicação', async () => {
    const alimentos = ['Arroz', 'Feijão', 'Macarrão'];
    const ids = [];

    for (const tipo of alimentos) {
      const resposta = await request(app)
        .post('/api/doacoes')
        .send({
          tipo,
          quantidade: '10 unidades',
          validade: '2026-12-20'
        });

      expect(resposta.status).toBe(201);
      ids.push(resposta.body.id);
    }

    const resposta = await request(app).get('/api/doacoes');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(3);

    expect(resposta.body.map(d => d.id)).toEqual(ids);

    expect(resposta.body.map(d => d.tipo)).toEqual(alimentos);
  });

  it('não altera as doações existentes após publicação inválida', async () => {
    const publicacao = await request(app)
      .post('/api/doacoes')
      .send({
        tipo: 'Leite',
        quantidade: '5 caixas',
        validade: '2026-12-20'
      });

    expect(publicacao.status).toBe(201);

    const invalida = await request(app)
      .post('/api/doacoes')
      .send({
        tipo: 'Pão',
        quantidade: '10 unidades'
      });

    expect(invalida.status).toBe(400);

    const lista = await request(app).get('/api/doacoes');

    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(1);

    expect(lista.body[0]).toMatchObject({
      id: publicacao.body.id,
      tipo: 'Leite',
      quantidade: '5 caixas',
      validade: '2026-12-20',
      status: 'disponivel'
    });
  });

});
