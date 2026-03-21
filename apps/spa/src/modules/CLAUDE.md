# modules

Documento compartilhado para **todos os módulos**. Explica a estrutura genérica dentro de `modules/` (não amarrada a um módulo específico).

## O que é

Parte da aplicação organizada por **módulos** (feature-sliced). Cada módulo é uma fatia de funcionalidade: **auth**, **goals**, **projects**, **sections**, **settings**, **todo**.

## Estrutura dentro de qualquer módulo

```
<module>/
├── app/                    # Camada de aplicação/domínio (regras, dados, API)
│   ├── entities/           # Tipos e modelos de domínio
│   ├── cache/              # Cache helpers (optimistic updates por query key)
│   ├── hooks/              # Hooks (React Query, estado)
│   ├── services/           # Chamadas à API via httpClient
│   └── mappers/            # Conversão de dados (form → API input, etc.)
└── view/                   # Camada de apresentação (UI)
    ├── components/         # Componentes de UI do fluxo
    ├── forms/              # Formulários reutilizáveis (schema, hook, componente)
    └── modals/             # Modais (geralmente envolvem um form em Dialog)
```

### app/

| Subpasta | Propósito |
|----------|-----------|
| **cache/** | Cache helpers tipados para optimistic updates. Um arquivo por query key. Ver [padrão de cache](#padrão-de-cache). |
| **entities/** | Tipos e modelos de domínio (ex.: `Todo`, `Project`, `Section`). Podem existir DTOs de criação (ex.: `CreateProjectInput`). |
| **hooks/** | Hooks que encapsulam React Query e estado (ex.: `useGetInboxTodos`, `useGetAllProjectsByUser`). Usam `@/config/query-keys` e os services do próprio módulo. |
| **services/** | Funções que chamam a API via `httpClient` (ex.: `getInboxTodos`, `createProject`). Retornam dados para os hooks. |
| **mappers/** | Conversão de dados entre camadas (ex: form schema → API input). Ver [padrão de mappers](#padrão-de-mappers). |

### view/

| Subpasta | Propósito |
|----------|-----------|
| **components/** | Componentes de UI específicos do fluxo (cartões, listas, colunas, botões, etc.). |
| **forms/** | Formulários reutilizáveis, geralmente com schema (Zod), hook de submit e componente; usados por modais e páginas. Form schemas importam **constantes de validação do `@repo/contracts`** (ex.: `TASK_TITLE_MAX`) para manter min/max em sincronia com a API. Ver [docs/schema-pattern.md](../../../../../docs/schema-pattern.md). |
| **modals/** | Modais que envolvem conteúdo (frequentemente um form) em `Dialog`. |

## Padrão de Cache

Cache helpers encapsulam manipulação tipada do `queryClient` para optimistic updates. Evitam boilerplate repetitivo de `queryClient.setQueryData<Type>(QUERY_KEYS.X, ...)` nos hooks de mutação.

### Estrutura

```
<module>/app/cache/
  <cache-name>.cache.ts      ← Um arquivo por query key
  index.ts                    ← Barrel export
```

### Padrão de Implementação

**Nomenclatura:** `<cacheName>Cache(queryClient)` — factory que recebe `QueryClient` e retorna métodos tipados.

**Métodos padrão:**

| Método | Propósito |
|--------|-----------|
| `get()` | Lê o cache (retorna `[]` se vazio) |
| `addOptimistic(tempId, data)` | Insere item com `OptimisticState.PENDING` |
| `markError(tempId)` | Marca item como `OptimisticState.ERROR` |
| `replaceWithReal(tempId, realEntity)` | Substitui item otimista pelo dado real do servidor |
| `remove(id)` | Remove item do cache |

**Cada arquivo é concreto** — embute defaults de domínio (ex.: `completedCount: 0` para summary de projeto novo), não é genérico.

### Exemplo de Uso (em hook de mutação)

```typescript
const allCache = projectsAllCache(queryClient);
const summaryCache = projectsSummaryCache(queryClient);

// onMutate
await cancelRelatedQueries(queryClient, RELATED_KEYS);
allCache.addOptimistic(tempId, data);
summaryCache.addOptimistic(tempId, data);

// onError
allCache.markError(context!.tempId);
summaryCache.markError(context!.tempId);

// onSuccess
allCache.replaceWithReal(context!.tempId, project);
summaryCache.replaceWithReal(context!.tempId, project);
```

### Referência

- Implementação: `projects/app/cache/` (projects-all, projects-summary)
- Tipos de suporte: `@/utils/types` (`WithOptimisticState`, `OptimisticState`)
- Utilitários: `@/utils/optimistic` (`cancelRelatedQueries`, `generateTempId`)

## Padrão de Mappers

Mappers convertem dados entre diferentes formatos/camadas. Caso mais comum: **form schema (UI) → API input HTTP**.

### Estrutura

```
<module>/app/mappers/
  <feature>-mappers.ts      ← Arquivo único com todas as conversões da feature
  MAPPER_PATTERN.md         ← Documentação do padrão
```

### Padrão de Implementação

**Nomenclatura:** `map<Origin>To<Target>` (ex: `mapTaskFormToCreateInput`)

**Estrutura:** Função pura que recebe dados tipados e retorna resultado tipado

```typescript
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import type { TTaskFormSchema } from "../../view/forms/task/task-form.schema";

/**
 * Maps task form schema (from UI) to API request input.
 *
 * Transformations:
 * - `project` → `projectId` (API field naming)
 * - `priority: "none"` → `null` (API expects null for no priority)
 * - `dueDate: Date` → ISO string (API expects ISO 8601 format)
 * - Omits: id, completed, goal, recurrence (not used by API)
 */
