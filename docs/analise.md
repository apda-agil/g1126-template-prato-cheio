# Documento de Análise — Prato Cheio

*Trabalho 1 · máximo 4 páginas · entrega na Aula 5*

## Problema central

## Incertezas

## Stakeholders
| Stakeholder | Interesse | Influência | O que espera | Consequência na iteração 1 |
|---|---|---|---|---|
| **Doadores** (restaurantes, padarias, mercados) | Doar sem burocracia e com retirada rápida; não perder tempo cadastrando cada item | Alta: sem oferta não há plataforma | Publicar uma doação em poucos passos; ser procurados por quem coleta | **Entrevistar 2 doadores do bairro-piloto na semana 1**; no protótipo, exigir só os 3 campos da vigilância como obrigatórios; demais ficam opcionais |
| **ONGs receptoras / cozinhas comunitárias** | Previsibilidade: saber o que vão receber e planejar as refeições | Alta: sem destino não há coleta | Lista filtrada por bairro/validade; aceitar em 1 clique | **A 1ª ONG entrevistada define os critérios de aceite do walking skeleton**; é a primeira a testar o protótipo "doador publica → ONG aceita" |
| **Voluntários entregadores** | Coletar e entregar usando o celular na rua, com conexão instável | Média: operacionalizam a última milha | Tela que carrega rápido e mostra endereço + horário da coleta | **Fica para iteração 2**: o walking skeleton valida apenas "publicada → aceita"; o piloto de rua com 1 voluntário real só vem após a iteração 1 |
| **Marta, coordenadora da plataforma** | Crescer rápido (mais doadores, mais ONGs) e mostrar impacto para conseguir apoio | Alta: patrocinora do piloto, fonte de prioridade | Métricas de impacto visíveis; base de doadores/ONGs crescente | **Fonte primária de requisitos e de dados de impacto**; medições de baseline começam no **dia 1 do piloto**; pedidos de "crescer" entram como métricas, não como funcionalidades |
| **Vigilância sanitária** | Rastreabilidade mínima do doado (o que, quanto, validade) | Alta: pode bloquear o piloto legalmente | Cada doação publicada com tipo, quantidade e validade registrados | **Não entrevistada na semana 1** (sem relacionamento formal ainda); mas os 3 campos que ela impõe viram **obrigatórios** já na iteração 1: única regra "imposta" que entra no protótipo |
| **Beneficiários finais** | Receber refeições seguras, em quantidade e frequência estáveis | Baixa no piloto: não usam o sistema diretamente | Que a comida chegue antes de estragar e em quantidade suficiente | **Não são usuários da ferramenta**; entram como **métrica de impacto**, não como requisito de UI; contados via nº de refeições servidas, reportado pelas próprias ONGs |


## Objetivos de impacto
1. **Reduzir a quantidade de comida boa que é descartada.**
   - **Métrica:** kg de alimentos doados cuja validade expira sem coleta, por dia de piloto.
   - **Linha de base:** hoje **desconhecida**: o caso afirma que "não há dados sobre o volume real de doações por dia". Medir desde o **primeiro dia do piloto**; os primeiros 7 dias viram referência interna.
   - **Direção:** diminuir.
   - **Teste em dezembro:** se a média móvel de 7 dias ao final do mês 2 for ≥ 70 % da média dos primeiros 7 dias medidos, o objetivo **não foi atingido**.

2. **Aumentar o número de refeições servidas a partir de doações.**
   - **Métrica:** nº de refeições servidas por semana pelas ONGs receptoras cuja origem seja uma doação feita pelo sistema.
   - **Linha de base:** hoje **0** (não existe sistema). **Primeira medição na semana 1 do piloto.**
   - **Direção:** aumentar.
   - **Teste em dezembro:** se o total mensal ao final do mês 2 for **< 200 refeições oriundas de doações no bairro-piloto**, o objetivo **não foi atingido**. (Valor inicial; revisitar com Marta após a 1ª medição.)

3. **Reduzir o tempo entre "comida disponível" e "comida coletada".**
   - **Métrica:** mediana, em minutos, entre `publicada_em` e `coletada_em` por doação coletada.
   - **Linha de base:** Marta **acha** que é o gargalo, mas sem medição que confirme; medir desde o **primeiro dia do piloto**; primeiros 7 dias viram referência.
   - **Direção:** diminuir.
   - **Teste em dezembro:** se a mediana semanal do mês 2 for ≥ 80 % da mediana dos primeiros 7 dias medidos, o objetivo **não foi atingido**.

## Regras de negócio

1. **Publicação de uma doação exige o conjunto mínimo de campos (tipo + quantidade + validade).**
   O caso enuncia que a vigilância "exige" esses três campos, mas não diz se a publicação é bloqueada sem eles.
   - **Origem:** **imposta**: vigilância aparece como única força externa restritora explícita.
   - **Enunciado (verificável):** o sistema rejeita a publicação de uma doação cujo payload não contenha, não nulos, `tipo_alimento`, `quantidade` e `validade`; sem os três, a chamada retorna `400` e a doação não aparece na lista pública.
   - **Verificação:** 2 desenvolvedores (um back, um front) implementam de forma independente a partir do enunciado; teste automatizado chama o endpoint com payload sem `validade` → ambos rejeitam. Verificável com 1 chamada negativa.
 
2. **Ordenação das ONGs candidatas no momento da publicação privilegia proximidade.**
   O caso afirma que "ONGs mais próximas do doador têm vantagem logística (menos tempo até a coleta)", mas não diz *como* isso vira ação do sistema.
   - **Origem:** **derivada**: recomendação informal do caso, sem mecânica explícita.
   - **Enunciado (verificável):** quando uma doação é publicada, o sistema calcula a distância geodésica entre o endereço do doador e cada ONG cadastrada e expõe a lista em ordem crescente de distância; a regra afeta a *visualização*, não o direito de aceitar (qualquer ONG cadastrada pode aceitar).
   - **Verificação:** publicar uma doação com 3 ONGs em distâncias 1,2 km / 0,4 km / 3,0 km → ordem na tela: ONG-B (0,4), ONG-A (1,2), ONG-C (3,0). Verificável com fixture de coordenadas (sem mock de distância).
 
3. **Destino de uma doação aceita que expira sem ser coletada.**
   O caso não diz o que acontece com uma doação aceita mas não coletada dentro da janela de validade nem se outra ONG pode assumi-la.
   - **Origem:** **AUSENTE**: não está no caso; alguém vai ter de decidir. **Quem decide:** Marta, com aval da vigilância sanitária antes do piloto ir para a rua.
   - **Enunciado (a ser adotado quando decidido: protótipo atual trata como terminal após 1ª aceitação):** uma doação aceita por uma ONG permanece em estado `aceita` até `validade` ou `coletada`; se expirar sem coleta, transita para `expirada_aceita` e **não** volta para a lista pública sem intervenção manual da Marta.
   - **Regra classificada como INVENTADA** pelo grupo, no preenchimento da lacuna; é decisão, não levantamento.
   - **Verificação:** simulação end-to-end com relógio simulado: aceitar uma doação, avançar para `validade + 2h`, confirmar (a) que ela some da lista pública e (b) que exige ação manual para re-emissão.

## Histórias de usuário
| # | História (Como… quero… para…) | INVEST: o que falha |
|---|---|---|

## Critérios de aceite
**História X** — Dado … Quando … Então …

## Riscos
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|

## Hipótese e experimento

## Decisão de análise
- **Problema:**
- **Alternativas:**
- **Decisão e justificativa:**
- **Riscos e limitações:**

## Uso de IA
O que geramos com IA, o que verificamos e o que alteramos.
