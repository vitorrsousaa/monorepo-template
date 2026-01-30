# Arquitetura Agnóstica de Banco de Dados

## 🎯 Objetivo

Esta arquitetura permite que a aplicação seja **completamente independente** da tecnologia de banco de dados utilizada, seguindo os princípios de **Clean Architecture** e **Dependency Inversion Principle (DIP)**.

## 🏗️ Estrutura de Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌──────────────┐                                               │
│  │  Controllers │                                               │
│  └──────┬───────┘                                               │
└─────────┼───────────────────────────────────────────────────────┘
          │
┌─────────┼───────────────────────────────────────────────────────┐
│         │                 APPLICATION LAYER                     │
│  ┌──────▼───────┐                                               │
│  │   Services   │ (Depende de interfaces, não implementações)   │
│  └──────┬───────┘                                               │
└─────────┼───────────────────────────────────────────────────────┘
          │
┌─────────┼───────────────────────────────────────────────────────┐
│         │                   DATA LAYER                          │
│  ┌──────▼───────────┐                                           │
│  │    Protocols     │ (Interfaces/Contratos)                    │
│  │ TodoRepository   │                                           │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
          ▲
          │ implements
          │
┌─────────┼───────────────────────────────────────────────────────┐
│         │              INFRASTRUCTURE LAYER                     │
│  ┌──────┴─────────────────┐                                     │
│  │  TodoDynamoRepository  │ (Implementação específica)          │
│  └────────────────────────┘                                     │
│                                                                  │
│  Pode ter outras implementações:                                │
│  - TodoPostgresRepository                                       │
│  - TodoMongoRepository                                          │
│  - TodoInMemoryRepository (para testes)                         │
└──────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Diretórios

```
src/
│
├── 📁 data/                              # DATA LAYER
│   └── protocols/                        # ✨ Interfaces (Contratos)
│       └── todo-repository.ts            # Interface agnóstica
│
├── 📁 infra/                             # INFRASTRUCTURE LAYER
│   └── db/
│       ├── dynamodb/                     # ✨ Implementação DynamoDB
│       │   ├── factories/
│       │   │   └── todo-repository-factory.ts
│       │   └── repositories/
│       │       └── todo/
│       │           └── todo-dynamo-repository.ts
│       │
│       ├── postgres/                     # 🔮 Futuro: Implementação Postgres
│       │   └── repositories/
│       │       └── todo/
│       │           └── todo-postgres-repository.ts
│       │
│       └── in-memory/                    # 🔮 Futuro: Mock para testes
│           └── repositories/
│               └── todo/
│                   └── todo-in-memory-repository.ts
│
├── 📁 app/                               # APPLICATION LAYER
│   └── modules/todos/
│       ├── services/                     # Usa interface, não implementação
│       │   └── get-todos/
│       │       └── service.ts            # Depende de TodoRepository (interface)
│       │
│       └── controllers/
│           └── get-todos/
│               └── controller.ts
│
└── 📁 factories/                         # DEPENDENCY INJECTION
    ├── services/todo/
    │   └── get-todos.ts                  # Injeta repository via factory
    │
    └── controllers/todo/
        └── get-todos.ts                  # Compõe tudo
```

## 🔄 Fluxo de Dependências

### ❌ ANTES (Acoplado ao DynamoDB)

```typescript
// Service acoplado à implementação específica
import { TodoDynamoRepository } from "@infra/db/dynamodb/...";

class GetTodosService {
  constructor(private repo: TodoDynamoRepository) {} // ❌ Acoplado!
}
```

### ✅ AGORA (Agnóstico)

```typescript
// Service depende apenas da interface
import type { TodoRepository } from "@data/protocols/todo-repository";

class GetTodosService {
  constructor(private repo: TodoRepository) {} // ✅ Agnóstico!
}
```

## 📝 Implementação Detalhada

### 1. Interface (Contrato) - `data/protocols/todo-repository.ts`

```typescript
import type { Todo } from "@core/domain/todo/todo";

export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(data: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  update(id: string, data: Partial<Todo>): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
```

