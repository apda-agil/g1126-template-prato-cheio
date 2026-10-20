# ADR 0002 — Isolamento obrigatório do banco de testes

- **Data:** 2026-10-19
- **Status:** aceito (implementado neste incremento)

## Contexto
Uma execução de testes no piloto apontou para o arquivo real de SQLite; `limparBanco()` executava `DELETE FROM doacoes` sem validar o destino. A prioridade passou a ser impossibilitar alteração de dados reais pelos testes, mesmo com variáveis de ambiente externas mal configuradas.

## Alternativas consideradas
1. **Apenas `vitest.config.js` com `DATABASE_FILE=:memory:`:** implementação simples; variável configurável pode ser alterada por outra execução e não protege `limparBanco()`.
2. **Validar apenas o nome do arquivo em `limparBanco()`:** bloqueia a limpeza direta, porém testes poderiam executar outros `UPDATE`/`DELETE` via `query` sobre um arquivo real.
3. **Forçar conexão `:memory:` dentro de `src/db.js` durante Vitest/testes e bloquear limpeza fora desse modo (escolhida):** cobre leitura/escrita de toda a suíte e impede exclusão direta fora de testes. Custo: testes em memória não simulam persistência em arquivo nem PostgreSQL, exigindo suíte separada de integração futura.

## Decisão
O processo com `VITEST=true` ou `NODE_ENV=test` **ignora `DATABASE_FILE`** e usa sempre SQLite em memória; `limparBanco()` só executa em contexto de testes nesse banco. Uma invocação comum de `limparBanco()` falha explicitamente, antes de emitir SQL. A proteção depende de modo de teste controlado: não é uma fronteira de segurança contra alguém que deliberadamente altera o próprio processo ou seu código.

## Consequências
- **Positivas:** testes automatizados não abrem nem alteram arquivo de produção por configuração externa de caminho; limpeza falha em execução normal.
- **Negativas e quem paga:** QA/desenvolvimento deve manter testes específicos de persistência em ambientes separados; o processo de teste não compartilha dados entre execuções.
- **Riscos:** rodar um programa malicioso com `NODE_ENV=test` permite conexão em memória (sem afetar produção), mas testes de integração em PostgreSQL exigirão nova arquitetura de isolamento. Como mitigação, será obrigatório um banco PostgreSQL separado no CI.

## Rastreabilidade
Mudança de contexto, etapa 4b do Trabalho 2; `docs/analise.md`, risco de perda do fluxo central de doações.

## Critério de validação
`npm test`: testes de `tests/seguranca-banco.test.js` devem provar que (1) a limpeza em execução normal é recusada preservando um registro, e (2) testes com caminho externo continuam em memória, sem criar o arquivo indicado. Comandos de reprodução também estão em `docs/validacao.md`.
