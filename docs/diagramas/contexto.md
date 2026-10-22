# Diagrama de contexto — Prato Cheio

**Pergunta:** Quem interage com o Prato Cheio e para qual finalidade?

**Decisão que sustenta:** D1 (última milha textual) e D3 (sem serviço externo de mapas).

**Situação:** retrato da proposta do incremento do Trabalho 2; requer merge na `main` para ser retrato da `main`.

```mermaid
flowchart LR
    DO[Doador] -->|publica e acompanha doação| S[Prato Cheio]
    ONG[ONG] -->|consulta e aceita doação| S
    VOL[Voluntário] -->|confirma coleta pela ONG| S
    M[Marta] -->|consulta totais mensais| S
    VS[Vigilância sanitária] -->|exige tipo, quantidade e validade| S
    S -->|persiste dados| DB[(SQLite)]
```

**Limitação:** os papéis são representados por identificadores enviados pelo cliente; não há autenticação ou autorização de produção.
