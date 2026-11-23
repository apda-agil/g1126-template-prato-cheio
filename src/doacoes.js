import * as repo from './repositorio.js';

const valido = valor => typeof valor === 'string' && valor.trim().length > 0;

function idValido(id) {
  const n = Number(id);
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error('doação inválida');
  return n;
}
function campo(valor, nome) {
  if (!valido(valor)) throw new Error(`${nome} é obrigatório`);
  return valor.trim();
}
export async function criarDoacao({ tipo, quantidade, validade, doador } = {}) {
  if (![tipo, quantidade, validade].every(valido))
    throw new Error('tipo, quantidade e validade são obrigatórios');
  return repo.inserir({
    tipo: tipo.trim(), quantidade: quantidade.trim(), validade: validade.trim(),
    doador: campo(doador, 'doador')
  });
}
export const listarDisponiveis = () => repo.listarDisponiveis();
export const minhasDoacoes = doador => repo.listarPorDoador(campo(doador, 'doador'));

// Refatoração 2: unifica a busca e a mensagem de transições não permitidas.
// A atualização SQL condicional continua atômica e é a autoridade sobre concorrência.
async function executarTransicao(id, atualizar, mensagem, ausente = 'doação não encontrada') {
  const n = idValido(id);
  const resultado = await atualizar(n);
  if (resultado) return resultado;
  if (!await repo.buscarPorId(n)) throw new Error(ausente);
  throw new Error(mensagem);
}

export function aceitar(id, ong) {
  const identificador = campo(ong, 'ONG');
  return executarTransicao(id, n => repo.aceitar(n, identificador),
    'doação já foi aceita por outra ONG ou não está disponível');
}
export function cancelar(id, doador) {
  const identificador = campo(doador, 'doador');
  return executarTransicao(id, n => repo.cancelar(n, identificador),
    'doação inexistente, já aceita ou não pertence ao doador',
    'doação inexistente, já aceita ou não pertence ao doador');
}
export function coletar(id, ong, voluntario) {
  const identificador = campo(ong, 'ONG');
  const quem = campo(voluntario, 'voluntário');
  return executarTransicao(id, n => repo.coletar(n, identificador, quem),
    'coleta não permitida: ONG divergente ou doação não aceita');
}
export function devolver(id, ong, motivo) {
  const identificador = campo(ong, 'ONG');
  const justificativa = campo(motivo, 'motivo');
  return executarTransicao(id, n => repo.devolver(n, identificador, justificativa),
    'devolução não permitida: doação coletada, não aceita ou ONG divergente');
}
function validarMes(mes) {
  if (typeof mes !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes))
    throw new Error('mês inválido: use AAAA-MM');
}
export async function relatorioMes(mes) {
  validarMes(mes);
  return { mes, aceitas: await repo.aceitasNoMes(mes) };
}
export async function resultadoMes(mes) {
  validarMes(mes);
  return repo.resultadoMensal(mes);
}

export async function painelSemanal(inicio) {
  if (typeof inicio !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(inicio))
    throw new Error('início inválido: use AAAA-MM-DD (segunda-feira)');
  const data = new Date(`${inicio}T00:00:00Z`);
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0,10) !== inicio || data.getUTCDay() !== 1)
    throw new Error('início deve ser uma segunda-feira válida');
  return { inicio, expiradas_sem_coleta: await repo.expiradasNaSemana(inicio) };
}
