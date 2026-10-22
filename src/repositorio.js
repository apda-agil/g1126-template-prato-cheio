import { query } from './db.js';

export async function inserir({ tipo, quantidade, validade, doador = null }) {
  const { rows } = await query(
    `INSERT INTO doacoes (tipo, quantidade, validade, doador)
     VALUES (?, ?, ?, ?) RETURNING *`, [tipo, quantidade, validade, doador]);
  return rows[0];
}
export async function listarDisponiveis() {
  const { rows } = await query("SELECT * FROM doacoes WHERE status = 'disponivel' ORDER BY id ASC");
  return rows;
}
export async function buscarPorId(id) {
  const { rows } = await query('SELECT * FROM doacoes WHERE id = ?', [id]);
  return rows[0];
}
export async function aceitar(id, ong) {
  const { rows } = await query(`UPDATE doacoes SET status = 'aceita', ong = ?
    WHERE id = ? AND status = 'disponivel' RETURNING *`, [ong, id]);
  return rows[0];
}
export async function listarPorDoador(doador) {
  const { rows } = await query('SELECT * FROM doacoes WHERE doador = ? ORDER BY id DESC', [doador]);
  return rows;
}
export async function cancelar(id, doador) {
  const { rows } = await query(`UPDATE doacoes SET status = 'cancelada'
    WHERE id = ? AND doador = ? AND status = 'disponivel' RETURNING *`, [id, doador]);
  return rows[0];
}
export async function coletar(id, ong) {
  const { rows } = await query(`UPDATE doacoes SET status = 'coletada', coletada_em = datetime('now')
    WHERE id = ? AND ong = ? AND status = 'aceita' RETURNING *`, [id, ong]);
  return rows[0];
}
export async function aceitasNoMes(mes) {
  // O relatório de aceitas conta também as que posteriormente foram coletadas.
  const { rows } = await query(`SELECT COUNT(*) AS total FROM doacoes
    WHERE ong IS NOT NULL AND substr(criada_em,1,7) = ?`, [mes]);
  return rows[0].total;
}
