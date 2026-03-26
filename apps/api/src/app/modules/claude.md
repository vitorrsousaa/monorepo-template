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

- **Regra:** service DTO é **interface TS pura** (sem Zod). O controller já validou com Zod; o service recebe dados tipados. Usar `import type` do `@repo/contracts` para derivar a interface (ex.: `extends CreateTaskInputDto`), adicionando campos internos como `userId`. Não importar schemas Zod no service. Ver [docs/schema-pattern.md](../../../../docs/schema-pattern.md).

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
│   │   ├── signup/          (controller + schema + index)
│   │   ├── signin/          (controller + schema + index)
│   │   └── account-info/    (controller + index)
│   ├── services/
│   │   ├── signup/          (service + dto + index)
│   │   ├── signin/          (service + dto + index)
│   │   └── account-info/    (service + dto + index)
│   └── errors/
│       └── user-not-found.ts
├── projects/
│   ├── controllers/
│   │   ├── create-project/
│   │   ├── get-all-projects-by-user/
│   │   ├── get-project-detail/
│   │   └── get-projects-summary/
│   ├── services/
│   │   ├── create-project/
│   │   ├── get-all-projects-by-user/
│   │   ├── get-project-detail/
│   │   └── get-projects-summary/
│   ├── mappers/
│   │   └── project-to-dto.ts
│   └── errors/
│       └── project-not-found.ts
├── sections/
│   ├── controllers/
│   │   ├── create-section/
│   │   └── get-all-by-project/
│   └── services/
│       ├── create-section/
│       └── get-all-by-project/
├── settings/
│   ├── controllers/
│   │   └── get-user-settings/
│   ├── services/
│   │   └── get-user-settings/
│   └── errors/
│       └── settings-not-found.ts
├── tasks/
│   ├── controllers/
│   │   ├── create/
│   │   ├── get-inbox-tasks/
│   │   ├── get-today-tasks/
│   │   ├── get-dashboard-analytics/
│   │   └── update-completion/
│   ├── services/
│   │   ├── create/
│   │   ├── get-inbox-tasks/
│   │   ├── get-today-tasks/
│   │   ├── get-dashboard-analytics/
│   │   ├── complete-task/
│   │   ├── uncomplete-task/
│   │   └── update-completion/
│   ├── mappers/
│   │   └── task-to-dto.ts
│   └── errors/
│       └── task-not-found.ts
├── todos/ (legacy)
│   ├── controllers/
│   │   └── get-todos/
│   ├── services/
│   │   └── get-todos/
│   └── mappers/
│       └── todo-to-dto.ts
└── claude.md
```

Para detalhes de imports, rotas public/private e uso de mappers, ver **`.cursor/rules/api-patterns.mdc`**.
