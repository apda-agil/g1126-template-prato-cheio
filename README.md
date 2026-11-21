# Prato Cheio — Trabalho 3 (PostgreSQL)

Aplicação de doação de alimentos feita em Node.js/Express/PostgreSQL 16. Fluxo: publicação → aceite → coleta, com possibilidade de devolver a doação aceita à lista. Também oferece histórico por doador, cancelamento anterior ao aceite e relatórios para Marta.

## Como rodar

**Requisitos:** Node.js >=22.13, Docker Desktop + Compose e Git. O WSL/Docker precisa estar funcional no Windows. Se não houver permissão de administrador, executar em uma máquina preparada da equipe; GitHub Actions não substitui o clone limpo.

```bash
git clone https://github.com/apda-agil/g1126-template-prato-cheio.git
cd g1126-template-prato-cheio
# Para conferir a entrega final, após a branch existir:
git switch entrega-3
```

Copie `.env.example` para `.env`: no PowerShell, `Copy-Item .env.example .env`; em bash, `cp .env.example .env`. O arquivo de exemplo contém `DATABASE_URL=postgresql://prato_cheio:prato_cheio@localhost:5432/prato_cheio` e `DATABASE_TEST_URL=postgresql://prato_cheio:prato_cheio@localhost:5432/prato_cheio_test`. Estas senhas são exclusivamente para desenvolvimento local; nunca use credenciais reais no GitHub.

**Três comandos principais** (depois de configurar o ambiente):

```bash
docker compose up -d
npm ci
npm run db:migrar
```

Em seguida, rode `npm test` e `npm start`; abra `http://localhost:3000`. Em outro terminal, `curl http://localhost:3000/api/saude` deve retornar `{"ok":true}`. `docker compose ps` deve mostrar o PostgreSQL saudável. O script `db/init/01-test-db.sql` cria o banco de testes apenas quando o volume é inicializado pela primeira vez; para volumes antigos, crie esse banco manualmente sem apagar os dados existentes.

## Definição de pronto

1. **Regra testada:** cada critério tem `it()` e um limite/erro — conferir `tests/trabalho3-historias.test.js`.
2. **PostgreSQL integrado:** `npm run db:migrar`, sem SQLite — conferir `src/db.js`, `src/repositorio.js` e `compose.yaml`.
3. **Revisão independente:** PR com revisor diferente do autor e comentários respondidos — conferir aba Files changed/Conversation do PR.
4. **CI verde na main:** conferir Actions após cada merge, sem prosseguir com main vermelha.
5. **Demonstração reproduzível:** `docs/demo.md` testado sem ajuda por outra pessoa, no celular, com campo `## Testado por` preenchido.
6. **Validação explícita:** `docs/validacao.md` lista critérios originais e H1–H4, evidências e limitações.

## Histórias e responsáveis

| História | Situação no pacote | Dono | Revisor |
|---|---|---|---|
| H1 — histórico do doador e doador obrigatório | Código e testes preparados | [nome] | [outro nome] |
| H2 — coleta com voluntário e horário | Código e testes preparados | [nome] | [outro nome] |
| H3 — devolução com motivo e autorização | Código e testes preparados | [nome] | [outro nome] |
| H4 — indicadores mensais e média até coleta | Código e testes preparados | [nome] | [outro nome] |

Os nomes e PRs devem corresponder aos commits reais: preencher antes da entrega.

## Como demonstrar

Na página inicial, informe **doador, alimento, quantidade e validade**; publique. Aceite como ONG. Informe o ID e voluntário para confirmar a coleta. Para devolução, publique uma segunda doação, aceite e devolva com motivo: ela volta à lista. O histórico mostra todos os estados do doador. O relatório mensal conta publicadas (mês da publicação), aceitas (mês do último aceite) e coletadas (mês da coleta), com tempo médio em horas ou “sem coletas no mês”. O painel semanal contabiliza vencimentos sem coleta.

## API (principais rotas)

| Método | Rota | Observação |
|---|---|---|
| GET | `/api/saude` | Saúde do serviço |
| POST | `/api/doacoes` | `{doador,tipo,quantidade,validade}` |
| GET | `/api/doacoes` | Ofertas disponíveis |
| GET | `/api/doadores/:doador/doacoes` | Histórico |
| POST | `/api/doacoes/:id/aceitar` | `{ong}` |
| POST | `/api/doacoes/:id/coletar` | `{ong,voluntario}` |
| POST | `/api/doacoes/:id/devolver` | `{ong,motivo}` |
| POST | `/api/doacoes/:id/cancelar` | `{doador}`, somente disponível |
| GET | `/api/relatorios/mensal?mes=2026-11` | H4 completo |
| GET | `/api/relatorios/aceitas?mes=2026-11` | Compatibilidade Trabalho 2 |
| GET | `/api/relatorios/expiradas?inicio=2020-01-06` | Semana começa na segunda-feira |

## Testes e CI

`npm test` usa `DATABASE_TEST_URL` e apaga apenas a tabela no banco exclusivo de testes. **Nunca execute a suíte com credenciais do banco principal.** O GitHub Actions executa os testes com PostgreSQL ao receber PR ou push em `main` / `entrega-3`; salve o link verde real depois do último commit. As alterações nos testes legados documentam a evolução dos contratos H1 e H2 (doador e voluntário obrigatórios).

## Limitações

O piloto identifica doadores, ONGs e voluntários por texto, sem login/controle de acesso real. A validade é recebida como texto ISO na API; dados antigos precisam ser revisados. O modelo guarda o último aceite, não um histórico auditável. A demo e o tempo de preenchimento em 30s exigem validação humana.

## Documentação

- `docs/projeto.md`: decisões de estados, datas e compatibilidade.
- `docs/analise.md`: critérios originais da Unidade 1.
- `docs/refatoracoes.md`: refatorações e evidências de CI/PR.
- `docs/validacao.md`: critérios da Unidade 1 e H1–H4.
- `docs/demo.md`: demonstração e teste cruzado.
- `docs/retrospectivas/3.md`: retrospectiva e autoavaliação.
- `docs/guia-entrega-trabalho3.md`: processo de PR, branch congelada e Teams.
