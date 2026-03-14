# Implementação: Mapper Layer + Rota POST /todos

## 📋 Resumo das Implementações

Este documento descreve duas implementações importantes:

1. **Mapper Layer**: Camada agnóstica de mapeamento entre banco de dados e aplicação
2. **Rota POST /todos**: Endpoint para criar TODOs com validação Zod e DTOs

---

## 🗺️ Parte 1: Mapper Layer (Database ↔ Domain)

### 🎯 Objetivo

Criar uma camada de mapeamento agnóstica que:
- Converte dados do banco (ex: snake_case) para domínio (camelCase)
- Abstrai estrutura específica do banco (PK/SK, GSI, etc)
- Permite trocar tecnologia de banco sem afetar a aplicação
- Segue o mesmo padrão de arquitetura agnóstica (interface + implementação)

### 🏗️ Arquitetura do Mapper

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  Service → TodoRepository (interface)                           │
│                     ↓ retorna                                   │
│                   Todo (Domain Entity - camelCase)              │
└─────────────────────────────────────────────────────────────────┘
                          ▲
                          │ toDomain()
┌─────────────────────────┼─────────────────────────────────────┐
│        DATA LAYER       │                                      │
│  TodoMapper (interface) │                                      │
│         ↑               │                                      │
│         │ implements    │ toDatabase()                         │
└─────────┼───────────────┼──────────────────────────────────────┘
          │               ↓
┌─────────┼───────────────┼──────────────────────────────────────┐
│   INFRA LAYER           │                                      │
│  TodoDynamoMapper       │                                      │
│         ↓               ↓                                      │
│  TodoDynamoDBEntity (snake_case, PK/SK, GSI)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 📁 Arquivos Criados

#### 1. Interface Agnóstica - `data/protocols/todo-mapper.ts`

```typescript
export interface TodoMapper<TDBEntity = unknown> {
  toDomain(dbEntity: TDBEntity): Todo;
  toDatabase(todo: Todo): TDBEntity;
}
```

**Características:**
- ✅ Genérica (funciona com qualquer tipo de DB entity)
- ✅ Define contrato de mapeamento
- ✅ Agnóstica à tecnologia de banco

#### 2. Tipos do DynamoDB - `infra/db/dynamodb/mappers/types.ts`

```typescript
export interface TodoDynamoDBEntity {
  PK: string;                    // "TODO#${id}"
  SK: string;                    // "METADATA"
  GSI1PK: string;                // "TODO"
  GSI1SK: string;                // ISO timestamp
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;            // snake_case + ISO string
  updated_at: string;            // snake_case + ISO string
  entity_type: string;           // "TODO"
}
```

**Características:**
- ✅ Representa estrutura real do DynamoDB
- ✅ Usa snake_case (padrão de bancos de dados)
- ✅ Inclui metadados do DynamoDB (PK/SK/GSI)
- ✅ Datas como ISO strings

#### 3. Implementação DynamoDB - `infra/db/dynamodb/mappers/todo-mapper.ts`

```typescript
export class TodoDynamoMapper implements TodoMapper<TodoDynamoDBEntity> {
  toDomain(dbEntity: TodoDynamoDBEntity): Todo {
    return {
      id: dbEntity.id,
      title: dbEntity.title,
      description: dbEntity.description,
      completed: dbEntity.completed,
      createdAt: new Date(dbEntity.created_at),     // ISO string → Date
      updatedAt: new Date(dbEntity.updated_at),     // ISO string → Date
    };
  }

  toDatabase(todo: Todo): TodoDynamoDBEntity {
    return {
      PK: `TODO#${todo.id}`,
      SK: "METADATA",
      GSI1PK: "TODO",
      GSI1SK: todo.createdAt.toISOString(),
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      created_at: todo.createdAt.toISOString(),     // Date → ISO string
      updated_at: todo.updatedAt.toISOString(),     // Date → ISO string
      entity_type: "TODO",
    };
  }
}
```

**Características:**
- ✅ Implementa interface agnóstica
- ✅ Converte snake_case ↔ camelCase
- ✅ Converte Date ↔ ISO string
- ✅ Adiciona/remove metadados do DynamoDB
- ✅ Isolado em infra/

### 🔄 Integração do Mapper no Repository

#### Antes (sem mapper)

```typescript
export class TodoDynamoRepository {
  private todos: Todo[] = [...]; // Armazenava em formato de domínio
  
  async findAll(): Promise<Todo[]> {
    return this.todos; // Retornava direto
  }
}
```

#### Depois (com mapper)

```typescript
export class TodoDynamoRepository {
  private dbTodos: TodoDynamoDBEntity[] = [...]; // Armazena em formato DB
  
  constructor(private readonly mapper: TodoMapper<TodoDynamoDBEntity>) {}
  
  async findAll(): Promise<Todo[]> {
    return this.dbTodos.map(dbTodo => this.mapper.toDomain(dbTodo));
  }
  
