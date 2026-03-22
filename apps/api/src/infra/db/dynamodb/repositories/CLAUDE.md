# DynamoDB Repositories

Implementações concretas dos repositórios de persistência para a API. Cada repositório **implementa** uma interface definida em `@data/protocols` e isola toda a lógica de acesso ao DynamoDB (ou, no estado atual, aos mocks em memória).

## Papel na arquitetura

- **Camada:** Infraestrutura (implementação de porta).
- **Depende de:** Mapper da entidade (em `../mappers/<entity>/`), e opcionalmente de `IDatabaseClient` (apenas quando DynamoDB real estiver ativo).
- **Usado por:** Services, via factories em `../factories/<entity>-repository-factory.ts`.

Fluxo: `Controller` → `Service` → `I*Repository` (interface) → **esta pasta** (implementação `*DynamoRepository`).

## Estrutura da pasta

```
repositories/
├── CLAUDE.md                          ← este arquivo
├── mock-ids.ts                        ← IDs compartilhados entre mocks (projetos, sections)
├── todo/
│   ├── todo-dynamo-repository.ts      ← implementação
│   └── todo-dynamo-repository.mocks.ts
├── projects/
│   ├── project-dynamo-repository.ts
│   └── project-dynamo-repository-mocks.ts
├── sections/
│   ├── section-dynamo-repository.ts
│   └── section-dynamo-repository-mocks.ts
└── user/
    └── user-dynamo-repository.ts      ← (sem mocks; usa client quando real)
```

## Convenções

### Nomenclatura

- **Classe:** `{Entity}DynamoRepository` (ex: `TodoDynamoRepository`, `ProjectDynamoRepository`).
- **Arquivo:** `{entity}-dynamo-repository.ts` (kebab-case).
- **Mocks:** `{entity}-dynamo-repository.mocks.ts` ou `-mocks.ts` — exporta array `*_DYNAMO_MOCKS` usado em desenvolvimento.

### Contrato

- Cada repositório **implementa** a interface em `@data/protocols`:
  - `ITodoRepository` → `src/data/protocols/todo/todo-repository.ts`
  - `IProjectRepository` → `src/data/protocols/projects/project-repository.ts`
  - `ISectionRepository` → `src/data/protocols/sections/section-repository.ts`
  - `IUserRepository` → `src/data/protocols/auth/user-repository.ts`
- O repositório **não** conhece DTOs HTTP nem `@repo/contracts` (exceto User que usa tipo do contracts). Trabalha com entidades de domínio (`@core/domain/*`) e com o tipo de entidade DynamoDB definido em `../mappers/<entity>/types.ts`.

### Uso do Mapper

- O repositório recebe o mapper no construtor e usa **sempre** para converter:
  - **Leitura:** `this.mapper.toDomain(dbEntity)` para retornar entidade de domínio.
  - **Escrita:** `this.mapper.toDatabase(domainEntity)` antes de persistir (ou de push no array de mocks).
- O repositório não monta PK/SK/GSI manualmente; isso fica nos mappers.

### Access patterns e documentação

- Comentários no código referenciam `docs/database-design.md` e descrevem os access patterns (PK/SK, GSI) que serão usados quando o DynamoDB real for ligado.
- Exemplo: "Docs: PK = USER#userId AND SK begins_with TODO#INBOX#".
- Manter esses comentários alinhados ao design da tabela para facilitar a implementação real depois.

## Estado atual: mocks em memória

- **DynamoDB real:** ainda não conectado. Blocos `// TODO: Implement real DynamoDB` indicam onde entrarão chamadas ao client.
- **Dados:** repositórios de Todo, Project e Section usam arrays em memória exportados pelos arquivos `*-repository.mocks.ts`. Os dados **não persistem** entre reinícios do `serverless-offline`.
- **IDs compartilhados:** `mock-ids.ts` centraliza IDs de projetos (e seções) usados nos mocks para manter consistência entre repositórios.
- **User:** `UserDynamoRepository` já recebe `IDatabaseClient` e `UserMapper`; quando o client for real, as operações irão para o DynamoDB.

## Ao adicionar um novo repositório

1. Definir ou reutilizar a interface em `@data/protocols/<domain>/`.
2. Criar a pasta `repositories/<entity>/` e o arquivo `{entity}-dynamo-repository.ts`.
3. Implementar a classe que recebe no construtor o mapper (e, se for o caso, o `IDatabaseClient`).
4. Usar **apenas** o mapper para converter entre domínio e formato DynamoDB; não duplicar lógica de PK/SK/GSI aqui.
5. Criar a factory em `../factories/{entity}-repository-factory.ts` que instancia o mapper e o repositório e retorna a interface.
6. Se for mock em memória, criar `{entity}-dynamo-repository.mocks.ts` e referenciar em `repositories/CLAUDE.md`.

## Integration Tests

Repository integration tests use DynamoDB Local via Docker. Files follow the naming pattern `*.integration.test.ts`.

```bash
pnpm --filter api test:integration:up    # start DynamoDB Local
pnpm --filter api test:integration       # run tests
pnpm --filter api test:integration:down  # stop container
```

`src/test/setup-integration.ts` handles table creation (PK/SK + GSI1/GSI3/GSI6) in `beforeAll` and clears all items in `beforeEach`.

```ts
// Example: tasks-dynamo-repository.integration.test.ts
import { createTestDynamoClient } from "@test/setup-integration";
import { buildTask } from "@test/builders";

describe("TasksDynamoRepository", () => {
  const { docClient, tableName } = createTestDynamoClient();
  // ... test with real DynamoDB operations
});
```

## Referências

- Protocolos (interfaces): `src/data/protocols/`
- Domínio: `src/core/domain/`
- Mappers: `src/infra/db/dynamodb/mappers/`
- Factories: `src/infra/db/dynamodb/factories/`
- Design da tabela: `docs/database-design.md`
