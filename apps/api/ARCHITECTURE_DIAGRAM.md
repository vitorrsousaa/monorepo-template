# Diagrama de Arquitetura - Artemis API

## 🏗️ Visão Geral das Camadas

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│  📁 server/                                                         │
│    ├── adapters/         (Request/Response adapters)               │
│    └── functions/        (Lambda handlers)                         │
│         └── todo/                                                   │
│             └── get-todos/                                          │
│                 ├── handler.ts    ← Ponto de entrada               │
│                 └── index.ts                                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│  📁 app/modules/todo/                                               │
│    ├── controllers/                                                 │
│    │   └── get-todos/                                               │
│    │       └── controller.ts   ← Validação e orquestração          │
│    │                                                                 │
│    └── services/                                                    │
│        └── get-todos/                                               │
│            └── service.ts       ← Lógica de negócio                │
│                                      │                              │
│                                      │ depende de                   │
│                                      ▼                              │
└─────────────────────────────────────────────────────────────────────┘
                                      │
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                │
│  📁 data/protocols/                                                 │
│    └── todo-repository.ts   ← Interface (Contrato)                 │
│                                 ▲                                   │
│                                 │ implements                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                           │
│  📁 infra/db/dynamodb/                                              │
│    ├── repositories/todo/                                           │
│    │   └── todo-dynamo-repository.ts  ← Implementação específica   │
│    │                                                                 │
│    └── factories/                                                   │
│        └── todo-repository-factory.ts ← Criação de instâncias      │
└─────────────────────────────────────────────────────────────────────┘
                                  ▲
┌─────────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                                │
│  📁 core/domain/                                                    │
│    └── todo/                                                        │
│        └── todo.ts              ← Entidade de domínio               │
└─────────────────────────────────────────────────────────────────────┘
                                  ▲
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY INJECTION                             │
│  📁 factories/                                                      │
│    ├── controllers/todo/                                            │
│    │   └── get-todos.ts         ← Cria controller com service      │
│    │                                                                 │
│    └── services/todo/                                               │
│        └── get-todos.ts         ← Cria service com repository      │
│                                   (injeta implementação DynamoDB)   │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Fluxo de uma Requisição GET /todos

```
1️⃣  HTTP Request
    ↓
2️⃣  API Gateway (Lambda)
    ↓
3️⃣  handler.ts
    │ - requestAdapter(event)
    │ - makeGetTodosController()
    │ - controller.handle(request)
    │ - responseAdapter(response)
    ↓
4️⃣  GetTodosController
    │ - Validação (se necessário)
    │ - Chama service.execute()
    │ - Error handling
    ↓
5️⃣  GetTodosService
    │ - Lógica de negócio
    │ - Chama todoRepository.findAll()
    │ - Transforma resultado
    ↓
6️⃣  TodoRepository (interface)
    │ - Contrato agnóstico
    ↓
7️⃣  TodoDynamoRepository (implementação)
    │ - Acessa DynamoDB (ou array em memória por enquanto)
    │ - Retorna dados
    ↓
8️⃣  Response
    │ - Service processa dados
    │ - Controller formata response
    │ - Handler adapta para API Gateway
    ↓
9️⃣  HTTP Response (JSON)
```

## 🗂️ Estrutura Completa de Diretórios

