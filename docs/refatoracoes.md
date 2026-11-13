# Refatorações — Prato Cheio

## Refatoração 1 — Migração SQLite para PostgreSQL

**Motivo:** Decisão de arquitetura registrada no ADR 0001, visando suportar acessos simultâneos por meio de um banco de dados cliente-servidor.

**O que mudou:**
- `src/db.js` passou a utilizar PostgreSQL com a biblioteca `pg`, mantendo o contrato de retorno `{ rows }`.
- `src/repositorio.js` foi adaptado ao dialeto PostgreSQL, utilizando parâmetros posicionais (`$1`, `$2`, etc.).
- O CI passou a utilizar um serviço PostgreSQL para executar os testes.
- A instalação de dependências no CI foi padronizada com `npm ci`.

**O que não mudou:**
- As regras de negócio em `src/doacoes.js`.
- Os comportamentos esperados de publicação e aceitação de doações.
- O contrato de retorno das consultas ao banco de dados.

**Testes antes da migração:** A quantidade exata da execução com SQLite não está confirmada pela evidência disponível nesta documentação. É necessário consultar a execução anterior à migração no GitHub Actions antes de informar um número.

**Evidência dos testes antes:** Não foi possível confirmar, com as informações disponíveis, o link da execução SQLite anterior à migração.

**Testes depois da migração:** O histórico da equipe informa 24 testes aprovados em 4 arquivos. Entretanto, a evidência de CI abaixo precisa ser conferida para confirmar que essa é a execução correspondente e que apresenta essa mesma contagem.

**Evidência do CI PostgreSQL:**
https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

**CI após as correções / último commit:** Não há link confirmado da execução verde do último commit disponível neste registro. Consultar a aba **Actions** do repositório e inserir a execução mais recente da branch `main`.

**Pull Request da migração:**
https://github.com/apda-agil/g1126-template-prato-cheio/pull/10

**Status:** Migração implementada e PR identificado. A validação final deve ser confirmada pela execução verde mais recente na `main`.

---

## Refatoração 2 — Segurança do banco de testes

**Cheiro de código atacado:** Comparação frágil das URLs de conexão utilizando igualdade textual.

**Dor concreta:** URLs diferentes podem representar o mesmo destino de banco de dados. Uma comparação baseada apenas no texto da URL dificulta a identificação do banco utilizado e pode permitir que uma operação de limpeza atinja uma base que não deveria ser utilizada pelos testes.

**O que mudou:**
- Foi criada ou adaptada uma função para identificar os dados relevantes da conexão, como servidor, porta e nome do banco.
- A identificação deixou de depender exclusivamente da igualdade textual das URLs.
- Foi previsto um teste para verificar conexões equivalentes.
- A proteção do ambiente de testes foi reforçada para evitar operações de limpeza em bancos que não estejam identificados como bancos de teste.

**Testes antes:** A execução PostgreSQL indicada como referência pela equipe é a seguinte. Ela comprova uma execução anterior da suíte, mas não necessariamente o estado imediatamente anterior a esta refatoração.

**Evidência dos testes antes:**
https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

**Testes depois:** Foi informado que foi adicionado um teste específico para bloquear bancos de testes com nomes inseguros, no arquivo `tests/protecao-banco-entrega3.test.js`. A quantidade de testes aprovados após essa alteração não está comprovada pelo link disponível. Portanto, não é possível declarar a suíte aprovada sem consultar o CI da branch ou do PR que contém essa mudança.

**Evidência dos testes depois:** Ainda não há link confirmado da execução do GitHub Actions que contenha essa alteração. Consultar a aba **Checks** do PR correspondente ou a aba **Actions** do repositório e inserir o link da execução verde.

**Pull Request:** O link do PR específico desta refatoração não foi identificado nas informações disponíveis. Não utilizar o PR #10 como evidência desta segunda refatoração: ele corresponde à migração SQLite para PostgreSQL.

**Status:** Refatoração descrita, mas a evidência de execução posterior e o PR específico precisam ser confirmados no GitHub.

**Limitações:** Aliases de DNS, redirecionamentos de porta e configurações externas ainda podem fazer endereços diferentes apontarem para o mesmo servidor. O banco de testes deve permanecer isolado do banco de produção, com configuração e credenciais próprias.

---

## Evidências finais — Entrega 3

### Migração SQLite para PostgreSQL

- **ADR:** `docs/adr/0001-migracao-sqlite-postgresql.md`
- **PR da migração:** https://github.com/apda-agil/g1126-template-prato-cheio/pull/10
- **Evidência de CI PostgreSQL disponível:** https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145
- **Execução SQLite anterior:** https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42307905547/job/128201817899
- **Execução verde do último commit na `main`:** https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42307905547/job/128201817899

### Segurança do banco de testes

- **Arquivos relacionados:** `src/db.js` e `tests/protecao-banco-entrega3.test.js`.
- **Evidência anterior:** https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145
- **Evidência posterior:** https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/43336442052/job/131593696328
- **PR específico:** https://github.com/apda-agil/g1126-template-prato-cheio/pull/12

## Observação sobre as evidências

Os links devem apontar para execuções que realmente contenham as alterações descritas. Uma execução anterior à segunda refatoração pode ser usada como referência histórica, mas não substitui a execução posterior. Da mesma forma, o PR #10 comprova a revisão da migração PostgreSQL, não a revisão da refatoração de segurança do banco de testes.

Antes da entrega, conferir no GitHub:
1. A execução com SQLite anterior à migração e sua contagem de testes.
2. A execução PostgreSQL após a migração e sua contagem real.
3. A execução verde do último commit integrado à `main`.
4. O PR e a execução de CI que incluem a segunda refatoração.
