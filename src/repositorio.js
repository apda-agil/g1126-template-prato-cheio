
import { query } from './db.js';

// Cadastrar uma nova doação
export async function inserir({ tipo, quantidade, validade, doador = null }) {
  const { rows } = await query(
    `INSERT INTO doacoes (tipo, quantidade, validade, doador)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [tipo, quantidade, validade, doador]
  );

  return rows[0];
}

// Listar doações disponíveis
export async function listarDisponiveis() {
  const { rows } = await query(
    "SELECT * FROM doacoes WHERE status = 'disponivel' ORDER BY id ASC"
  );

  return rows;
}

// Buscar doação pelo ID
export async function buscarPorId(id) {
  const { rows } = await query(
    'SELECT * FROM doacoes WHERE id = $1',
    [id]
  );

  return rows[0];
}

// Aceitar uma doação
export async function aceitar(id, ong) {
  const { rows } = await query(
    `UPDATE doacoes
     SET status = 'aceita', ong = $1
     WHERE id = $2 AND status = 'disponivel'
     RETURNING *`,
    [ong, id]
  );

  return rows[0];
}

// Listar doações de um doador
export async function listarPorDoador(doador) {
  const { rows } = await query(
    'SELECT * FROM doacoes WHERE doador = $1 ORDER BY id DESC',
    [doador]
  );

  return rows;
}

// Cancelar uma doação
export async function cancelar(id, doador) {
  const { rows } = await query(
    `UPDATE doacoes
     SET status = 'cancelada'
     WHERE id = $1 AND doador = $2 AND status = 'disponivel'
     RETURNING *`,
    [id, doador]
  );

  return rows[0];
}

// Marcar uma doação como coletada
export async function coletar(id, ong) {
  const { rows } = await query(
    `UPDATE doacoes
     SET status = 'coletada', coletada_em = CURRENT_TIMESTAMP
     WHERE id = $1 AND ong = $2 AND status = 'aceita'
     RETURNING *`,
    [id, ong]
  );

  return rows[0];
}

// Relatório mensal de doações aceitas
export async function aceitasNoMes(mes) {
  const { rows } = await query(
    `SELECT COUNT(*) AS total
     FROM doacoes
     WHERE ong IS NOT NULL
     AND to_char(criada_em AT TIME ZONE 'UTC', 'YYYY-MM') = $1`,
    [mes]
  );

  return Number(rows[0].total);
}
