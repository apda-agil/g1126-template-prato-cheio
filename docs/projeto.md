# Documento de Projeto — Prato Cheio

*Trabalho 2 · máximo 4 páginas (fora diagramas) · entrega na Aula 10*

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
(contexto + dados ou componentes — em `docs/` ou como imagem)

## ADRs
Ver `docs/adr/`.

## Requisitos não-funcionais
| Requisito | Como afeta o design |
|---|---|

## Critérios de validação do projeto

## Uso de IA