  async create(data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const todo = { ...data, id: '...', createdAt: new Date(), updatedAt: new Date() };
    const dbEntity = this.mapper.toDatabase(todo); // Converte para DB
    this.dbTodos.push(dbEntity);
    return todo;
  }
}
```

### 🔧 Factory Atualizada

```typescript
export function makeTodoRepository(): TodoRepository {
  if (!todoRepositoryInstance) {
    const mapper = new TodoDynamoMapper(); // Cria mapper
    todoRepositoryInstance = new TodoDynamoRepository(mapper); // Injeta
  }
  return todoRepositoryInstance;
}
```

### 🎁 Benefícios do Mapper

#### 1. **Separação de Responsabilidades**
- Repository: Acesso a dados
- Mapper: Transformação de dados
- Domain: Regras de negócio

#### 2. **Flexibilidade de Formato**

```typescript
// DynamoDB usa snake_case
created_at: "2026-01-23T10:00:00.000Z"

// Aplicação usa camelCase
createdAt: Date object
```

#### 3. **Abstração de Estrutura do DB**

```typescript
// DynamoDB tem PK/SK
PK: "TODO#1", SK: "METADATA", GSI1PK: "TODO"

// Domínio não sabe disso
{ id: "1", title: "...", ... }
```

#### 4. **Fácil Trocar de Banco**

```typescript
// PostgreSQL Mapper
class TodoPostgresMapper implements TodoMapper<TodoPostgresEntity> {
  toDomain(row: TodoPostgresEntity): Todo {
    // row.created_at (timestamp) → createdAt (Date)
  }
}

// MongoDB Mapper
class TodoMongoMapper implements TodoMapper<TodoMongoDocument> {
  toDomain(doc: TodoMongoDocument): Todo {
    // doc._id → id, doc.createdAt (Date) → createdAt (Date)
  }
}
```

---

## 🚀 Parte 2: Rota POST /todos (Create TODO)

### 🎯 Objetivo

Criar endpoint para criação de TODOs com:
- Apenas 2 campos: title e description
- Validação com Zod
- DTOs tipados
- Seguindo o padrão arquitetural estabelecido

### 📋 Fluxo da Requisição

```
1. POST /todos
   Body: { "title": "...", "description": "..." }
   ↓
2. Lambda Handler (handler.ts)
   ↓
3. CreateTodoController
   │ - Valida com Zod (schema.ts)
   │ - Transforma em DTO tipado
   ↓
4. CreateTodoService
   │ - Recebe DTO validado
   │ - Aplica lógica de negócio
   │ - Chama repository
   ↓
5. TodoRepository (interface)
   ↓
6. TodoDynamoRepository (implementação)
   │ - Usa Mapper para converter
   │ - Persiste no formato DB
   ↓
7. Response: 201 Created
   { "todo": { "id": "...", ... } }
```

### 📁 Estrutura de Arquivos

```
app/modules/todos/
├── services/create-todo/
│   ├── dto.ts                    # ✨ DTOs + Schema Zod
│   ├── service.ts                # ✨ Lógica de negócio
│   └── index.ts
│
├── controllers/create-todo/
│   ├── controller.ts             # ✨ Validação + orquestração
│   ├── schema.ts                 # ✨ Schema de validação
│   └── index.ts

factories/
├── services/todo/
│   └── create-todo.ts            # ✨ Factory do service
│
└── controllers/todo/
    └── create-todo.ts            # ✨ Factory do controller

server/functions/todo/create-todo/
├── handler.ts                    # ✨ Lambda handler
└── index.ts
```

### 📝 Implementação Detalhada

#### 1. DTO com Validação Zod - `services/create-todo/dto.ts`

```typescript
export const CreateTodoInputDTO = z.object({
  title: z
    .string()
    .min(1, "Título não pode ser vazio")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  
  description: z
    .string()
    .min(1, "Descrição não pode ser vazia")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
});

export type CreateTodoInput = z.infer<typeof CreateTodoInputDTO>;

export interface CreateTodoOutput {
  todo: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
```

**Características:**
- ✅ Schema Zod para validação runtime
- ✅ Type inference para type safety
- ✅ Output tipado para consistência

#### 2. Service - `services/create-todo/service.ts`

```typescript
export class CreateTodoService implements IService<CreateTodoInput, CreateTodoOutput> {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<CreateTodoOutput> {
    const todo = await this.todoRepository.create({
      title: input.title,
      description: input.description,
      completed: false, // Sempre inicia como não completado
    });

    return { todo };
  }
}
```

**Características:**
- ✅ Recebe dados já validados
- ✅ Aplica regras de negócio (completed = false)
- ✅ Depende apenas de interface
- ✅ Retorna DTO tipado

#### 3. Controller - `controllers/create-todo/controller.ts`

O padrão atual de controllers está em `apps/api/CLAUDE.md` e em `.cursor/rules/controllers-icontroller.mdc`. Resumo: estender `Controller`, definir `schema` (só body), implementar apenas `handle()` passando `userId` do request quando necessário; sem try/catch (erros tratados no lambda adapter).

```typescript
export class CreateTodoController extends Controller {
  constructor(private readonly createTodoService: ICreateTodoService) {
    super();
  }

