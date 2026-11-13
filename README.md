
# Prato Cheio — PostgreSQL

Sistema de doações de alimentos desenvolvido para conectar doadores a organizações não governamentais (ONGs).

Projeto desenvolvido com Node.js, Express e PostgreSQL.

## Tecnologias utilizadas

- JavaScript
- Node.js
- Express
- PostgreSQL 16
- Docker e Docker Compose
- Vitest
- Git e GitHub
- GitHub Actions

## Funcionalidades

- Cadastrar doações de alimentos
- Listar doações disponíveis
- Permitir que ONGs aceitem doações
- Consultar doações por doador
- Cancelar doações disponíveis
- Registrar a coleta de doações
- Gerar relatórios mensais

## Migração para PostgreSQL

O sistema utilizava SQLite como banco de dados.

A migração para PostgreSQL foi realizada para melhorar o suporte a acessos simultâneos, permitir uma arquitetura de banco cliente-servidor e preparar a aplicação para futuras melhorias.

As consultas SQL foram adaptadas para PostgreSQL, preservando as regras de negócio existentes.

## Requisitos

Para executar o projeto, é necessário instalar:

- Node.js 22.13 ou superior
- Docker Desktop com Docker Compose
- Git (opcional)


## Como executar

### 1. Clonar o repositório

Em uma pasta nova, execute:

```bash
git clone https://github.com/apda-agil/g1126-template-prato-cheio.git
cd g1126-template-prato-cheio
```

Para testar uma branch específica, selecione-a com
`git switch nome-da-branch`.

### 2. Configurar o ambiente

É necessário utilizar Node.js 22.13 ou superior e
Docker Desktop com Docker Compose funcionando.

No PowerShell, execute:

```powershell
Copy-Item .env.example .env
```

O arquivo .env deve conter as conexões PostgreSQL
correspondentes à configuração do compose.yaml.

O arquivo .env não deve ser enviado para o GitHub.

### 3. Iniciar o PostgreSQL

```bash
docker compose up -d
```

Verifique o estado do serviço:

```bash
docker compose ps
```

Resultado esperado: serviço postgres com status
Up (healthy).

### 4. Instalar as dependências

```bash
npm ci
```

O npm ci instala as versões registradas no
package-lock.json, permitindo uma instalação
reproduzível.

### 5. Criar as tabelas

```bash
npm run db:migrar
```

Resultado esperado: mensagem "schema criado".

### 6. Iniciar a aplicação

```bash
npm start
```

No navegador, acesse:

http://localhost:3000

Resultado esperado: a página inicial do Prato Cheio
é carregada.

### 7. Verificar as funcionalidades

Na interface do sistema:

1. Publicar uma doação com tipo, quantidade e validade.
2. Verificar se a doação aparece na lista.
3. Aceitar a doação como ONG.
4. Confirmar que ela não aparece mais entre as disponíveis.

### 8. Encerrar o ambiente

Para interromper a aplicação, pressione Ctrl+C
no terminal em que o servidor está executando.

Para parar o PostgreSQL:

```bash
docker compose down
```

Esse comando mantém o volume persistente do banco.

## Verificação de clone limpo

O teste de clone limpo deve ser realizado por um
integrante que não escreveu estas instruções.

O integrante deverá:

1. Clonar o repositório em uma pasta nova.
2. Seguir somente as instruções do README.
3. Configurar o PostgreSQL.
4. Iniciar a aplicação.
5. Publicar e aceitar uma doação.
6. Registrar erros, dificuldades e ajustes necessários.

### Registro da verificação

**Testado por:** [preencher após execução]

**Data:** [preencher após execução]

**Resultado:** [Aprovado / Parcial / Reprovado]

**Dificuldades encontradas:** [preencher]

**Correções realizadas:** [preencher]

**Evidência:** [link ou captura do teste]

## Executar os testes

Para executar os testes automatizados:

```bash
npm test
```

Os testes utilizam o banco PostgreSQL exclusivo prato_cheio_test.

Os testes de integração exigem que o PostgreSQL esteja em execução.

## Integração contínua

O projeto utiliza GitHub Actions para executar testes automaticamente.

O pipeline:

1. Baixa o código do repositório.
2. Configura o Node.js.
3. Inicializa o PostgreSQL.
4. Instala as dependências.
5. Cria o banco de testes.
6. Executa os testes automatizados.
7. Verifica a inicialização da aplicação.

## Estrutura do projeto

src/
- app.js: rotas da API
- server.js: inicialização do servidor
- db.js: conexão com PostgreSQL
- repositorio.js: consultas SQL
- doacoes.js: regras de negócio

tests/
- Testes automatizados com Vitest

db/init/
- Script para criação do banco de testes

docs/
- Documentação, ADRs e evidências

compose.yaml
- Configuração do PostgreSQL no Docker

## Observações importantes

A migração do código para PostgreSQL não transfere automaticamente os registros existentes em arquivos SQLite.

Se houver dados antigos importantes, será necessário realizar backup e importação separadamente.

O banco de testes deve ser utilizado apenas para testes automatizados.

O sistema ainda utiliza identificadores textuais de doadores e ONGs, sem autenticação real.

## Documentação

As decisões arquiteturais e informações do projeto estão disponíveis na pasta docs/.

## Objetivo acadêmico

Aplicar conceitos de Engenharia de Software, persistência de dados, testes automatizados, integração contínua e evolução de sistemas existentes.
