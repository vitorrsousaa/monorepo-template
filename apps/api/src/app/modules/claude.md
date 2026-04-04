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
- **4 arquivos obrigatórios:**
  - `service.ts` — regra de negócio e acesso a repositórios.
  - `dto.ts` — interfaces TS puras de input/output.
  - `index.ts` — barrel export.
  - `service.test.ts` — testes unitários co-localizados.

**Canonical example:** `tasks/services/create/` — use como referência para novos services.

### Interface exposure (obrigatório)

Todo service DEVE exportar uma interface `IXService extends IService<Input, Output>`. Controllers dependem da interface, nunca da classe concreta.

```ts
// ✅ correct — exports interface, controller depends on ICreateTasksService
import type { IService } from "@application/interfaces/service";

export interface ICreateTasksService
  extends IService<CreateTasksInputService, CreateTasksOutputService> {}

export class CreateTasksService implements ICreateTasksService {
  constructor(private readonly taskRepository: ITasksRepository) {}

  async execute(input: CreateTasksInputService): Promise<CreateTasksOutputService> {
    const task = await this.taskRepository.create({ ... });
    return { task };
  }
}
```

```ts
// ❌ wrong — no interface exported, controller depends on concrete class
export class CreateTasksService {
  constructor(private readonly taskRepository: ITasksRepository) {}

  async execute(input: CreateTasksInputService): Promise<CreateTasksOutputService> {
    const task = await this.taskRepository.create({ ... });
    return { task };
  }
}
```

### DTO pattern

Service DTO é **interface TS pura** (sem Zod). O controller já validou com Zod; o service recebe dados tipados. `InputService` extends tipo do `@repo/contracts` + adiciona `userId`. `OutputService` é um typed object simples. Ver [docs/schema-pattern.md](../../../../docs/schema-pattern.md).

```ts
// ✅ correct — extends contracts type, adds userId, output is typed object
import type { Task } from "@repo/contracts/tasks";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";

export interface CreateTasksInputService extends CreateTaskInput {
  userId: string;
}

export interface CreateTasksOutputService {
  task: Task;
}
```

```ts
// ❌ wrong — inline types, no contracts reuse, Zod in service layer
import { z } from "zod";

export const createTaskSchema = z.object({
  userId: z.string(),
  title: z.string(),
});

export type CreateTasksInputService = z.infer<typeof createTaskSchema>;
export type CreateTasksOutputService = { task: any };
```

### Barrel export

```ts
// ✅ correct — services/<feature>/index.ts
export * from "./dto";
export * from "./service";
```

```ts
// ❌ wrong — missing dto export or exporting internals
export * from "./service";
// dto not exported — consumers can't import types
```

### Test co-location

Testes ficam ao lado do service (`service.test.ts`). Usar builders/mocks de `@test/`, naming `sut`, e `vi.clearAllMocks()`.

```ts
// ✅ correct — co-located, uses builders/mocks, sut naming, clearAllMocks
import { buildTask } from "@test/builders";
import { mockTasksRepository } from "@test/mocks";
import { CreateTasksService } from "./service";

describe("CreateTasksService", () => {
  const repo = mockTasksRepository();
  const sut = new CreateTasksService(repo);

  beforeEach(() => { vi.clearAllMocks(); });

  it("should create task", async () => {
    vi.mocked(repo.create).mockResolvedValue(buildTask());
    const result = await sut.execute({ userId: "u-1", title: "Test" });
    expect(result.task).toBeDefined();
  });
});
```

```ts
// ❌ wrong — manual mock creation, no builders, no sut naming
import { CreateTasksService } from "./service";

describe("CreateTasksService", () => {
  it("should create task", async () => {
    const repo = { create: jest.fn().mockResolvedValue({ id: "1", title: "Test" }) };
    const service = new CreateTasksService(repo as any);
    const result = await service.execute({ userId: "u-1", title: "Test" });
    expect(result.task).toBeDefined();
  });
});
```

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
