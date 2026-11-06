
# Refatorações — Prato Cheio

## Refatoração 1 — Migração SQLite para PostgreSQL

**Motivo:** Decisão de arquitetura registrada no ADR de migração, visando suportar acessos simultâneos em banco cliente-servidor.

**O que mudou:**
- `src/db.js` passou a utilizar PostgreSQL com `pg`, mantendo o contrato `{ rows }`.
- `src/repositorio.js` foi adaptado ao dialeto PostgreSQL.
- O CI passou a utilizar PostgreSQL nos testes.
- A instalação de dependências no CI foi alterada para `npm ci`.

**O que não mudou:**
- As regras de negócio em `src/doacoes.js`.
- Os comportamentos esperados de publicação e aceitação de doações.
- O contrato de retorno das consultas ao banco.

**Testes antes da migração:** PENDENTE — consultar a execução com SQLite e informar a quantidade.

**Testes depois da migração:** 21 testes aprovados anteriormente. Confirmar a contagem após as correções.

**Evidência do CI PostgreSQL:**
https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

**CI após as correções:** PENDENTE — inserir link da execução verde do último commit.

**Status:** Implementada, aguardando validação final.

## Refatoração 2 — Segurança do banco de testes

**Cheiro de código atacado:**
Comparação frágil das URLs de conexão utilizando igualdade de strings.

**Dor concreta:**
URLs diferentes podem apontar para o mesmo banco de dados. Isso dificultava a manutenção da segurança dos testes e poderia permitir uma limpeza indevida.

**O que mudou:**
- Criada uma função para identificar servidor, porta e nome do banco.
- A comparação deixou de depender apenas da igualdade textual das URLs.
- Adicionado um teste para verificar conexões equivalentes.
- Preservadas as verificações de segurança anteriores, sujeitas à conferência do diff.

**Evidência dos testes antes:**
PENDENTE — adicionar o link da execução anterior.

**Evidência dos testes depois:**
PENDENTE — executar os testes e adicionar o link do CI verde.

**Status:** Correção preparada, aguardando validação.

**Limitações:**
Aliases de DNS e configurações indiretas ainda podem apontar para o mesmo servidor. O banco de testes deve continuar isolado do banco de produção.
