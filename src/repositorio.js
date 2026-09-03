// Camada de dados do Prato Cheio — acesso ao banco.
import { query } from './db.js';

// Insere a doação e devolve a linha criada.
export async function inserir({ tipo, quantidade, validade }) {
  const { rows } = await query(
    `INSERT INTO doacoes (tipo, quantidade, validade)
     VALUES (?, ?, ?)
     RETURNING *`,
    [tipo, quantidade, validade]
  );
  return rows[0];
}

// Devolve apenas as doações ainda disponíveis.
export async function listarDisponiveis() {
  const { rows } = await query(
    `SELECT *
       FROM doacoes
      WHERE status = 'disponivel'
      ORDER BY id ASC`
  );
  return rows;
}

// Busca uma doação pelo id; undefined quando não existe.
export async function buscarPorId(id) {
  const { rows } = await query('SELECT * FROM doacoes WHERE id = ?', [id]);
  return rows[0];
}

// Aceita a doação somente se ela ainda estiver disponível.
// O WHERE status = 'disponivel' torna a mudança atômica e impede duas ONGs
// de aceitarem a mesma doação em chamadas concorrentes.
export async function aceitar(id, ong) {
  const { rows } = await query(
    `UPDATE doacoes
        SET status = 'aceita', ong = ?
      WHERE id = ? AND status = 'disponivel'
      RETURNING *`,
    [ong, id]
  );
  return rows[0];
}
