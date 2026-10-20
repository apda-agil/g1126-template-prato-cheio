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
  if (doador !== undefined && doador !== null && !valido(doador))
    throw new Error('doador inválido');
  return repo.inserir({ tipo: tipo.trim(), quantidade: quantidade.trim(),
    validade: validade.trim(), doador: doador?.trim() || null });
}
export const listarDisponiveis = () => repo.listarDisponiveis();
export async function aceitar(id, ong) {
  const n = idValido(id);
  const atualizada = await repo.aceitar(n, campo(ong, 'ONG'));
  if (atualizada) return atualizada;
  if (!await repo.buscarPorId(n)) throw new Error('doação não encontrada');
  throw new Error('doação já foi aceita por outra ONG ou não está disponível');
}
export async function minhasDoacoes(doador) {
  return repo.listarPorDoador(campo(doador, 'doador'));
}
export async function cancelar(id, doador) {
  const n = idValido(id);
  const resultado = await repo.cancelar(n, campo(doador, 'doador'));
  if (resultado) return resultado;
  throw new Error('doação inexistente, já aceita ou não pertence ao doador');
}
export async function coletar(id, ong) {
  const n = idValido(id);
  const resultado = await repo.coletar(n, campo(ong, 'ONG'));
  if (resultado) return resultado;
  throw new Error('coleta não permitida: ONG divergente ou doação não aceita');
}
export async function relatorioMes(mes) {
  if (typeof mes !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes))
    throw new Error('mês inválido: use AAAA-MM');
  return { mes, aceitas: await repo.aceitasNoMes(mes) };
}
