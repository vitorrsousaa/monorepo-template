# Infrastructure Layer

Implementations of external services. Everything here depends only on `@data/protocols` (interfaces) and `@core/domain` (entities). The rest of the app never imports directly from this layer — factories in `src/factories/` and `src/infra/db/dynamodb/factories/` wire implementations to interfaces.

## Structure

```
infra/
├── auth/cognito/           ← Cognito auth provider + error types
│   ├── cognito-auth-provider.ts
│   ├── factories/cognito-auth-provider.ts
│   └── errors/             ← invalid-parameter, username-exists, etc.
│
└── db/dynamodb/            ← DynamoDB persistence
    ├── client/dynamo.ts    ← DynamoDB DocumentClient wrapper
    ├── contracts/          ← IDatabaseClient, BaseDynamoDBEntity
    ├── mappers/<entity>/   ← Domain ↔ DynamoDB conversion (PK/SK/GSI logic lives here)
    ├── repositories/<entity>/ ← Implements I*Repository using mapper
    └── factories/          ← make*DynamoRepository() — returns interface, not class
```

## Two types of mappers in this codebase

| Location | Purpose | Used by |
|----------|---------|---------|
| `infra/db/dynamodb/mappers/` | Domain ↔ DynamoDB entity (PK/SK, snake_case) | Repositories |
| `app/modules/<domain>/mappers/` | Domain ↔ DTO for HTTP response (contracts) | Controllers |

Never mix them. Infra mappers handle persistence format; module mappers handle wire format.

## Auth — Cognito

`CognitoAuthProvider` implements `IAuthProvider` from `@data/protocols/auth/auth-provider.ts`. Used by auth services (signup, signin). Factory: `infra/auth/cognito/factories/cognito-auth-provider.ts`.

Cognito-specific errors (in `errors/`) are caught by auth services and translated to `AppError`.

Presignup trigger: `src/server/functions/triggers/auth/presignup/handler.ts` — Cognito Lambda trigger, not an HTTP endpoint.

## DynamoDB — Detailed docs

- **Mappers**: see [db/dynamodb/mappers/CLAUDE.md](db/dynamodb/mappers/CLAUDE.md)
- **Repositories**: see [db/dynamodb/repositories/CLAUDE.md](db/dynamodb/repositories/CLAUDE.md)
- **Factories**: see [db/dynamodb/factories/CLAUDE.md](db/dynamodb/factories/CLAUDE.md)
- **Table design**: see [docs/database-design.md](../../../docs/database-design.md) (single-table, PK/SK pattern)
