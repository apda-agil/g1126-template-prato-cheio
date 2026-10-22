# Documento de Projeto — Prato Cheio


## Decisões de projeto
| # | Decisão | Alternativas | Requisito/risco da Análise que a motiva |
|---|---|---|---|
| **1** | **Abordagem técnica para a "Última Milha"**<br>Adotar uma interface ultraleve focada apenas em texto (endereço e horário), sem mapas embutidos. | **Alternativa A:** Interface ultraleve focada em texto sem mapas embutidos *(Escolhida)*.<br>**Alternativa B:** Integrar com serviços de mapas nativos (Google Maps/Waze). | **História de Usuário 4:** O voluntário entregador precisa visualizar o endereço de forma leve para chegar ao local *"mesmo com a conexão 3G/4G caindo na rua"*. Mitiga o risco de usabilidade de rua em redes instáveis (identificado como ponto crítico pós-Iteração 1). |
| **2** | **Inclusão da "Fatia 3" (Fotos e Histórico de Doadores)**<br>Manter a interface de doação apenas em texto, adicionando somente campos de descrição e orientações de retirada. | **Alternativa A:** Implementar upload de fotos da doação e sistema de avaliação/histórico.<br>**Alternativa B:** Interface apenas em texto com campos de descrição e orientações *(Escolhida)*. | **Conflito entre História 8 e História 1:** A ONG deseja fotos para evitar o recebimento de alimentos estragados. No entanto, atende à **Métrica e Hipótese Central de Negócio**: o upload de mídia aumenta o tempo de tela do doador, correndo o risco de ultrapassar o limite de 30 segundos, aumentar o abandono do fluxo e reduzir a oferta primária de alimentos. |
| **3** | **Mecanismo de filtro e disputa (Fatia 2)**<br>Implementar filtros estáticos baseados nos bairros-mock cadastrados (categorias de texto e região geral). | **Alternativa A:** Filtros estáticos por bairros cadastrados e categorias de texto *(Escolhida)*.<br>**Alternativa B:** Integrar coordenadas geográficas reais para ordenação dinâmica e cálculo de rota por API externa. | **História de Usuário 7:** A ONG quer filtrar doações por tipo e bairro para otimizar rotas e economizar custos logísticos. Impacta o **Objetivo de Impacto 3** (reduzir a mediana do tempo entre disponibilidade e coleta), mantendo um baixo custo de engenharia/APIs no estágio atual. |

## Tabela de trade-offs (uma decisão em detalhe)
| Critério | Alternativa A | Alternativa B |
|---|---|---|
| **Segurança para a ONG** | **Alta:** Reduz a chance de viagens perdidas para recolher comida estragada através da verificação visual e reputação. | **Baixa:** A ONG depende puramente da confiança na descrição fornecida pelo doador. |
| **Manutenção da Métrica de 30s (Doador)** | **Baixa:** O upload de arquivos e os passos adicionais aumentam a fricção e o tempo de navegação. | **Alta:** Digitar texto descritivo rápido afeta minimamente o tempo de cadastro. |
| **Custo de Infraestrutura** | **Alto:** Requer armazenamento de imagens em nuvem (S3/Cloud Storage) e banco relacional para histórico. | **Baixo:** Requer apenas o armazenamento de *strings* adicionais no banco de dados. |
| **Impacto no uso de dados móveis** | **Alto:** Upload e carregamento de imagens consomem significativamente a franquia de dados móveis. | **Baixo:** O tráfego de dados em texto é negligenciável para as franquias de dados dos voluntários e doadores. |

## Diagramas

- [Diagrama de contexto](diagramas/contexto.md)
- [Diagrama de dados](diagramas/dados.md)

**Divergências entre o modelo anterior e `src/db.js`:** (1) endereço e bairro foram previstos, mas não são persistidos; (2) o modelo previa entidades de doador e ONG, enquanto o banco guarda identificadores textuais; (3) o modelo previa rastreamento de coleta, ausente no esquema original. No incremento, foram adicionados `doador` e `coletada_em`, mas ainda não existe autenticação nem persistência de endereço/bairro. Os diagramas atuais devem representar o estado implementado.

