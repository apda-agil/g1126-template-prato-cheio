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

### Diagrama de contexto

<img width="700" height="732" alt="0e377086-f9c9-4940-a0bb-32c7311b3380" src="https://github.com/user-attachments/assets/7c36bd05-c3b2-4f0c-81e5-6d846c291a54" />

### Modelo de dados

<img width="700" height="1000" alt="mermaid-diagram-2026-09-24-210430" src="https://github.com/user-attachments/assets/e0642be9-c449-4459-80a6-3747ba731924" />

### Revisão usando IA

1. Inclusão do "Monitoramento / CI" como Sistema Externo
 
- **O erro:** O diagrama inicial apresentava o CI (Continuous Integration) como um ator ou sistema externo interagindo ativamente para verificar o funcionamento do sistema e receber status.
- **Explicação:** O documento de análise menciona o CI e o GitHub Actions exclusivamente no tópico 10 como um "Critério de conclusão" técnico (para garantir que os testes automatizados passem antes do *merge* do código). O CI é uma ferramenta de desenvolvimento da equipe de engenharia e não um participante do domínio de negócio (fluxo de doação) que devesse constar em um diagrama de contexto C4 de nível 1.
 
2. Omissão de Stakeholders
 
- **O erro:** O relacionamento inicial do Doador omitia as restrições estritas dos dados, o aceite da ONG não refletia a agilidade mapeada, e a Gestora (Marta) foi totalmente omitida do diagrama.
- **Explicação:** A análise detalhou regras de negócio precisas para o Walking Skeleton: para simplificar o cadastro, é obrigatório enviar estritamente "tipo, quantidade e validade". Além disso, a ONG precisava aceitar as doações com "1 clique" visando velocidade. A omissão da Marta também foi um erro crítico da primeira versão da IA, uma vez que o documento a classifica como uma stakeholder de "alta" influência responsável por visualizar o gargalo logístico das doações expiradas.

## ADRs
Ver `docs/adr/`.

## Requisitos não-funcionais
| Requisito | Como afeta o design |
|---|---|

## Critérios de validação do projeto

## Uso de IA
