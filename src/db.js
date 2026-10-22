// Conexão com o banco. Já vem pronto — não precisa mexer agora.
//
// UNIDADE 1: SQLite, embutido no Node (módulo `node:sqlite`) — nada para instalar.
// UNIDADE 3: este arquivo será refatorado para PostgreSQL. A interface abaixo
//            (`query` devolvendo `{ rows }`) foi desenhada para que a troca fique
//            contida aqui, sem espalhar mudança pelo resto do código.
// `node:sqlite` é módulo embutido do Node 22+. Carregado via createRequire porque
// algumas ferramentas (como o Vite/Vitest) ainda não o reconhecem como embutido.
import { createRequire } from 'node:module';
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite');

// Camada dupla: o processo Vitest SEMPRE usa um banco isolado em memória,
// mesmo quando DATABASE_FILE é definido por uma máquina/arquivo .env externo.
const EM_TESTE = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';
const ARQUIVO = EM_TESTE ? ':memory:' : (process.env.DATABASE_FILE || 'dados.sqlite');

let db;

export function conexao() {
  if (!db) db = new DatabaseSync(ARQUIVO);
  return db;
}

/**
 * Executa uma consulta e devolve { rows }.
 * Use `?` como marcador de parâmetro (evita injeção de SQL):
 *   query('SELECT * FROM doacoes WHERE id = ?', [id])
 */
export async function query(sql, valores = []) {
  const stmt = conexao().prepare(sql);
  const ehLeitura = /^\s*(select|with)/i.test(sql) || /returning/i.test(sql);
  if (ehLeitura) return { rows: stmt.all(...valores) };
  const info = stmt.run(...valores);
  return { rows: [], alteradas: info.changes };
}

/** Cria o schema, se ainda não existir. Rodado por `npm run db:migrar` e ao subir o servidor. */
export async function migrar() {
  conexao().exec(`
    CREATE TABLE IF NOT EXISTS doacoes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo        TEXT NOT NULL,
      quantidade  TEXT NOT NULL,
      validade    TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'disponivel',
      ong         TEXT,
      criada_em   TEXT NOT NULL DEFAULT (datetime('now')),
      doador      TEXT,
      coletada_em TEXT
    )
  `);
  await atualizarSchemaLegado();
}

/** Acrescenta as colunas a bancos antigos sem perder doações. */
export async function atualizarSchemaLegado() {
  const colunas = conexao().prepare('PRAGMA table_info(doacoes)').all().map(c => c.name);
  if (!colunas.includes('doador')) conexao().exec('ALTER TABLE doacoes ADD COLUMN doador TEXT');
  if (!colunas.includes('coletada_em')) conexao().exec('ALTER TABLE doacoes ADD COLUMN coletada_em TEXT');
}

/** Apaga dados EXCLUSIVAMENTE em execução de testes e no SQLite em memória. */
export async function limparBanco() {
  if (!EM_TESTE || ARQUIVO !== ':memory:') {
    throw new Error('limparBanco bloqueado: permitido apenas no banco de teste em memória');
  }
  conexao().exec('DELETE FROM doacoes');
}

export async function encerrar() {
  if (db) { db.close(); db = undefined; }
}