## ADRs

- [ADR 0001 — Migração SQLite para PostgreSQL](adr/0001-migracao-sqlite-postgresql.md)
- [ADR 0002 — Isolamento do banco de testes](adr/0002-isolamento-banco-testes.md)

## Requisitos não-funcionais
| Requisito | Como afeta o design |
|---|---|
| **RNF-01:** Quando a aplicação for usada no celular com conexão instável, o fluxo publicar/listar/aceitar funciona sem bibliotecas de mapas e sem imagens externas obrigatórias, medido por inspeção de `public/index.html` e execução do fluxo no navegador com rede limitada (teste manual a registrar). | D1: UI textual, sem SDK de mapas; equipe de UX paga com menos recursos visuais. |
| **RNF-02:** Quando a suíte executar com `DATABASE_FILE` apontando para arquivo real, nenhuma operação dos testes grava nesse arquivo, medido pelos 2 testes de isolamento em `tests/seguranca-banco.test.js` e ausência/criação controlada de arquivo. | ADR 0002: banco em memória e guarda de limpeza; QA paga com manutenção dos testes de persistência separados. |
| **RNF-03:** Quando duas ONGs tentarem aceitar a mesma doação disponível, somente a primeira mudança de estado terá sucesso e uma única ONG ficará registrada, medido pelo teste `recusa aceitar uma doação que já foi aceita` em `tests/doacoes.test.js`. | SQL atômico `UPDATE ... WHERE status='disponivel'`; equipe de backend paga com regras explícitas de transição e teste. |


## Critérios de validação do projeto
| Critério (sim/não por inspeção do repositório) | Fonte |
|---|---|
| Existem 3 decisões com 2 alternativas e rastreabilidade? | `docs/projeto.md` → Decisões de projeto |
| Existe tabela de trade-offs para uma decisão? | `docs/projeto.md` → Tabela de trade-offs |
| O contexto mostra a vigilância sanitária com seta rotulada? | `docs/diagramas/contexto.md` |
| O diagrama de dados corresponde ao schema executado? | `docs/diagramas/dados.md` e `src/db.js` |
| Há 2 ADRs completos, incluindo migração, com validação? | `docs/adr/0001-*.md`, `docs/adr/0002-*.md` |
| Existe teste que bloqueia limpeza fora do banco de testes? | `tests/seguranca-banco.test.js` + `src/db.js` |
| A história de segurança e os incrementos têm critérios Dado/Quando/Então e testes? | `docs/historias-incremento.md`, `tests/incremento.test.js` |
| O CI instala dependências, roda testes e verifica saúde? | `.github/workflows/ci.yml` |
| A migração PostgreSQL está somente planejada para Unidade 3, com teste de equivalência previsto? | `docs/adr/0001-migracao-sqlite-postgresql.md` |
| Há evidências de PR revisado e CI verde por integrante? | `docs/evidencias/registro-prs.md` (links dos PRs e revisões) |

## Uso de IA

Durante o desenvolvimento do projeto Prato Cheio, utilizamos inteligência artificial como ferramenta de apoio na elaboração da documentação técnica, na organização dos ADRs, na construção dos diagramas e na implementação e revisão de funcionalidades e testes.

As sugestões geradas foram analisadas e comparadas com os arquivos existentes no repositório, buscando preservar as funcionalidades já implementadas. Também realizamos a integração das alterações ao GitHub, executamos 14 testes automatizados com Vitest, todos aprovados, e validamos as alterações por meio de Pull Request revisado por outro integrante e CI aprovado.

**Erro identificado e corrigido:** durante a elaboração do diagrama de contexto, a IA sugeriu incluir o CI (Continuous Integration) como sistema externo. Essa representação foi corrigida, pois o CI faz parte do processo de desenvolvimento e não representa um participante do fluxo de doações.

**Limitação identificada:** o sistema utiliza identificadores textuais de doadores e ONGs, sem autenticação real. Por isso, ainda seriam necessárias melhorias de segurança antes de sua disponibilização pública.