```
apps/api/
├── src/
│   │
│   ├── 📁 core/                          # DOMAIN LAYER
│   │   └── domain/
│   │       └── todo/
│   │           └── todo.ts               # Entidade Todo
│   │
│   ├── 📁 data/                          # DATA LAYER (NOVO! ✨)
│   │   └── protocols/
│   │       └── todo-repository.ts        # Interface TodoRepository
│   │
│   ├── 📁 infra/                         # INFRASTRUCTURE LAYER (NOVO! ✨)
│   │   └── db/
│   │       └── dynamodb/
│   │           ├── factories/
│   │           │   └── todo-repository-factory.ts
│   │           │
│   │           └── repositories/
│   │               └── todo/
│   │                   └── todo-dynamo-repository.ts
│   │
│   ├── 📁 app/                           # APPLICATION LAYER
│   │   ├── interfaces/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── repository.ts             # Interface genérica
│   │   │   ├── http.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── modules/
│   │   │   └── todo/
│   │   │       ├── controllers/
│   │   │       │   └── get-todos/
│   │   │       │       ├── controller.ts
│   │   │       │       └── index.ts
│   │   │       │
│   │   │       └── services/
│   │   │           └── get-todos/
│   │   │               ├── service.ts    # Usa TodoRepository (interface)
│   │   │               └── index.ts
│   │   │
│   │   ├── database/
│   │   │   └── repositories/
│   │   │       └── todo/
│   │   │           └── repository.ts     # ⚠️  Deprecated (exemplo)
│   │   │
│   │   ├── errors/
│   │   │   ├── app-error.ts
│   │   │   ├── server-error.ts
│   │   │   └── zod.ts
│   │   │
│   │   ├── providers/
│   │   │   └── token/
│   │   │
│   │   ├── shared/
│   │   │   ├── errors/
│   │   │   └── middlewares/
│   │   │
│   │   └── utils/
│   │       ├── error-handler.ts
│   │       ├── missing-fields.ts
│   │       └── types.ts
│   │
│   ├── 📁 factories/                     # DEPENDENCY INJECTION
│   │   ├── controllers/
│   │   │   └── todo/
│   │   │       └── get-todos.ts          # Injeta service
│   │   │
│   │   └── services/
│   │       └── todo/
│   │           └── get-todos.ts          # Injeta repository (via factory de infra)
│   │
│   └── 📁 server/                        # PRESENTATION LAYER
│       ├── adapters/
│       │   ├── request.ts
│       │   ├── response.ts
│       │   └── body-parser.ts
│       │
│       └── functions/
│           ├── hello/
│           │   ├── handler.ts
│           │   └── index.ts
│           │
│           └── todo/
│               ├── get-todos/
│               │   ├── handler.ts
│               │   └── index.ts
│               │
│               └── README.md
│
├── serverless.yml
├── package.json
├── tsconfig.json
├── tsconfig.paths.json                   # Path aliases configurados
│
├── DATABASE_AGNOSTIC_ARCHITECTURE.md     # 📚 Documentação completa
├── REFACTORING_SUMMARY.md                # 📚 Resumo da refatoração
├── ARCHITECTURE_DIAGRAM.md               # 📚 Este arquivo
└── IMPLEMENTATION_SUMMARY.md             # 📚 Resumo da implementação
```

## 🎯 Mapeamento de Responsabilidades

### 📁 `core/domain/`
**Responsabilidade**: Entidades de domínio puras  
**Depende de**: Nada  
**É usado por**: Todos as camadas  
**Exemplo**: `todo.ts` - Define o que é um Todo

---

### 📁 `data/protocols/`
**Responsabilidade**: Interfaces/Contratos de dados  
**Depende de**: Domain  
**É usado por**: Services, Repositories  
**Exemplo**: `todo-repository.ts` - Define contrato do repository

---

### 📁 `infra/db/dynamodb/`
**Responsabilidade**: Implementação específica do DynamoDB  
**Depende de**: Data protocols, Domain  
**É usado por**: Factories  
**Exemplo**: `todo-dynamo-repository.ts` - Implementa acesso ao DynamoDB

---

### 📁 `app/modules/`
**Responsabilidade**: Lógica de aplicação/negócio  
**Depende de**: Data protocols, Domain  
**É usado por**: Controllers  
**Exemplo**: `service.ts` - Lógica de buscar todos

---

### 📁 `factories/`
**Responsabilidade**: Criação e injeção de dependências  
**Depende de**: Tudo (compõe as camadas)  
**É usado por**: Handlers  
**Exemplo**: `get-todos.ts` - Injeta repository no service

---

### 📁 `server/`
**Responsabilidade**: Adaptação para AWS Lambda  
**Depende de**: Factories  
**É usado por**: API Gateway  
**Exemplo**: `handler.ts` - Ponto de entrada da função

---

## 🔄 Fluxo de Dependências (Dependency Flow)

```
┌─────────────┐
│   Domain    │ ← Camada mais interna (sem dependências)
└──────┬──────┘
       │
┌──────▼──────┐
│    Data     │ ← Define contratos (depende só do Domain)
│  Protocols  │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
┌──────▼──────┐                   ┌─────▼──────┐
│     App     │                   │   Infra    │
│  Services   │                   │    DB      │
└──────┬──────┘                   └─────┬──────┘
       │                                 │
       │         ┌───────────────────────┘
       │         │
┌──────▼─────────▼──┐
│     Factories     │ ← Conecta tudo (Dependency Injection)
└──────┬────────────┘
       │
┌──────▼──────┐
│   Server    │ ← Camada mais externa (apresentação)
│  Functions  │
└─────────────┘
```

