# Guia de integração e entrega — Trabalho 3 (26/11/2026)

Este ZIP é uma **versão de trabalho preparada**, não um registro de PRs ou CI aprovados. A integração deve ser feita no GitHub pela equipe; cada mudança por PR revisado, branch atualizada, um PR de cada vez e CI verde na `main` após o merge. Não faça commit direto na `main`.

## Sequência recomendada de PRs

1. `feat/h1-doador`: doador obrigatório, histórico, tela e testes H1. Dono ≠ revisor.
2. `feat/h2-coleta`: nome do voluntário, horário, interface e testes H2; registrar o experimento de inversão em `docs/evidencias/inversao-h2.md` e na seção `## Inversão de regra` do PR.
3. `feat/h3-devolucao`: devolução com motivo, bloqueio de ONG diferente/coletada, testes e tela.
4. `refactor/transicoes`: `executarTransicao()` extraída, com testes verdes antes/depois. Revisor registra >=3 comentários em linha; autor responde; adicionar `## O que a revisão mudou` no PR.
5. `feat/h4-relatorio`: mês de eventos, contagem, média, datas fixas nos testes e tela.
6. `docs/trabalho3-fechamento`: README, docs/projeto.md, demo, validação, retrospectiva, evidências do clone limpo e do CI. **O par `docs/refatoracoes.md` + `docs/validacao.md` deve caber em 4 páginas impressas.**

Para separar em PRs preservando o histórico, use os arquivos deste ZIP como referência e aplique as alterações correspondentes em branches sequenciais. Não envie o ZIP inteiro em um único PR e depois declare que cada história teve PR próprio. As alterações nos testes antigos (identificador do doador e voluntário obrigatórios) são intencionais e devem estar justificadas nos PRs de H1 e H2.

## Preparação do fechamento

- [ ] H1–H4 integradas na `main` por PRs revisados com testes cobrindo cada CA e um limite/erro.
- [ ] H2: inversão executada, vermelhos e restauração documentados.
- [ ] Refatoração 1: número de testes SQLite antes e PostgreSQL depois com URLs.
- [ ] Refatoração 2: PR separado, testes verdes antes/depois, revisão >=3 comentários respondidos e seção `## O que a revisão mudou`.
- [ ] Clonar em pasta nova com outra pessoa, rodar PostgreSQL, `npm ci`, migração, testes e UI.
- [ ] Demo de 3 minutos no celular, campo `## Testado por` completo com nome, data, resultado e correções.
- [ ] `docs/validacao.md` com critérios originais e H1–H4, evidências, limitações e `## Uso de IA` com erro corrigido.
- [ ] `docs/retrospectivas/3.md` com decisões, próximos passos, pontos somando 100, nomes e links.
- [ ] CI verde da `main` após todos os merges.

## Congelar o código para correção

Só depois dos merges, em clone atualizado:

```bash
git switch main
git pull
git switch -c entrega-3
git push -u origin entrega-3
```

O workflow foi configurado para executar também em push na branch `entrega-3`. **Não altere essa branch depois do prazo.** Copie a URL da execução verde nessa branch.

## Entrega individual no Teams — exatamente quatro linhas

```text
Repositório: https://github.com/apda-agil/g1126-template-prato-cheio
Branch: entrega-3
Execução do CI: [URL REAL do Actions verde na entrega-3]
Meus commits: [URL da lista de commits filtrada pelo usuário autor]
```

## Defesa individual

Levar notebook com clone e app rodando; explicar a contribuição e uma refatoração, responder por outra parte e fazer uma pequena alteração ao vivo. Evitar alegar que rodou o CI se a execução não consta do GitHub.
