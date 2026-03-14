# Modules — Estrutura e convenções

Fonte única para “o que fica em cada subpasta de `modules/`” e convenção de **uma pasta por feature** com `index.ts` exportando tudo.

## Visão geral

`modules/` agrupa por **domínio** (auth, projects, tasks, etc.). Dentro de cada módulo, subpastas por responsabilidade: `controllers/`, `services/`, e opcionalmente `mappers/` e `errors/`.

## controllers/

- **Uma pasta por feature** (ex.: `signup`, `get-all-projects-by-user`).
- **Arquivos:**
  - `controller.ts` — orquestra request → validação (schema) → service → resposta.
  - `schema.ts` — Zod para body; pode reutilizar DTO do service.
  - `index.ts` — **obrigatório**: exporta controller e schema.

```ts
// controllers/<feature>/index.ts
export * from "./controller";
export * from "./schema";
```

- Em rotas que devolvem entidades de domínio, o controller usa **mappers** do módulo para converter saída do service para DTO do contrato (`@repo/contracts`).

## services/

- **Uma pasta por feature**, espelhando o controller.
- **Arquivos:**
  - `service.ts` — regra de negócio e acesso a repositórios.
  - `dto.ts` — Zod + tipos de input/output (SignupInput, SignupOutput, etc.).
  - `index.ts` — **obrigatório**: exporta service e dto.

```ts
// services/<feature>/index.ts
export * from "./dto";
export * from "./service";
```

- **Regra:** não importar `@repo/contracts` no service; contratos são da camada HTTP. O service trabalha com tipos internos (dto.ts do módulo).

## mappers/ (opcional por módulo)

- Fica no **nível do módulo**, não dentro de um controller.
- **Arquivos:** `{entity}-to-dto.ts` — convertem saída de domínio (ex.: `Date`) para DTO do contrato (ex.: ISO string).
- Usados nos controllers quando a resposta do service não está no formato do contrato.

Exemplo: `projects/mappers/project-to-dto.ts`, `tasks/mappers/task-to-dto.ts`.

## errors/ (opcional por módulo)

- Erros específicos do domínio (ex.: `ProjectNotFound`).
- Usados por services e controllers do mesmo módulo.

Exemplo: `projects/errors/project-not-found.ts`.

---

## Exemplo de árvore atual

```
modules/
├── auth/
│   ├── controllers/
│   │   └── signup/
│   │       ├── controller.ts
│   │       ├── schema.ts
│   │       └── index.ts
│   └── services/
│       └── signup/
│           ├── service.ts
│           ├── dto.ts
│           └── index.ts
├── projects/
│   ├── controllers/
│   │   └── get-all-projects-by-user/
│   │       ├── controller.ts
│   │       ├── schema.ts
│   │       └── index.ts
│   ├── services/
│   │   └── get-all-projects-by-user/
│   │       ├── service.ts
│   │       ├── dto.ts
│   │       └── index.ts
│   ├── mappers/
│   │   └── project-to-dto.ts
│   └── errors/
│       └── project-not-found.ts
├── tasks/
│   ├── controllers/
│   ├── services/
│   └── mappers/
│       └── task-to-dto.ts
└── claude.md
```

Para detalhes de imports, rotas public/private e uso de mappers, ver **`.cursor/rules/api-patterns.mdc`**.