**Regra de Ouro**: Dependências apontam SEMPRE para dentro (do Server para o Domain)

## 🎨 Código em Cada Camada

### 1️⃣ Domain (`core/domain/todo/todo.ts`)

```typescript
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2️⃣ Data Protocol (`data/protocols/todo-repository.ts`)

```typescript
export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  // ...
}
```

### 3️⃣ Infrastructure (`infra/db/dynamodb/repositories/todo/todo-dynamo-repository.ts`)

```typescript
export class TodoDynamoRepository implements TodoRepository {
  async findAll() {
    // Implementação específica DynamoDB
  }
}
```

### 4️⃣ Application Service (`app/modules/todo/services/get-todos/service.ts`)

```typescript
export class GetTodosService {
  constructor(private repo: TodoRepository) {} // Interface!
  
  async execute() {
    return await this.repo.findAll();
  }
}
```

### 5️⃣ Factory (`factories/services/todo/get-todos.ts`)

```typescript
export function makeGetTodosService() {
  const repo = makeTodoRepository(); // Injeta implementação
  return new GetTodosService(repo);
}
```

### 6️⃣ Handler (`server/functions/todo/get-todos/handler.ts`)

```typescript
export async function handler(event: APIGatewayProxyEventV2) {
  const controller = makeGetTodosController();
  const response = await controller.handle(requestAdapter(event));
  return responseAdapter(response);
}
```

## 📊 Path Aliases Configurados

```typescript
{
  "@application/*": "./src/app/*",
  "@server/*":      "./src/server/*",
  "@core/*":        "./src/core/*",
  "@factories/*":   "./src/factories/*",
  "@data/*":        "./src/data/*",        // ✨ NOVO
  "@infra/*":       "./src/infra/*"        // ✨ NOVO
}
```

## ✅ Validações de Arquitetura

### ✔️ Camadas Respeitadas
- [x] Domain não depende de nada
- [x] Data só depende de Domain
- [x] App só depende de Data e Domain
- [x] Infra só depende de Data e Domain
- [x] Server depende de Factories

### ✔️ Inversão de Dependência
- [x] Service depende de interface, não implementação
- [x] Repository implementa interface
- [x] Factory injeta implementação como interface

### ✔️ Responsabilidades Claras
- [x] Cada camada tem responsabilidade única
- [x] Sem vazamento de abstrações
- [x] Acoplamento mínimo

## 🎓 Princípios Aplicados na Arquitetura

### Clean Architecture ✅
- Dependências apontam para dentro
- Domain no centro (independente)
- Infraestrutura na borda (substituível)

### SOLID ✅
- **S**: Cada classe uma responsabilidade
- **O**: Aberto para extensão (novas implementações)
- **L**: Interfaces bem definidas
- **I**: Interfaces específicas (TodoRepository)
- **D**: Inversão de dependência (Service → Interface)

### DDD (Domain-Driven Design) ✅
- Domain separado
- Repositories como abstração
- Services com lógica de negócio

## 🚀 Próximas Expansões

### Adicionar Postgres
```
infra/db/
├── dynamodb/          # ✅ Implementado
│   └── repositories/
│       └── todo/
│
└── postgres/          # 🔮 Futuro
    └── repositories/
        └── todo/
            └── todo-postgres-repository.ts
```

### Adicionar Mock para Testes
```
infra/db/
├── dynamodb/          # ✅ Implementado
├── postgres/          # 🔮 Futuro
│
└── in-memory/         # 🔮 Futuro (testes)
    └── repositories/
        └── todo/
            └── todo-in-memory-repository.ts
```

### Adicionar Cache
```
infra/
├── db/
│   ├── dynamodb/      # Persistência
│   └── redis/         # Cache
│       └── repositories/
│           └── todo/
```

---

**Criado em**: 2026-01-23  
**Arquitetura**: Clean Architecture + DDD  
**Status**: ✅ Estrutura completa e documentada
