// Regras de negócio das doações.
import * as repo from './repositorio.js';

function textoObrigatorio(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

// História zero — "um doador publica uma doação".
// Critério: tipo, quantidade e validade são obrigatórios.
export async function criarDoacao({ tipo, quantidade, validade } = {}) {
  if (!textoObrigatorio(tipo) || !textoObrigatorio(quantidade) || !textoObrigatorio(validade)) {
    throw new Error('tipo, quantidade e validade são obrigatórios');
  }

  return repo.inserir({
    tipo: tipo.trim(),
    quantidade: quantidade.trim(),
    validade: validade.trim()
  });
}

// História zero — "uma ONG vê as doações disponíveis".
export async function listarDisponiveis() {
  return repo.listarDisponiveis();
}

// História zero — "uma ONG aceita uma doação".
// Regra do caso: uma doação aceita não fica disponível para outra ONG.
export async function aceitar(id, ong) {
  const idNumerico = Number(id);
  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    throw new Error('doação inválida');
  }
  if (!textoObrigatorio(ong)) {
    throw new Error('ONG é obrigatória');
  }

  const atualizada = await repo.aceitar(idNumerico, ong.trim());
  if (atualizada) return atualizada;

  const existente = await repo.buscarPorId(idNumerico);
  if (!existente) throw new Error('doação não encontrada');
  throw new Error('doação já foi aceita por outra ONG');
}
