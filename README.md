
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

Clone o repositório pelo GitHub ou baixe o projeto em ZIP.

Abra a pasta do projeto no VS Code.

### 2. Configurar as variáveis de ambiente

No terminal PowerShell, execute:

```powershell
Copy-Item .env.example .env
```

O arquivo .env terá as conexões:

DATABASE_URL=postgresql://prato_cheio:prato_cheio@localhost:5432/prato_cheio

DATABASE_TEST_URL=postgresql://prato_cheio:prato_cheio@localhost:5432/prato_cheio_test

### 3. Iniciar o PostgreSQL

Execute:

```bash
docker compose up -d
```

O Docker iniciará o PostgreSQL e, na primeira inicialização de um volume vazio, criará os bancos:

- prato_cheio: banco principal
- prato_cheio_test: banco exclusivo para testes

### 4. Instalar as dependências

```bash
npm install
```

### 5. Criar as tabelas

```bash
npm run db:migrar
```

### 6. Iniciar o sistema

```bash
npm start
```

Acesse:

http://localhost:3000

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