**Características:**
- ✅ Define o contrato (o QUE fazer)
- ✅ Não sabe COMO fazer (implementação)
- ✅ Agnóstico a banco de dados
- ✅ Domain entities como tipos

### 2. Implementação DynamoDB - `infra/db/dynamodb/repositories/todo/todo-dynamo-repository.ts`

```typescript
import type { TodoRepository } from "@data/protocols/todo-repository";
import type { Todo } from "@core/domain/todo/todo";

export class TodoDynamoRepository implements TodoRepository {
  // Implementação específica do DynamoDB
  // - Usa DynamoDB client
  // - Conhece estrutura de chaves (PK/SK)
  // - Implementa mappers
  // - Trata erros específicos do DynamoDB
}
```

**Características:**
- ✅ Implementa a interface
- ✅ Conhece detalhes do DynamoDB
- ✅ Isolado na camada de infraestrutura
- ✅ Pode ser substituído facilmente

### 3. Factory - `infra/db/dynamodb/factories/todo-repository-factory.ts`

```typescript
import { TodoDynamoRepository } from "@infra/db/dynamodb/repositories/...";
import type { TodoRepository } from "@data/protocols/todo-repository";

export function makeTodoRepository(): TodoRepository {
  // Retorna a interface, não a implementação concreta
  return new TodoDynamoRepository();
}
```

**Características:**
- ✅ Singleton pattern
- ✅ Retorna interface (não implementação)
- ✅ Centraliza criação
- ✅ Facilita injeção de dependências

### 4. Service - `app/modules/todos/services/get-todos/service.ts`

```typescript
import type { TodoRepository } from "@data/protocols/todo-repository";

export class GetTodosService {
  constructor(private readonly todoRepository: TodoRepository) {}
  
  async execute() {
    // Não sabe se é DynamoDB, Postgres, ou in-memory
    return await this.todoRepository.findAll();
  }
}
```

**Características:**
- ✅ Depende apenas da interface
- ✅ Não conhece implementação
- ✅ Testável (fácil mockar)
- ✅ Reutilizável

### 5. Factory do Service - `factories/services/todo/get-todos.ts`

```typescript
import { GetTodosService } from "@application/modules/todos/services/get-todos";
import { makeTodoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetTodosService(): GetTodosService {
  const todoRepository = makeTodoRepository(); // Injeta implementação
  return new GetTodosService(todoRepository);
}
```

**Características:**
- ✅ Única place que conhece implementação concreta
- ✅ Facilita troca de implementação
- ✅ Inversão de dependência na prática

## 🎁 Benefícios

### 1. **Testabilidade** 🧪

```typescript
// Fácil criar mock
class TodoRepositoryMock implements TodoRepository {
  async findAll() { return []; }
  // ... outros métodos
}

// Usar no teste
const mockRepo = new TodoRepositoryMock();
const service = new GetTodosService(mockRepo);
```

### 2. **Substituição de Banco de Dados** 🔄

Para trocar de DynamoDB para Postgres:

```typescript
// 1. Criar implementação Postgres
class TodoPostgresRepository implements TodoRepository { ... }

// 2. Atualizar APENAS a factory
export function makeTodoRepository(): TodoRepository {
  return new TodoPostgresRepository(); // Mudança em 1 linha!
}

// 3. TODO o resto continua funcionando! 🎉
```

### 3. **Múltiplas Implementações** 🔀

```typescript
// Desenvolvimento: usar in-memory
if (env.NODE_ENV === 'development') {
  return new TodoInMemoryRepository();
}

// Produção: usar DynamoDB
return new TodoDynamoRepository();
```

### 4. **Isolamento de Testes** ✅

```typescript
// Repository pode ter seu próprio teste de integração
describe('TodoDynamoRepository', () => {
  it('should connect to DynamoDB', async () => {
    const repo = new TodoDynamoRepository();
    // Testa integração real com DynamoDB
  });
});

// Service testa lógica de negócio com mock
describe('GetTodosService', () => {
  it('should return all todos', async () => {
    const mockRepo = new TodoRepositoryMock();
    const service = new GetTodosService(mockRepo);
    // Testa apenas lógica, sem DB
  });
});
```

