# DynamoDB Mappers

Responsabilidade única: converter entre **entidade de domínio** (camelCase, tipos do `@core/domain` ou `@repo/contracts`) e **entidade DynamoDB** (snake_case, PK/SK/GSI, formato de item da tabela). Essa pasta é a fronteira de formato entre aplicação e banco.

## Papel na arquitetura

- **Camada:** Infraestrutura (detalhe de persistência).
- **Implementa:** Interfaces definidas em `@data/protocols` (ex: `TodoMapper<TDBEntity>`, `ProjectMapper<TDBEntity>`).
- **Usado por:** Repositórios em `../repositories/` e pelas factories em `../factories/` que instanciam mapper + repositório.

Nunca usar mappers desta pasta em controllers ou services para converter para DTO HTTP; isso é feito pelos mappers de módulo em `src/app/modules/<domain>/mappers/` (domínio → contrato).

## Estrutura da pasta

```
mappers/
├── CLAUDE.md
├── todo/
│   ├── types.ts         ← TodoDynamoDBEntity (shape do item no DynamoDB)
│   └── todo-mapper.ts   ← TodoDynamoMapper
├── projects/
│   ├── types.ts         ← ProjectDynamoDBEntity
│   └── project-mapper.ts
├── sections/
│   ├── types.ts         ← SectionDynamoDBEntity
│   └── section-mapper.ts
└── user/
    ├── types.ts         ← UserDynamoDBEntity (estende BaseDynamoDBEntity)
    └── user-mapper.ts
```

## Convenções

### types.ts — entidade DynamoDB

- **Nome do tipo:** `{Entity}DynamoDBEntity` (ex: `TodoDynamoDBEntity`, `ProjectDynamoDBEntity`).
- **Conteúdo:** Interface que descreve exatamente o item como fica no DynamoDB:
  - **PK, SK** (obrigatórios para single-table design).
  - **GSI*PK, GSI*SK** quando a entidade participa de algum GSI (ex: GSI1 DueDateIndex, GSI3 SectionIndex, GSI6 ProjectNameIndex).
  - Atributos em **snake_case** (`user_id`, `created_at`, `due_date`, etc.).
  - Datas como **string ISO 8601**.
  - `entity_type` para discriminação (ex: `"TODO"`, `"PROJECT"`).
- **Alinhamento:** Os comentários em `types.ts` e a lógica nos mappers devem seguir `docs/database-design.md` (padrões de PK/SK e GSIs).

### Mapper class

- **Nome da classe:** `{Entity}DynamoMapper` (ex: `TodoDynamoMapper`).
- **Arquivo:** `{entity}-mapper.ts` ou `todo-mapper.ts` (kebab-case do nome da entidade).
- **Interface implementada:** A mesma definida em `@data/protocols` com genérico no tipo DynamoDB, ex: `TodoMapper<TodoDynamoDBEntity>`.

Métodos obrigatórios:

- **`toDomain(dbEntity: TDBEntity): DomainEntity`**  
  - Entrada: item DynamoDB (snake_case, PK/SK/GSI, strings de data).  
  - Saída: entidade de domínio (camelCase, `Date` onde for data).  
  - Responsável por: renomear campos, converter strings ISO em `Date`, ignorar PK/SK/GSI na “forma” do domínio.

- **`toDatabase(domainEntity: DomainEntity): TDBEntity`**  
  - Entrada: entidade de domínio.  
  - Saída: item pronto para PutItem/UpdateItem (com PK, SK e GSI preenchidos conforme design).  
  - Responsável por: montar PK/SK/GSI, converter `Date` em string ISO, snake_case.

Toda a lógica de **construção de chaves** (PK, SK, GSI*PK, GSI*SK) deve ficar **no mapper**, não no repositório. O repositório só chama `toDomain`/`toDatabase`.

## Regras para a IA

- Ao criar ou alterar um access pattern no DynamoDB, atualizar primeiro `types.ts` (e `docs/database-design.md` se for design novo) e depois o mapper (`toDatabase` e, se necessário, `toDomain`).
- Não expor tipos DynamoDB (PK/SK/GSI) para fora da infra; o domínio e os services só veem entidades de domínio.
- Não usar mappers desta pasta para converter domínio → DTO HTTP; usar os mappers do módulo em `src/app/modules/<domain>/mappers/`.
- User é um caso especial: o domínio/contrato pode vir de `@repo/contracts/auth/user`; o mapper continua tendo `UserDynamoDBEntity` em `types.ts` (podendo estender `BaseDynamoDBEntity` em `../contracts/entity`).

## Unit Tests

Mapper tests are co-located: `{entity}-mapper.test.ts` next to `{entity}-mapper.ts`. They are pure input/output tests with no mocks.

Key test patterns:
- **toDomain**: verify snake_case → camelCase conversion, null handling
- **toDatabase**: verify PK/SK construction for different scenarios (inbox vs project, pending vs completed)
- **Roundtrip**: `toDomain(toDatabase(entity))` should preserve all domain data

```ts
import { buildTask } from "@test/builders";
import { TasksDynamoMapper } from "./task-mapper";

it("should build inbox PK for task without projectId", () => {
  const task = buildTask({ userId: "u-1", projectId: null });
  const result = new TasksDynamoMapper().toDatabase(task);
  expect(result.PK).toBe("USER#u-1");
});
```

## Referências

- Protocolos de mapper: `src/data/protocols/` (ex: `todo/todo-mapper.ts`, `projects/project-mapper.ts`)
- Domínio: `src/core/domain/`
- Contratos (User): `@repo/contracts/auth/user`
- Base da entidade DynamoDB: `src/infra/db/dynamodb/contracts/entity.ts`
- Design da tabela e access patterns: `docs/database-design.md`
