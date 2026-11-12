
# Validação — Prato Cheio

**Trabalho 3 — Engenharia de Software**

## Objetivo

Verificar se o sistema Prato Cheio atende aos critérios de aceite definidos na Unidade 1, conforme o arquivo `docs/analise.md`.

A validação considera o código implementado, os testes automatizados e as funcionalidades disponíveis na aplicação.

## Critérios de aceite

| # | Critério de aceite (Unidade 1) | Atende? | Evidência |
|---|---|---|---|
| 1 | Ao publicar uma doação com tipo, quantidade e validade, ela aparece na lista de disponíveis com os três dados em texto. | Sim | `tests/doacoes.test.js` — teste de publicação e listagem. |
| 2 | Ao publicar uma doação sem validade, o sistema retorna HTTP 400 e não inclui a doação na lista. | Sim | `tests/doacoes.test.js` — teste de campos obrigatórios. |
| 3 | A ONG consulta as doações disponíveis, com tipo, quantidade e validade, em ordem de publicação. | Sim | `src/repositorio.js`, função `listarDisponiveis()`, ordenada por ID crescente. A ordenação deve ser confirmada com múltiplas doações. |
| 4 | Ao aceitar uma doação com um clique, ela sai da lista e o horário do aceite da ONG é registrado. | Parcial | `tests/doacoes.test.js` comprova o aceite e a remoção da lista. Não foi identificado registro específico do horário do aceite. |
| 5 | Uma segunda ONG não consegue aceitar uma doação já reservada pela primeira ONG. | Sim | `tests/doacoes.test.js` — teste de recusa de segundo aceite. |
| 6 | O painel semanal apresenta o total de doações expiradas sem coleta. | Não | Não foi identificada implementação de painel ou consulta semanal de doações expiradas. |
| 7 | O painel semanal apresenta zero ou "sem dados" quando não existem doações expiradas. | Não | O painel semanal ainda não foi implementado. |

## Critérios parciais ou não atendidos

### Critério 4 — Registro do horário do aceite

O sistema permite que uma ONG aceite uma doação e impede que ela continue disponível para outras ONGs.

Entretanto, o código atual não registra um campo específico com o horário do aceite.

Para atender integralmente ao critério, seria necessário adicionar um campo como `aceita_em` ao banco PostgreSQL, registrar o horário durante a aceitação e criar um teste para verificar esse comportamento.

### Critério 6 — Painel semanal de doações expiradas

O sistema possui um relatório mensal de doações aceitas, mas não apresenta a contagem semanal de doações expiradas sem coleta.

Essa funcionalidade ficou fora da implementação atual.

Para atender ao critério, seria necessário identificar as doações com validade vencida e sem coleta, consultar os registros da semana e disponibilizar o resultado no painel.

### Critério 7 — Painel sem dados

Como o painel semanal de doações expiradas não foi implementado, também não existe tratamento específico para mostrar zero ou "sem dados".

Seria necessário implementar o painel e adicionar testes para situações sem registros.

## Mudanças de critério ao longo do semestre

A equipe adotou inicialmente uma fatia mínima do sistema, priorizando a publicação, a listagem e a aceitação de doações.

Durante o desenvolvimento, foram acrescentadas funcionalidades como cancelamento, histórico do doador, confirmação de coleta e relatório mensal de aceites.

Essas funcionalidades ampliaram o sistema, mas não substituem os critérios originais da Unidade 1.

A migração de SQLite para PostgreSQL também foi realizada sem a intenção de alterar as regras de negócio.

Os critérios não atendidos continuam registrados como pendências para evolução do produto.

## Evidências de testes

O projeto possui testes automatizados desenvolvidos com Vitest e Supertest.

Na execução apresentada anteriormente pela equipe, foram aprovados 21 testes, distribuídos em 3 arquivos.

**Evidência do GitHub Actions:**

https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145

A execução final da Entrega 3 ainda deve ser conferida após a integração das alterações na `main`.

A aprovação da suíte comprova os cenários automatizados, mas não significa que todos os critérios da Unidade 1 foram atendidos.

## Uso de IA

O ChatGPT foi utilizado para auxiliar na comparação entre os critérios de aceite, o código implementado e os testes automatizados.

A ferramenta ajudou a organizar a tabela de validação, identificar critérios parcialmente atendidos e descrever as pendências.

As conclusões foram elaboradas a partir dos arquivos `docs/analise.md`, `src/doacoes.js`, `src/repositorio.js` e dos testes existentes.

A execução prática e as evidências finais devem ser verificadas pela equipe.

## Conclusão

Dos 7 critérios de aceite definidos na Unidade 1:

- 4 foram identificados como atendidos no código.
- 1 foi identificado como parcialmente atendido.
- 2 foram identificados como não atendidos.

A validação prática e a execução final dos testes ainda devem confirmar os resultados.

O fluxo principal de publicação, listagem e aceitação de doações está implementado.

As principais pendências são o registro do horário do aceite e o painel semanal de doações expiradas.