## 🔑 Princípios Aplicados

### 1. **Dependency Inversion Principle (DIP)**
> "Dependa de abstrações, não de implementações"

✅ Service depende de `TodoRepository` (interface)  
❌ Service NÃO depende de `TodoDynamoRepository` (implementação)

### 2. **Interface Segregation Principle (ISP)**
> "Interfaces específicas são melhores que interfaces genéricas"

✅ `TodoRepository` tem métodos específicos para Todo  
❌ Não usa uma mega interface genérica `IDatabase`

### 3. **Single Responsibility Principle (SRP)**
> "Cada classe tem uma única responsabilidade"

- `TodoRepository` (interface): Define contrato
- `TodoDynamoRepository`: Acesso a DynamoDB
- `GetTodosService`: Lógica de negócio
- `makeTodoRepository`: Criação de instâncias

### 4. **Open/Closed Principle (OCP)**
> "Aberto para extensão, fechado para modificação"

✅ Pode adicionar `TodoPostgresRepository` sem modificar código existente  
✅ Pode adicionar `TodoRedisRepository` sem modificar Service

## 🚀 Como Adicionar Nova Implementação

### Exemplo: Adicionar PostgreSQL

**1. Criar implementação:**

```typescript
// src/infra/db/postgres/repositories/todo/todo-postgres-repository.ts
import type { TodoRepository } from "@data/protocols/todo-repository";

export class TodoPostgresRepository implements TodoRepository {
  constructor(private pgClient: PostgresClient) {}
  
  async findAll() {
    const result = await this.pgClient.query('SELECT * FROM todos');
    return result.rows;
  }
  
  // ... outros métodos
}
```

**2. Criar factory:**

```typescript
// src/infra/db/postgres/factories/todo-repository-factory.ts
export function makeTodoRepository(): TodoRepository {
  const pgClient = makePostgresClient();
  return new TodoPostgresRepository(pgClient);
}
```

**3. Atualizar factory do service:**

```typescript
// src/factories/services/todo/get-todos.ts
// Trocar import:
// import { makeTodoRepository } from "@infra/db/dynamodb/factories/...";
import { makeTodoRepository } from "@infra/db/postgres/factories/...";

// Resto permanece IGUAL! 🎉
```

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Acoplamento** | ❌ Alto (Service conhece DynamoDB) | ✅ Baixo (Service conhece interface) |
| **Testabilidade** | ⚠️ Difícil (precisa mockar DynamoDB) | ✅ Fácil (mock da interface) |
| **Troca de DB** | ❌ Refatorar múltiplos arquivos | ✅ Mudar 1 linha na factory |
| **Múltiplas Impl** | ❌ Não suporta | ✅ Suporta (dev/prod/test) |
| **Princípios SOLID** | ⚠️ Viola DIP | ✅ Segue DIP, ISP, SRP |
| **Clean Architecture** | ⚠️ Camadas acopladas | ✅ Camadas independentes |

## 🎓 Resumo

### Camada `data/protocols/`
- **O que é**: Interfaces/Contratos
- **Responsabilidade**: Define o QUE fazer
- **Depende de**: Domain entities
- **É usado por**: Services, Implementations

### Camada `infra/db/`
- **O que é**: Implementações específicas
- **Responsabilidade**: Define o COMO fazer
- **Depende de**: Protocols, Database clients
- **É usado por**: Factories

### Fluxo de Injeção
```
Factory → Cria Implementação → Injeta como Interface → Service usa Interface
```

## ✅ Checklist de Boas Práticas

- [x] Services dependem de interfaces, não implementações
- [x] Interfaces definem contratos claros
- [x] Implementações isoladas em `infra/`
- [x] Factories retornam interfaces
- [x] Fácil adicionar novas implementações
- [x] Fácil trocar de banco de dados
- [x] Testável com mocks
- [x] Segue SOLID principles
- [x] Segue Clean Architecture

---

**Implementado em**: 2026-01-23  
**Padrão**: Clean Architecture + Dependency Inversion  
**Status**: ✅ Agnóstico a banco de dados
