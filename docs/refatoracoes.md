# Refatorações — Trabalho 3

## Refatoração 1 — SQLite → PostgreSQL (iteração 0)

**Motivo:** ADR 0001; acesso simultâneo e persistência cliente-servidor. **Mudança:** `src/db.js` usa `pg` mantendo `query()` com `{ rows }`; `src/repositorio.js` usa `$1`, `$2`; CI cria PostgreSQL; `src/doacoes.js` não precisava mudar por causa da migração. **Teste anterior (SQLite):** [número real + link do CI]. **Teste posterior:** execução compartilhada da migração com 21 testes aprovados em 3 arquivos: https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145 . Esse link não comprova sozinho o último commit. **PR:** https://github.com/apda-agil/g1126-template-prato-cheio/pull/10 .

## Refatoração 2 — Extração da verificação de transições (iteração 3)

**Cheiro de código:** repetição da validação da doação/ID, atualização condicional e retorno de erro nas ações aceitar, coletar, devolver e cancelar. **Dor concreta:** uma nova transição exigiria copiar novamente as verificações e poderia divergir nos erros. **Mudança nesta versão:** extraída `executarTransicao()` em `src/doacoes.js`, chamada pelas quatro operações. Os `UPDATE ... WHERE status = ... AND ong = ... RETURNING *` continuam no repositório, de forma atômica, para impedir corridas entre ONGs. A refatoração não cria um quarto conjunto de regras duplicadas.

**Testes antes da extração:** [link do CI do commit anterior à extração]. **Depois:** cenários H2/H3 + regressão em `tests/trabalho3-historias.test.js`; [quantidade e link do CI verde após integração]. **PR da refatoração separado:** [link real]. **Revisão:** [link do PR com 3 comentários em linha, respostas e seção `## O que a revisão mudou`]. **Observação:** a extração está preparada neste pacote; só registrem como integrada quando houver PR revisado e CI verde.

**Complemento:** a normalização das URLs e a restrição de sufixo seguro no banco de testes também permanecem em `src/db.js`, como medida independente de segurança, verificada pelos testes de proteção.