export function mapTaskFormToCreateInput(formData: TTaskFormSchema): CreateTaskInput {
	return {
		title: formData.title,
		description: formData.description || null,
		projectId: formData.project === "inbox" ? null : formData.project,
		sectionId: formData.section === "none" ? null : formData.section,
		priority: formData.priority === "none" ? null : formData.priority,
		dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
	};
}
```

### Padrões Comuns

| Caso | Exemplo |
|------|---------|
| **Renomeação de campo** | `project` → `projectId` |
| **Conversão de tipo** | `Date` → ISO string via `.toISOString()` |
| **Valor especial → null** | `priority: "none"` → `null` |
| **String vazia → null** | `description: value \|\| null` |
| **Filtrar campos** | Omitir campos não usados pela API |

### Checklist de Implementação

- [ ] Função com nome descritivo (`map<Origin>To<Target>`)
- [ ] JSDoc explicando transformações aplicadas
- [ ] Entrada e saída com tipos explícitos
- [ ] Cada campo mapeado intencionalmente (não destructuring cego)
- [ ] Transformações documentadas:
  - Renomeações de campo
  - Conversões de tipo
  - Valores especiais
  - Filtros (campos omitidos)
- [ ] Null/undefined handling consistente
- [ ] Função pura (sem side effects)

### Uso

Tipicamente chamado em hooks de submit ou componentes de modal:

```typescript
// No formulário ou modal
const handleSubmit = async (formData: TTaskFormSchema) => {
	const taskInput = mapTaskFormToCreateInput(formData);
	await createTasks(taskInput);
};
```

### Referência Completa

Ver [`tasks/app/mappers/MAPPER_PATTERN.md`](./tasks/app/mappers/MAPPER_PATTERN.md) para padrão detalhado com mais exemplos.

## Exceção: módulo auth

O módulo **auth** não segue exatamente a divisão `app/` + `view/`. Usa **forms/** na raiz do módulo (signin, signup), cada um com schema e hook por form.

## Referências

- Convenção de estrutura de módulo: [.cursor/rules/project-standards.mdc](../../.cursor/rules/project-standards.mdc) (Module Structure).
- Padrão de mappers (form → API): [`tasks/app/mappers/MAPPER_PATTERN.md`](./tasks/app/mappers/MAPPER_PATTERN.md).
- Visão geral do SPA: [../CLAUDE.md](../CLAUDE.md).
- Rotas e query keys: `@/config/routes`, `@/config/query-keys`.
- Schema pattern (Zod + constantes): [docs/schema-pattern.md](../../../../../docs/schema-pattern.md).
