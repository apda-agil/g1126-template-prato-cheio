# ADR 0001 — Migrar SQLite para PostgreSQL apenas na Unidade 3

- **Data:** 2026-10-19
- **Status:** aceito (planejado para Unidade 3; não implementado)

## Contexto
O piloto Prato Cheio usa `node:sqlite` em `src/db.js` e uma interface `query(sql, valores)`; o incremento atual prioriza validar o fluxo de doações, baixo custo e CI sem serviço externo. PostgreSQL será útil quando o projeto exigir concorrência, múltiplas instâncias e implantação robusta, mas antecipar a migração agora aumenta o trabalho operacional e o risco de atrasar a entrega. A mudança de contexto (testes apagaram doações reais) exige isolamento **agora**, independente da futura migração.

## Alternativas consideradas
1. **Ficar em SQLite permanentemente:** simples, barato e portátil; limita escalabilidade/implantação multi-instância.
2. **Migrar já para PostgreSQL instalado localmente:** motor robusto; exige instalação, credenciais e manutenção nas máquinas da equipe.
3. **Migrar na Unidade 3 para PostgreSQL em contêiner e CI com serviço PostgreSQL (escolhida):** ambiente reproduzível e isolamento; exige Docker, adaptação de SQL (`?`/`RETURNING`, datas) e cuidado com dados existentes. Serviço gerenciado é alternativa operacional futura com custo de contratação e configuração de rede.

## Decisão
Continuar em SQLite nesta unidade e planejar PostgreSQL em contêiner na Unidade 3. Isolar imediatamente os testes em memória e impedir limpeza de dados fora desse contexto (ver ADR 0002). A troca do driver deve preservar a interface dos repositórios e ser validada por testes de regressão.

## Consequências
- **Positivas:** nenhum serviço extra agora; mantém o CI leve e o funcionamento do protótipo.
- **Negativas e quem paga:** equipe de desenvolvimento terá trabalho posterior de migração, configuração, scripts SQL, transição de dados e ajustes no CI; time de operação precisará manter backups e credenciais.
- **Riscos:** perda de dados na exportação/importação, incompatibilidades de SQL e uso acidental do banco real em testes. Mitigações: backup verificável, ambientes segregados, execução da suíte antes/depois e migração ensaiada com cópia anônima.

## Rastreabilidade
`docs/analise.md`: risco de atrasar o walking skeleton e exigência de manter o fluxo publicar → aceitar; regras mínimas da vigilância sanitária; hipótese de medir coleta.

## Critério de validação
Na Unidade 3: `npm test` deve continuar passando com PostgreSQL em um banco **exclusivo de testes**, e os testes de criação/aceite/cancelamento/coleta devem preservar status, campos e transições. Comprovar backup/restauração de uma base de ensaio e ausência de perda de registros. **Ainda não executável com PostgreSQL nesta unidade.**

## Revisão — 2026-10-19
**Mudou:** testes executados na máquina do piloto podem apontar para o banco real e apagar todas as doações. **Decisão continua válida:** adiar o PostgreSQL não justifica manter o risco; o banco de testes passou a ser determinado pelo próprio processo de teste, com limpeza recusada fora de execução de testes (ADR 0002). Migração ainda é da Unidade 3. As seções originais acima registram a decisão nova desta entrega; esta revisão explicita sua relação com a mudança de contexto.
