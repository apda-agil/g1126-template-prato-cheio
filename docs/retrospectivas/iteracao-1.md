# Retrospectiva da Iteração 1

- **Data:** 03/09/2026
- **Grupo:** G1126 — Prato Cheio

## O que decidimos nesta iteração

Definimos como walking skeleton o fluxo mínimo:
doador publica uma doação com os 3 campos obrigatórios →
ONG visualiza a doação →
ONG aceita →
a doação deixa de aparecer na lista de disponíveis.

Optamos pela fatia mínima para validar primeiro o fluxo central
da História Zero, deixando funcionalidades mais complexas para
iterações posteriores.

## O que funcionou

- O grupo dividiu a elaboração do documento de análise entre os integrantes.
- Foram definidos stakeholders, objetivos de impacto, regras de negócio,
  conflitos de prioridade, histórias de usuário e critérios de aceite.
- Foram documentados os riscos, a hipótese e o experimento.
- A decisão de análise e sua justificativa foram registradas.
- Foram implementadas validações para criação e aceitação de doações.
- O repositório de doações foi implementado.
- Os testes de publicação e aceitação foram desenvolvidos.

## O que mudaríamos

Começaríamos a implementação do walking skeleton mais cedo,
em paralelo à documentação, para reduzir o risco de deixar
a integração e os testes para o final da iteração.

Também faríamos revisões intermediárias entre os integrantes,
evitando concentrar a validação do fluxo completo próximo à entrega.

## Próximos passos

- Confirmar que todos os testes estão passando no CI.
- Validar manualmente o fluxo completo do walking skeleton.
- Corrigir eventuais problemas encontrados antes do branch `entrega-1`.
- Continuar as funcionalidades que ficaram fora da fatia mínima
  nas próximas iterações.

## Autoavaliação de contribuição

| Integrante | Pontos | Contribuição |
|---|---:|---|
| Larissa | 25 | Trabalhou no conflito de prioridade, documentação do uso de IA e riscos. Também participou diretamente da implementação do walking skeleton, adicionando validações às funções de criação e aceitação de doações, implementando o repositório e desenvolvendo os testes de publicação e aceitação. |
| Guilherme Halter | 27 | Trabalhou na documentação dos stakeholders, definição e melhoria da História Zero e seus critérios de aceite, além da hipótese e do experimento. Também realizou atualização da documentação do projeto. |
| João Bagatoli | 23 | Trabalhou nas regras de negócio, histórias de usuário e critérios de aceite, além da definição da decisão de análise e sua justificativa. |
| MilhoFurtado | 25 | Trabalhou nos objetivos de impacto, na revisão das histórias relacionadas aos voluntários e ONGs e também nas histórias de usuário e critérios de aceite. |
| **Total** | **100** | |