  protected override schema = createTodoSchema;

  protected override async handle(request: IRequest<CreateTodoSchema>): Promise<IResponse> {
    const service = await this.createTodoService.execute({
      ...request.body,
      userId: request.userId ?? "",
    });
    const body: CreateTodoResponse = { todo: todoToDto(service.todo) };
    return { statusCode: 201, body };
  }
}
```

**Características:**
- ✅ Validação via schema Zod na base Controller
- ✅ Retorna 201 Created
- ✅ Erros tratados no lambda adapter (não no controller)

#### 4. Handler - `server/functions/todo/create-todo/handler.ts`

```typescript
import { makeCreateTodoController } from "@factories/controllers/todo/create-todo";
import { lambdaHttpAdapter } from "@server/adapters/lambda-http-adapter";

const controller = makeCreateTodoController();
export const handler = lambdaHttpAdapter(controller);
```

### 🎯 Exemplos de Uso

#### Requisição Válida

```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar testes",
    "description": "Criar testes unitários e de integração"
  }'
```

**Response: 201 Created**
```json
{
  "todo": {
    "id": "4",
    "title": "Implementar testes",
    "description": "Criar testes unitários e de integração",
    "completed": false,
    "createdAt": "2026-01-23T14:30:00.000Z",
    "updatedAt": "2026-01-23T14:30:00.000Z"
  }
}
```

#### Requisição Inválida (título vazio)

```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "Descrição válida"
  }'
```

**Response: 400 Bad Request**
```json
{
  "message": "Dados de entrada inválidos: title: Título não pode ser vazio",
  "statusCode": 400
}
```

#### Requisição Inválida (título muito longo)

```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "título com mais de 100 caracteres...",
    "description": "Descrição válida"
  }'
```

**Response: 400 Bad Request**
```json
{
  "message": "Dados de entrada inválidos: title: Título deve ter no máximo 100 caracteres",
  "statusCode": 400
}
```

### 📊 Comparação: GET vs POST

| Aspecto | GET /todos | POST /todos |
|---------|------------|-------------|
| **Validação** | Não necessária | ✅ Zod schema |
| **DTO** | Output apenas | ✅ Input + Output |
| **Regras de negócio** | Listar todos | completed = false |
| **Status Code** | 200 OK | 201 Created |
| **Body** | Lista de todos | Todo criado |

---

## 📊 Arquitetura Completa (GET + POST + Mapper)

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  GET  /todos  → get-todos/handler.ts                             │
│  POST /todos  → create-todo/handler.ts                           │
└──────────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
│  GetTodosController   → GetTodosService                          │
│  CreateTodoController → CreateTodoService                        │
│                              ↓                                   │
│                      TodoRepository (interface)                  │
└──────────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  TodoRepository (interface)                                      │
│  TodoMapper (interface)                                          │
└──────────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                            │
│  TodoDynamoRepository                                            │
│  TodoDynamoMapper                                                │
│  TodoDynamoDBEntity (snake_case, PK/SK)                          │
└──────────────────────────────────────────────────────────────────┘
```

## ✅ Checklist de Validação

### Mapper Layer
- [x] Interface agnóstica criada (`TodoMapper`)
- [x] Tipos do DynamoDB definidos (`TodoDynamoDBEntity`)
- [x] Implementação DynamoDB criada (`TodoDynamoMapper`)
- [x] Repository atualizado para usar mapper
- [x] Factory atualizada para injetar mapper
- [x] Conversão snake_case ↔ camelCase funcionando
- [x] Conversão Date ↔ ISO string funcionando
- [x] Metadados DynamoDB (PK/SK/GSI) abstraídos

### Rota POST /todos
- [x] DTO com Zod criado
- [x] Service implementado
- [x] Controller com validação implementado
- [x] Schema de validação criado
- [x] Factories criadas
- [x] Handler criado
- [x] Rota adicionada ao serverless.yml
- [x] TypeScript compilando sem erros
- [x] Linter sem erros
- [x] Documentação criada

## 🎓 Princípios Aplicados

### SOLID
- ✅ **S**ingle Responsibility: Mapper só mapeia, Service só lógica de negócio
- ✅ **O**pen/Closed: Fácil adicionar novos mappers
- ✅ **L**iskov Substitution: Mappers intercambiáveis
- ✅ **I**nterface Segregation: Interfaces específicas
- ✅ **D**ependency Inversion: Depende de abstrações

### Clean Architecture
- ✅ Camadas desacopladas
- ✅ Dependências apontam para dentro
- ✅ Infraestrutura isolada
- ✅ Domain puro

### Boas Práticas
- ✅ Validação na borda (Controller)
- ✅ DTOs tipados
- ✅ Error handling consistente
- ✅ Factory pattern para DI
- ✅ Código testável

---

**Implementado em**: 2026-01-23  
**Features**: Mapper Layer + POST /todos  
**Status**: ✅ Completo e funcionando
