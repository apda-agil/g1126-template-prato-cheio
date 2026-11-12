
# Roteiro da demonstração — Prato Cheio

**Trabalho 3 — Engenharia de Software**

**Duração:** aproximadamente 3 minutos

## Objetivo

Demonstrar o funcionamento do sistema Prato Cheio, que conecta doadores de alimentos a ONGs, permitindo publicar, consultar e aceitar doações.

## Pré-requisitos

- Node.js 22.13 ou superior
- PostgreSQL 16
- Docker Desktop com Docker Compose
- Projeto disponível no computador

## Preparação

Na pasta do projeto, executar:

```powershell
Copy-Item .env.example .env
docker compose up -d
npm ci
npm run db:migrar
npm start
```

Acessar no navegador:

http://localhost:3000

Resultado esperado: a página Prato Cheio abre com o formulário de publicação e a lista de doações disponíveis.

## Roteiro de demonstração (3 minutos)

| Tempo | Ação | Resultado esperado |
|---|---|---|
| 0:00–0:20 | Explicar o objetivo do sistema | Apresentação do problema de desperdício de alimentos |
| 0:20–0:50 | Abrir a página inicial | Formulário e lista de doações disponíveis |
| 0:50–1:20 | Cadastrar uma doação | Doação publicada e exibida na lista |
| 1:20–1:50 | Aceitar a doação como ONG | Doação removida da lista de disponíveis |
| 1:50–2:30 | Testar publicação sem validade | API rejeita a publicação |
| 2:30–3:00 | Apresentar limitações | Explicar o que ainda precisa ser desenvolvido |

## Passo a passo reproduzível

### 1. Publicar uma doação

Na página inicial, preencher:

- Tipo de alimento: Arroz
- Quantidade: 10 pacotes
- Validade: selecionar uma data futura

Clicar no botão **Publicar**.

**Resultado esperado:** a doação aparece na lista de doações disponíveis.

### 2. Aceitar uma doação

Na lista de doações disponíveis, localizar a doação de arroz.

Clicar no botão **Aceitar**.

**Resultado esperado:** a doação deixa de aparecer na lista de disponíveis, pois foi aceita pela ONG.

### 3. Demonstrar um caso de erro

O formulário web atual não apresenta mensagens de erro de validação. Por isso, o caso negativo deve ser demonstrado diretamente pela API.

Abrir o terminal PowerShell e executar:

```powershell
$corpo = @{
    tipo = "Arroz"
    quantidade = "10 pacotes"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/doacoes" -Method Post -ContentType "application/json" -Body $corpo
} catch {
    Write-Host "HTTP:" ([int]$_.Exception.Response.StatusCode)
}
```

**Resultado esperado:** HTTP 400, pois a validade é obrigatória.

Nenhuma doação deve ser cadastrada por essa requisição.

### 4. Apresentar as limitações

Explicar que:

- A autenticação real de doadores e ONGs ainda não foi implementada.
- O sistema utiliza identificadores textuais para representar os usuários.
- O PostgreSQL substituiu o SQLite como banco de dados.
- Algumas funcionalidades ainda precisam de melhorias para uso em produção.

## Testado por

**Nome do integrante:** [preencher após o teste]

**Data:** [preencher após o teste]

**Executou sem ajuda:** [Sim/Não]

**Resultado:** [Aprovado/Parcial/Reprovado]

**Dificuldades encontradas:** [preencher]

**Alterações realizadas no roteiro:** [preencher]

## Evidências

- Link do Pull Request: [preencher]
- Link do GitHub Actions verde: [preencher]
- Capturas da demonstração: [adicionar, se disponíveis]

## Uso de IA

Foi utilizado o ChatGPT para auxiliar na organização do roteiro e na descrição dos resultados esperados.

As etapas foram elaboradas a partir das funcionalidades existentes no código do projeto.

A execução prática e a confirmação dos resultados devem ser realizadas pela equipe.
