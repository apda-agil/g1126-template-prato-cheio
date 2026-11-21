# H2 — Inversão de regra (experimento a executar no PR)

O PDF exige demonstrar o **vermelho antes do conserto**. Este pacote não declara ter executado o experimento: ele depende de um PostgreSQL e do CI.

1. Em branch temporária derivada do PR de H2, mantenha os testes H2 CA2 e a proteção do banco de testes.
2. **Somente no ambiente de testes e com revisão**, altere temporariamente a condição de `repo.coletar()` de `status = 'aceita'` para `status = 'disponivel'` e rode `npm test` contra `DATABASE_TEST_URL`.
3. Registre o nome exato do(s) teste(s) vermelho(s) e o link/print da execução: **[preencher]**.
4. **Desfaça a inversão antes do merge**, restaurando `status = 'aceita'` em `src/repositorio.js`.
5. Rode novamente os testes; registre a execução verde **[link]**. Se não houver vermelho, fortaleça H2 CA2 e repita o experimento.
6. Na descrição do PR, adicione exatamente `## Inversão de regra`, explicando: “regra invertida”, “testes vermelhos” e “inversão desfeita”.

**Não integrar nem disponibilizar a regra invertida à main.**
