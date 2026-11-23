# Validação — Trabalho 3

**Fonte:** `docs/analise.md` (Unidade 1) e critérios H1–H4 do PDF. **Estados abaixo:** suporte identificado na versão preparada; confirmação final exige CI na branch `entrega-3` e demonstração real. As linhas da análise estão transcritas sem substituir o esperado por critérios inventados.

## Critérios de aceite da Unidade 1

| Critério original (Dado → Quando → Então) | Estado | Evidência verificável |
|---|---|---|
| Formulário com os 3 campos obrigatórios preenchidos → submeter → doação aparece com tipo, quantidade e validade em texto | **Parcial** | `tests/doacoes.test.js` (publicação); H1 acrescentou obrigatoriedade do identificador do doador |
| Publicação sem validade → processar → HTTP 400, nada listado | **Atende no código** | `tests/doacoes.test.js` e `tests/validacao-entrega3.test.js` |
| Doação disponível → ONG consulta → lista em ordem de publicação, com os três campos | **Atende no código** | `tests/validacao-entrega3.test.js` (`ORDER BY id ASC`) |
| Disponível → ONG aceita com um clique → sai da lista e horário é registrado | **Atende no código** | `src/repositorio.js` (`aceita_em`), `tests/trabalho3-historias.test.js` e `tests/doacoes.test.js` |
| Já aceita → segunda ONG aceita → recusa, primeira mantém reserva | **Atende no código** | `tests/doacoes.test.js`, SQL condicional |
| Validade vencida e sem coleta na semana → Marta consulta → total semanal de expiradas | **Atende no código** | `GET /api/relatorios/expiradas?inicio=AAAA-MM-DD`, `tests/trabalho3-historias.test.js` |
| Semana sem publicações → Marta consulta → zero/sem dados | **Atende no código** | teste `sem doações vencidas retorna zero` |

## Critérios H1–H4

| Critério | Estado | Evidência no repositório |
|---|---|---|
| H1 CA1: doador vê duas, uma disponível e outra aceita pela ONG | Atende no código | `tests/trabalho3-historias.test.js` — H1 CA1 |
| H1 CA2: não vê publicação de outro doador | Atende no código | H1 CA2 |
| H1 CA3: sem doador há erro e nada é gravado | Atende no código | H1 CA3 e limite espaços |
| H2 CA1: coleta por Rui grava voluntário, horário e estado | Atende no código | H2 CA1 |
| H2 CA2: coleta de doação disponível é recusada | Atende no código | H2 CA2 e limite |
| H2 CA3: doador encontra estado coletada no histórico | Atende no código | H2 CA3 |
| H3 CA1: devolver libera oferta sem ONG e grava motivo | Atende no código | H3 CA1 |
| H3 CA2: não devolve doação coletada | Atende no código | H3 CA2 |
| H3 CA3: outra ONG não devolve reserva alheia | Atende no código | H3 CA3 e limite |
| H4 CA1: 3 publicadas, 2 aceitas, 1 coletada em 5 horas | Atende no código | H4 CA1 com horários SQL fixos |
| H4 CA2: mês sem coletas retorna “sem coletas”, não zero | Atende no código | H4 CA2; API `tempo_medio_horas: null`, interface mostra texto |
| H4 CA3: publicação em outubro e coleta em novembro | Atende no código | H4 CA3: contagem por evento, coleta em novembro |

## Critérios que não atendem — por quê

- **Publicação com apenas três campos (Unidade 1):** conflitante com H1 CA3 do Trabalho 3, que exige identificar o doador. A nova versão exige quatro campos; decisão registrada em `docs/projeto.md`.
- **Desempenho em menos de 30 segundos:** não verificável sem medição com pessoas no celular.
- **Validação integral em ambiente executável:** os testes novos precisam de PostgreSQL e CI verde no commit final; não marcar como executados antes da evidência.

## Mudanças de critério

H1 alterou a publicação original para exigir `doador`. Doações antigas sem doador ficam fora da consulta por nome, mas continuam no banco. H4 usa **mês do evento**: publicadas pelo horário de publicação, aceitas pelo horário do último aceite e coletadas pelo horário da coleta; diferença de tempo medida de publicação até coleta. H3 exige motivo e permite novo aceite pela mesma ONG depois da devolução. A contagem semanal interpreta a semana como segunda-feira a domingo, em UTC, e considera vencimentos sem coleta anteriores à data atual.

## Limitações do produto

Os nomes de doadores, ONGs e voluntários são texto informado pelo cliente, sem autenticação ou autorização real. A validação de data de validade pressupõe data ISO; histórico legado com formato inválido requer saneamento. Não há registro de eventos imutável: a devolução limpa `aceita_em` e o relatório contabiliza o último aceite, não todo o histórico. O tempo de publicação no celular e o teste cruzado necessitam comprovação manual.

## Uso de IA

O ChatGPT apoiou a migração PostgreSQL, a criação das rotas e dos testes de H1–H4, a revisão dos critérios e os rascunhos documentais. **Erro da IA identificado e corrigido:** o roteiro anterior indicava que apenas o nome da ONG bastava para H2; o CA1 exige também nome do voluntário, que foi acrescentado ao código, à interface e aos testes. A equipe deve executar os testes, revisar as decisões e registrar o que efetivamente verificou em cada PR; uma sugestão da IA não é evidência de execução.

## Evidências de execução (preencher após CI)

- CI PostgreSQL anterior: https://github.com/apda-agil/g1126-template-prato-cheio/actions/runs/42128228460/job/127597840145 (21 testes da versão anterior).
- CI verde na branch `entrega-3`: [link e total real].
- Clone limpo e demo: `docs/demo.md` — `## Testado por` [preencher após execução].
- PRs revisados H1/H2/H3/H4: [links reais].
