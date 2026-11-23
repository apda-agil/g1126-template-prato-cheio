import { query } from './db.js';

export async function inserir({ tipo, quantidade, validade, doador }) {
  const { rows } = await query(
    `INSERT INTO doacoes (tipo, quantidade, validade, doador)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [tipo, quantidade, validade, doador]
  );
  return rows[0];
}

export async function listarDisponiveis() {
  const { rows } = await query("SELECT * FROM doacoes WHERE status = 'disponivel' ORDER BY id ASC");
  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await query('SELECT * FROM doacoes WHERE id = $1', [id]);
  return rows[0];
}

export async function aceitar(id, ong) {
  const { rows } = await query(
    `UPDATE doacoes SET status = 'aceita', ong = $1, aceita_em = CURRENT_TIMESTAMP,
        motivo_devolucao = NULL
     WHERE id = $2 AND status = 'disponivel' RETURNING *`, [ong, id]);
  return rows[0];
}

export async function listarPorDoador(doador) {
  const { rows } = await query('SELECT * FROM doacoes WHERE doador = $1 ORDER BY id DESC', [doador]);
  return rows;
}

export async function cancelar(id, doador) {
  const { rows } = await query(
    `UPDATE doacoes SET status = 'cancelada'
     WHERE id = $1 AND doador = $2 AND status = 'disponivel' RETURNING *`, [id, doador]);
  return rows[0];
}

export async function coletar(id, ong, voluntario) {
  const { rows } = await query(
    `UPDATE doacoes SET status = 'coletada', coletada_em = CURRENT_TIMESTAMP,
        voluntario = $3
     WHERE id = $1 AND ong = $2 AND status = 'aceita' RETURNING *`,
    [id, ong, voluntario]);
  return rows[0];
}

// Atualização atômica: uma ONG não pode devolver a reserva de outra.
export async function devolver(id, ong, motivo) {
  const { rows } = await query(
    `UPDATE doacoes SET status = 'disponivel', ong = NULL, aceita_em = NULL,
        motivo_devolucao = $3
     WHERE id = $1 AND ong = $2 AND status = 'aceita' RETURNING *`,
    [id, ong, motivo]);
  return rows[0];
}

// A mesma regra de transição do banco é usada para aceite, coleta e devolução.
export async function resultadoMensal(mes) {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*)::integer FROM doacoes
        WHERE TO_CHAR(criada_em AT TIME ZONE 'UTC', 'YYYY-MM') = $1) AS publicadas,
      (SELECT COUNT(*)::integer FROM doacoes
        WHERE aceita_em IS NOT NULL
          AND TO_CHAR(aceita_em AT TIME ZONE 'UTC', 'YYYY-MM') = $1) AS aceitas,
      (SELECT COUNT(*)::integer FROM doacoes
        WHERE coletada_em IS NOT NULL
          AND TO_CHAR(coletada_em AT TIME ZONE 'UTC', 'YYYY-MM') = $1) AS coletadas,
      (SELECT ROUND((AVG(EXTRACT(EPOCH FROM (coletada_em - criada_em))) / 3600)::numeric, 2)
        FROM doacoes
        WHERE coletada_em IS NOT NULL
          AND TO_CHAR(coletada_em AT TIME ZONE 'UTC', 'YYYY-MM') = $1)
        AS tempo_medio_horas
  `, [mes]);
  const r = rows[0];
  return {
    mes,
    publicadas: Number(r.publicadas),
    aceitas: Number(r.aceitas),
    coletadas: Number(r.coletadas),
    tempo_medio_horas: r.tempo_medio_horas === null ? null : Number(r.tempo_medio_horas)
  };
}

// Compatibilidade do endpoint legado do Trabalho 2, contando aceites no mês.
export async function aceitasNoMes(mes) {
  const relatorio = await resultadoMensal(mes);
  return relatorio.aceitas;
}

// Critério original da Unidade 1: vencimentos na semana sem coleta.
// Somente datas ISO são aceitas; a semana inicia na segunda-feira (UTC).
export async function expiradasNaSemana(inicio) {
  const { rows } = await query(`
    SELECT COUNT(*)::integer AS total FROM doacoes
    WHERE validade ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      AND (CASE WHEN validade ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
           THEN validade::date ELSE NULL END) >= $1::date
      AND (CASE WHEN validade ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
           THEN validade::date ELSE NULL END) < ($1::date + 7)
      AND (CASE WHEN validade ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
           THEN validade::date ELSE NULL END) < (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date
      AND coletada_em IS NULL
  `, [inicio]);
  return Number(rows[0].total);
}
