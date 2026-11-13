
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


## Evidências finais — Entrega 3

### Refatoração 1 — Migração SQLite para PostgreSQL

**Motivo:** Decisão arquitetural registrada no ADR 0001.

**Alterações realizadas:**
- Migração da persistência para PostgreSQL.
- Adaptação das consultas SQL.
- Configuração do GitHub Actions com PostgreSQL.
- Preservação das regras de negócio.

**Testes antes da migração:** [preencher com a evidência da versão SQLite]

**Testes após a migração:** 21 testes aprovados em 3 arquivos.

**Evidência do CI:**
https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

**Pull Request:**
https://github.com/apda-agil/g1126-template-prato-cheio/pull/10

### Refatoração 2 — [nome da refatoração registrada]

**Problema identificado:** [descrever o cheiro de código e a dificuldade concreta]

**O que mudou:** [descrever a alteração implementada]

**Testes antes:** [quantidade e evidência]

**Testes depois:** [quantidade e evidência]

**Pull Request:** [inserir link]

### Correção complementar — Proteção do banco de testes

Na Entrega 3, foi reforçada a validação do nome do banco PostgreSQL utilizado nos testes.

A configuração passou a rejeitar bancos que não possuem um sufixo de teste permitido.

Também foi criado um teste automatizado específico para verificar esse bloqueio.

Arquivos alterados:
- `src/db.js`
- `tests/protecao-banco-entrega3.test.js`

**Resultado dos testes:** [preencher após executar o CI]

**Evidência:** [inserir link da execução]

