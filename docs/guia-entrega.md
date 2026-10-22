# O que o grupo precisa fazer para a entrega de 22/10

1. Revisar as alterações propostas no ZIP. Cada integrante deve realizar uma contribuição real no GitHub (commit/PR) e conseguir explicá-la.
2. Publicar as alterações por branches e PRs separados, cada qual aprovado por **outro integrante** e com CI verde; preencher `docs/evidencias/registro-prs.md` com evidências reais.
3. Executar `npm ci && npm test` com Node 22+; testar no navegador e documentar resultados reais. Um ZIP não permite comprovar CI remoto verde.
4. Conferir o documento principal (máx. 4 páginas; ADRs e diagramas fora do limite) e ajustar concisão caso a renderização exceda.
5. Conferir o campo **Uso de IA** com o que aconteceu de fato; não atribuir a colegas revisões que não fizeram.
6. Após os merges: `git checkout main && git pull && git checkout -b entrega-2 && git push -u origin entrega-2`.
7. Cada integrante entrega no Teams a URL real do repositório e `Branch: entrega-2`, no prazo indicado no PDF.
8. Preparar 2–3 minutos de defesa: uma decisão/ADR, uma parte diferente e pequena edição ao vivo. Levar notebook clonado.

**Observações técnicas:** no protótipo não há autenticação; as novas rotas não podem ser tratadas como protegidas para produção. Relatório mensal agrupa pela criação e não pelo aceite; está documentado como simplificação a revisar.
