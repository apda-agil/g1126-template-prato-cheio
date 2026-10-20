# Histórias do incremento — Trabalho 2

Os critérios a seguir descrevem o código proposto neste ZIP; integração por PR e CI verde exigem ação no repositório GitHub do grupo.

## H4b — Proteger dados reais dos testes (obrigatória)
**Dado** que `DATABASE_FILE` aponta para um banco não dedicado aos testes, **quando** a suíte roda, **então** a conexão é obrigatoriamente `:memory:` e o banco apontado não é alterado.
**Dado** um processo normal, **quando** `limparBanco()` é chamado, **então** a função falha sem apagar registros.
**Testes:** `tests/seguranca-banco.test.js`.

## H9 — Ver situação das próprias doações
**Dado** duas doações associadas ao identificador `Padaria A` e uma a `Mercado B`, **quando** consulto `GET /api/doadores/Padaria%20A/doacoes`, **então** vejo só as duas de `Padaria A`, com `status` e `ong`.
**Teste:** `tests/incremento.test.js`. **Limite:** não há login; identificador textual não é controle de acesso.

## H10 — Cancelar publicação disponível
**Dado** uma doação disponível associada ao doador, **quando** o identificador correspondente chama `POST /api/doacoes/:id/cancelar`, **então** muda para `cancelada`, sai da lista e não pode ser aceita.
**Dado** uma doação já aceita ou identificador divergente, **quando** tenta cancelar, **então** recebe erro 400, sem alterar dados.
**Teste:** `tests/incremento.test.js`.

## H11 — Marcar doação coletada
**Dado** uma doação aceita pela ONG A, **quando** ONG A chama `POST /api/doacoes/:id/coletar`, **então** fica `coletada` e registra `coletada_em`.
**Dado** ONG diferente ou coleta repetida, **quando** tenta confirmar, **então** recebe erro 400.
**Teste:** `tests/incremento.test.js`. **Limite:** não há autenticação de ONG.

## H12 — Total de aceites no mês
**Dado** doações aceitas e depois coletadas no mês atual, **quando** Marta consulta `GET /api/relatorios/aceitas?mes=AAAA-MM`, **então** recebe o número de doações com ONG atribuída, preservando a contagem após a coleta.
**Teste:** `tests/incremento.test.js`. **Limite:** usa mês de criação (`criada_em`), não o instante do aceite; para medir o mês do aceite precisamente, adicionar `aceita_em` em outra iteração. Endpoint não possui controle de acesso.
