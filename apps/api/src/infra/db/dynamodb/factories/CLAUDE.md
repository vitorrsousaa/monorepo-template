# DynamoDB Repository Factories

Funções que montam e retornam as **implementações** dos repositórios de persistência, injetando mapper (e, quando aplicável, o client de banco). Quem consome essas factories (ex: factories de service em `src/factories/services/`) recebe sempre a **interface** (`I*Repository`), não a classe concreta.

## Papel na arquitetura

- **Camada:** Infraestrutura / composição.
- **Dependem de:** Mappers em `../mappers/<entity>/` e, no caso de User, do `makeDatabaseClient()` (client DynamoDB).
- **Consumidas por:** Factories de service em `src/factories/services/<domain>/<feature>.ts`, que passam o repositório para o construtor do service.

Fluxo típico: `make*Controller()` → `make*Service()` → **`make*DynamoRepository()`** → retorna `I*Repository`; o service depende apenas da interface.

## Estrutura da pasta

```
factories/
├── CLAUDE.md
├── client/
│   └── database-client-factory.ts   ← makeDatabaseClient() (usado por User e, no futuro, por outros)
├── todo-repository-factory.ts      ← makeTodoDynamoRepository()
├── project-repository-factory.ts   ← makeProjectDynamoRepository()
├── section-repository-factory.ts  ← makeSectionDynamoRepository()
└── user-repository-factory.ts      ← makeUserDynamoRepository() (usa makeDatabaseClient)
```

## Convenções

### Nomenclatura

- **Função:** `make{Entity}DynamoRepository` (ex: `makeTodoDynamoRepository`, `makeProjectDynamoRepository`).
- **Arquivo:** `{entity}-repository-factory.ts` (kebab-case).
- **Tipo de retorno:** Sempre a **interface** do protocolo (`ITodoRepository`, `IProjectRepository`, etc.), nunca a classe `*DynamoRepository`.

### O que cada factory faz

1. Instancia o mapper da entidade (`new *DynamoMapper()`).
2. Instancia o repositório passando o mapper (e, para User, o `IDatabaseClient` retornado por `makeDatabaseClient()`).
3. Retorna a instância tipada como a interface (`I*Repository`).

Exemplo (Todo/Project/Section — sem client por enquanto):

```ts
export function makeTodoDynamoRepository(): ITodoRepository {
  const mapper = new TodoDynamoMapper();
  return new TodoDynamoRepository(mapper);
}
```

Exemplo (User — com client):

```ts
export function makeUserDynamoRepository(): IUserRepository {
  const mapper = new UserDynamoMapper();
  const databaseClient = makeDatabaseClient();
  return new UserDynamoRepository(databaseClient, mapper);
}
```

### Client

- `makeDatabaseClient()` em `client/database-client-factory.ts` retorna `IDatabaseClient`. Hoje é usado pelo `UserDynamoRepository`; quando os outros repositórios migrarem para DynamoDB real, podem passar a receber o mesmo client (ou uma tabela específica) e usar `IDatabaseClient` em vez de arrays em memória.

## Regras para a IA

- Ao criar um novo repositório DynamoDB, criar a factory aqui que o instancia com o mapper correspondente e exporta pela interface.
- Não exportar a classe concreta do repositório a partir das factories; o restante do app deve depender apenas de `I*Repository`.
- Imports: interfaces de `@data/protocols`, mappers e repositórios de `@infra/db/dynamodb/...` (ou paths relativos consistentes com o projeto).
- Se um novo repositório precisar de `IDatabaseClient`, injetar via `makeDatabaseClient()` nesta factory, como em `user-repository-factory.ts`.

## Referências

- Repositórios: `src/infra/db/dynamodb/repositories/`
- Mappers: `src/infra/db/dynamodb/mappers/`
- Protocolos (interfaces): `src/data/protocols/`
- Uso das factories: `src/factories/services/` (cada feature que usa repositório chama a factory correspondente)
