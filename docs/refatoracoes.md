# Refatorações — Prato Cheio

*Trabalho 3 · uma seção por refatoração · o que importa é o motivo e a evidência*

## Refatoração 1 — Migração de SQLite para PostgreSQL

- **Motivo:** (o que a decidiu — ver o ADR da Unidade 2)
- **O que mudou:** (arquivos e o que neles)
- **O que NÃO mudou:** (as regras de negócio? as rotas? os testes?)
- **Evidência de que o comportamento se manteve:**
  - testes antes da mudança: ___ passando
  - testes depois da mudança: ___ passando
  - link da execução do CI verde:

## Refatoração 2 — (nome)

- **Cheiro de código atacado:** (duplicação, função longa, nome que engana, regra na rota…)
- **Qual dor concreta isso resolvia:**
- **O que mudou:**
- **Evidência (testes verdes antes e depois):**

---

**Limitações e o que ficou de fora:** (o que vocês viram e decidiram não refatorar, e por quê)


## Implementação PostgreSQL — 05/11/2026

### Motivo da refatoração

O sistema Prato Cheio utilizava SQLite para armazenar as doações.

A migração para PostgreSQL foi realizada para melhorar o suporte a acessos simultâneos e preparar o sistema para futuras evoluções.

A decisão está relacionada ao ADR 0001, elaborado anteriormente.

### Alterações realizadas

- Substituição do SQLite pelo PostgreSQL.
- Utilização da biblioteca `pg` para conexão com o banco.
- Atualização do arquivo `src/db.js`.
- Adaptação das consultas SQL em `src/repositorio.js`.
- Substituição dos parâmetros `?` por `$1`, `$2`, etc.
- Configuração do PostgreSQL 16 no Docker Compose.
- Criação de banco exclusivo para testes.
- Atualização das configurações do Vitest.
- Adaptação do pipeline do GitHub Actions.

### Funcionalidades preservadas

A migração foi planejada para manter as funcionalidades:

- Publicação de doações.
- Listagem de doações disponíveis.
- Aceitação de doações por ONGs.
- Consulta de doações por doador.
- Cancelamento de doações.
- Registro da coleta.
- Relatórios mensais.

As regras de negócio devem permanecer equivalentes às da versão anterior.

### Validação

A migração deverá ser verificada executando:

1. `docker compose up -d`
2. `npm install`
3. `npm run db:migrar`
4. `npm test`
5. `npm start`

Também será necessário verificar se o GitHub Actions conclui o pipeline sem erros.

### Evidências

- Testes antes da migração: a preencher.
- Testes após a migração: aguardando execução.
- GitHub Actions: aguardando validação. https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

### Limitações

A migração não transfere automaticamente os registros do SQLite para PostgreSQL.

O sistema ainda utiliza identificadores textuais para doadores e ONGs, sem autenticação real.

A configuração do PostgreSQL exige um ambiente com Docker ou um servidor de banco disponível.
