# Roteiro da demonstração — Trabalho 3 (3 minutos)

**Versão:** branch `entrega-3` depois da integração das quatro histórias. **Objetivo:** demonstrar no celular publicação → aceite → coleta e aceite → devolução, mais um erro.

## Preparação — clone limpo

Em computador com Node 22.13+, Docker e Git:

```bash
git clone https://github.com/apda-agil/g1126-template-prato-cheio.git
cd g1126-template-prato-cheio
git switch entrega-3
```

No PowerShell, `Copy-Item .env.example .env`; no Linux/macOS, `cp .env.example .env`. Depois: `docker compose up -d`, `docker compose ps`, `npm ci`, `npm run db:migrar`, `npm test`, `npm start`. Abra `http://localhost:3000` no navegador do celular na mesma rede (se acessível) ou use o modo de dispositivo do navegador. Confirme `GET /api/saude` retornando `{"ok":true}`.

## Passo a passo com ação e resultado

| Tempo | Ação exata | Resultado esperado |
|---|---|---|
| 0:00–0:20 | Mostrar o problema: alimento disponível pode ficar sem coleta | Explica-se a última milha da doação |
| 0:20–0:55 | Preencher doador `Padaria Pão Bom`, tipo `Arroz`, quantidade `10 pacotes`, validade futura; publicar | Doação disponível, com ID, doador e dados textuais |
| 0:55–1:20 | Informar ONG `Casa Esperança`, clicar **Aceitar** | Sai da lista de disponíveis; histórico do doador mostra `aceita` |
| 1:20–1:45 | Informar ID da doação aceita, voluntário `Rui`, clicar **Confirmar coleta** | Histórico mostra `coletada` e o nome de Rui |
| 1:45–2:15 | Publicar outra doação, aceitá-la e devolver com o motivo `sem voluntário hoje` | Volta à lista de disponíveis, sem ONG responsável |
| 2:15–2:35 | Tentar coletar a segunda doação ainda disponível | Mensagem de erro, estado permanece disponível |
| 2:35–3:00 | Abrir **Resultado mensal**, consultar mês atual e explicar o relatório; mencionar limitações | Contagem de publicadas, aceitas, coletadas e média/sem coletas |

**Consulta adicional H1:** o botão **Consultar histórico** lista apenas as publicações do doador indicado. **Painel legado:** a seção de expiradas contabiliza validades vencidas da semana indicada (segunda-feira).

## Testado por

- **Nome de quem não escreveu o roteiro:** [preencher após executar]
- **Data:** [preencher]
- **Commit/branch testado:** [link]
- **Conseguiu executar sem ajuda?** [sim/não]
- **Resultado e dificuldades:** [registrar fatos reais]
- **O que mudou no roteiro depois do teste:** [explicar e linkar commit]
- **Evidência (foto, captura ou link):** [preencher]

## Limitações

Não há autenticação real para os nomes informados. O banco precisa estar disponível; o CI verde não substitui a demonstração local. O tempo de publicação de 30 segundos ainda depende de medição com usuários.
