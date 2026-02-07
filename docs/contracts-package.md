# Pacote de Contracts (API Contract)

Este documento descreve a proposta e o desenho do pacote **contracts**: um pacote compartilhado no monorepo que concentra as **tipagens de input e output** das rotas da API, consumido tanto pelo **frontend (SPA)** quanto pela **API**. O objetivo é ter um único lugar que define o contrato entre cliente e servidor, garantindo type-safety e evitando divergência de tipos.

A validação (schemas Zod, etc.) permanece em cada aplicação; o pacote de contracts contém **apenas tipos** (interfaces e types TypeScript).

---

## 0. Abordagem escolhida: tipos manuais (sem OpenAPI/codegen)

- **Por que não OpenAPI + codegen agora?** Manter um spec OpenAPI atualizado e um pipeline de geração exige disciplina e tooling. Para um monorepo com uma API e um SPA controlados pelo mesmo time, um pacote de tipos manuais é mais simples, sem CLI nem passo de build extra para tipos. O contrato vive no código TypeScript que todos já usam.
- **Por que não tRPC?** tRPC é excelente para type-safety de ponta a ponta, mas exige que o backend exponha procedimentos tRPC. Como a API já é REST (Lambda + API Gateway), introduzir tRPC seria uma mudança arquitetural grande. O pacote de contracts atende o mesmo objetivo (um único contrato) com o stack atual.
- **Regra prática:** Começar com **tipos manuais em um pacote compartilhado**. Se no futuro surgirem consumidores externos, múltiplas frentes ou necessidade de documentação OpenAPI para ferramentas (Postman, SDKs), pode-se evoluir para **OpenAPI como fonte de verdade** e gerar tipos com `openapi-typescript` (ou similar) a partir do spec.

---

## 1. Objetivos

- **Fonte única de verdade** para o formato dos dados trafegados entre API e frontend.
- **Type-safety na integração**: quando a API mudar o contrato, o TypeScript quebra nos dois lados até o código ser ajustado.
- **Documentação viva**: os tipos servem como documentação do que cada rota espera e retorna.
- **Desacoplamento controlado**: API e SPA podem evoluir internamente, mas o contrato (superfície da API) é explícito e compartilhado.

---

## 2. Estrutura do pacote

Sugestão de estrutura em `packages/contracts/`:

```
packages/contracts/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # re-exporta tudo (ou por domínio)
│   ├── todos/
│   │   ├── index.ts
│   │   ├── get-inbox-todos.ts # request/response GET /todos/inbox
│   │   ├── create-todo.ts    # request/response POST /todos
│   │   └── types.ts          # DTOs compartilhados (TodoDto, etc.)
│   └── common/
│       └── index.ts          # tipos comuns (erro, paginação, etc.)
```

- **Por recurso/domínio**: `todos/`, `users/`, `projects/` — cada pasta agrupa os contratos das rotas daquele recurso.
- **Por rota**: um arquivo por “endpoint” (ex.: `get-inbox-todos.ts`, `create-todo.ts`) ou um único arquivo por recurso, conforme o tamanho.
- **DTOs compartilhados**: tipos reutilizados (ex.: `TodoDto`) em `types.ts` (ou `common/`) para não repetir em todo request/response.

---

## 3. Padrões de nomenclatura

### 3.1 Request (input da rota)

- **Padrão**: `{Resource}{Action}Request` ou `{Resource}{Action}Input`.
- **Exemplos**:
  - `GetInboxTodosRequest` — input da rota GET inbox (ex.: query params ou body, se houver).
  - `GetInboxTodosInput` — alternativa com “Input”.
  - `CreateTodoRequest` — body do POST de criação.
  - `UpdateTodoRequest` — body do PATCH/PUT.

Quando o input for apenas path/query e não tiver body, o tipo pode descrever só o que for relevante (ex.: `GetInboxTodosRequest` com `userId` se for enviado no contexto/header e tipado no front).

### 3.2 Response (output da rota)

- **Padrão**: `{Resource}{Action}Response`.
- **Exemplos**:
  - `GetInboxTodosResponse` — retorno de GET inbox (ex.: `{ todos: TodoDto[], total: number }`).
  - `CreateTodoResponse` — retorno do POST (ex.: o todo criado, `TodoDto`).
  - `UpdateTodoResponse` — retorno do PATCH/PUT.

### 3.3 DTOs (objetos trafegados)

- **Padrão**: `{Entity}Dto` para o formato exatamente como trafega na rede (serializado).
- **Exemplos**:
  - `TodoDto` — representação do todo no JSON (datas como string ISO, etc.).
  - `TodoListItemDto` — variante reduzida para listagens, se fizer sentido.

Regra prática: **Dto** = formato da API (ex.: `createdAt: string`); **Domain** (na API) pode usar `Date` internamente e converter para Dto na borda.

### 3.4 Erros e respostas comuns

- **Padrão**: `ApiError`, `ValidationErrorBody`, `PaginatedResponse<T>` (genérico), etc.
- Ex.: `PaginatedResponse<TodoDto>` para listas paginadas.

### 3.5 Resumo rápido

| Conceito        | Padrão                                 | Exemplo                      |
| --------------- | -------------------------------------- | ---------------------------- |
| Request/Input   | `{Resource}{Action}Request` ou `Input` | `CreateTodoRequest`          |
| Response/Output | `{Resource}{Action}Response`           | `GetInboxTodosResponse`      |
| Objeto na rede  | `{Entity}Dto`                          | `TodoDto`                    |
| Lista paginada  | `PaginatedResponse<T>`                 | `PaginatedResponse<TodoDto>` |

---

## 4. Exemplos de definição de tipos

### 4.1 TodoDto (objeto trafegado)

O `TodoDto` deve refletir exatamente o que a API envia na rede (formato serializado). Na API, o domínio pode usar `Date`; na borda converte-se para string ISO. Ao criar o pacote, alinhe os campos com o domínio atual da API (ex.: `core/domain/todo/todo.ts`) e com as respostas já implementadas.

```ts
// packages/contracts/src/todos/types.ts

/**
 * Todo as returned/sent by the API (serialized format).
 * Dates are ISO strings over the wire.
 */
export interface TodoDto {
  id: string;
  userId: string;
  projectId: string | null;
  sectionId: string | null;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  order?: number;
  completedAt: string | null; // ISO 8601
  dueDate: string | null; // ISO 8601
  priority: "low" | "medium" | "high" | null;
}
```

### 4.2 Get Inbox Todos

```ts
// packages/contracts/src/todos/get-inbox-todos.ts

import type { TodoDto } from "./types";

/** Input for GET /todos/inbox (e.g. from context/headers; no body). */
export interface GetInboxTodosRequest {
  userId: string;
}

/** Response body of GET /todos/inbox */
export interface GetInboxTodosResponse {
  todos: TodoDto[];
  total: number;
}
```

### 4.3 Create Todo

```ts
// packages/contracts/src/todos/create-todo.ts

import type { TodoDto } from "./types";

/** Request body for POST /todos */
export interface CreateTodoRequest {
  title: string;
  description: string;
  projectId: string | null;
  completed?: boolean;
  order?: number;
}

/** Response body of POST /todos (created todo) */
export type CreateTodoResponse = TodoDto;
```

### 4.4 Exports do módulo todos

```ts
// packages/contracts/src/todos/index.ts

export type { TodoDto } from "./types";
export type {
  GetInboxTodosRequest,
  GetInboxTodosResponse,
} from "./get-inbox-todos";
export type { CreateTodoRequest, CreateTodoResponse } from "./create-todo";
```

---

## 5. Uso na API

- Os **controllers** (ou serviços de borda) garantem que o que retornam está em conformidade com os tipos do contracts (ex.: `GetInboxTodosResponse`).
- A API **não** precisa importar contracts em todos os módulos internos: apenas na borda (handler/controller) ao montar a resposta. Os serviços internos podem continuar usando o domain (ex.: `Todo` com `Date`); na saída, converta domain → DTO e use o tipo do contracts para tipar o body.

Exemplo (conceitual):

```ts
// apps/api - controller ou handler
import type { GetInboxTodosResponse } from "@repo/contracts/todos";

// Ao montar a resposta:
const result: GetInboxTodosResponse = {
  todos: todos.map(domainToDto),
  total: todos.length,
};
return { statusCode: 200, body: result };
```

Assim a API “promete” o formato definido no contracts.

---

## 6. Uso no frontend (SPA)

- Os **serviços de API** (ex.: `get-inbox.ts`) usam os tipos do contracts para tipar a resposta (e o body, em POST/PUT).

Exemplo:

```ts
// apps/spa - get-inbox.ts
import { httpClient } from "@/services/http-client";
import type { GetInboxTodosResponse } from "@repo/contracts/todos";

const INBOX_PATH = "/todos/inbox";

export async function getInboxTodos(): Promise<GetInboxTodosResponse> {
  const { data } = await httpClient.get<GetInboxTodosResponse>(INBOX_PATH);
  return data;
}
```

- **Hooks** (ex.: `use-get-inbox-todos.ts`) passam a receber tipos derivados do contracts (ex.: `GetInboxTodosResponse`), e a UI usa `data.todos` e `data.total` com type-safety.
- Se quiser, as **rotas** (paths) podem ser constantes em um único lugar (no contracts ou em um módulo de API do SPA) e importadas no serviço — assim o path fica acoplado em um só lugar.

---

## 7. Rotas (paths) e métodos HTTP

- **Onde colocar**: pode ficar no próprio pacote de contracts (ex.: `routes.ts` ou junto aos arquivos de contrato) ou em um módulo do SPA (ex.: `api/routes.ts`). O importante é evitar strings soltas em vários arquivos.
- **Exemplo no contracts**:

```ts
// packages/contracts/src/todos/routes.ts

export const TODOS_ROUTES = {
  INBOX: "/todos/inbox",
  CREATE: "/todos",
  BY_ID: (id: string) => `/todos/${id}`,
} as const;
```

- No SPA: `import { TODOS_ROUTES } from "@repo/contracts/todos";` e usar `httpClient.get(TODOS_ROUTES.INBOX)`.

---

## 8. Boas práticas (como grandes empresas fazem)

- **Single source of truth:** O contrato vive em um único pacote; API e SPA não definem tipos duplicados para request/response. Empresas como Porter e muitos monorepos usam um pacote `api-contracts` ou `shared-types` para isso.
- **DTO na rede, domain na aplicação:** Na API, o domínio pode usar `Date` e entidades ricas; na borda (controller/handler) converte-se para DTO (ex.: datas como string ISO) e tipa-se com os tipos do contracts. O SPA recebe o DTO e, se precisar, mapeia para um modelo de UI.
- **Validação na borda:** Schemas Zod (ou outro) ficam na API e, se necessário, no SPA; o contracts não depende de runtime de validação. Assim o pacote continua leve e sem dependências desnecessárias.
- **Rotas como constantes:** Ter paths (ex.: `/todos/inbox`) em um único lugar (no contracts ou no SPA) evita strings soltas e facilita refatoração.
- **Exports por domínio:** Permitir `@repo/contracts/todos` em vez de importar tudo de `@repo/contracts` reduz bundle e deixa as dependências explícitas.

---

## 9. Build e consumo do pacote

- **Opção A (recomendada para simplicidade):** O pacote expõe apenas source TypeScript (`main`/`types`/`exports` apontando para `./src/...`). O build do consumidor (API, SPA) resolve os tipos via workspace. Nenhum passo de build no pacote de contracts; igual ao que muitos monorepos fazem para pacotes só de tipos.
- **Opção B:** Se no futuro for necessário distribuir o pacote fora do monorepo ou usar em contextos que não resolvem source, pode-se adicionar um build (ex.: `tsup` só para emitir `.d.ts` e eventualmente `.js`) e publicar a pasta `dist`. Para uso interno no monorepo, a opção A costuma ser suficiente.
- **Consumidores:** `apps/api` e `apps/spa` listam `"@repo/contracts": "workspace:*"` em `dependencies` e importam `@repo/contracts` ou `@repo/contracts/todos` conforme os `exports` do `package.json`.

---

## 10. Fluxo de trabalho

1. **Alterar contrato:** Editar tipos em `packages/contracts` (ex.: novo campo em `TodoDto` ou novo endpoint em `todos/`).
2. **API:** Ajustar controller/serviço para retornar (ou aceitar) o novo formato; manter conversão domain → DTO na borda e tipar com os tipos do contracts.
3. **SPA:** Ajustar serviços e hooks para usar os novos tipos; o TypeScript aponta erros onde o código ainda espera o formato antigo.
4. **Validação:** Atualizar schemas Zod (ou equivalente) na API (e no SPA se houver) para refletir as mesmas regras; os tipos do contracts servem de referência, não substituem a validação em runtime.

---

## 11. Dependências do pacote

- O pacote deve ter **apenas TypeScript** (e talvez um build para emitir `.d.ts` se necessário). **Sem** Zod nem runtime de validação.
- **package.json** mínimo (exemplo), com **Opção A** (apenas source):

```json
{
  "name": "@repo/contracts",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./todos": "./src/todos/index.ts",
    "./common": "./src/common/index.ts"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "~5.9.3"
  }
}
```

- **Consumidores:** `apps/api` e `apps/spa` listam `@repo/contracts` com `workspace:*` em `dependencies` e usam os paths de export (ex.: `@repo/contracts`, `@repo/contracts/todos`).

---

## 12. Resumo

| Item                      | Decisão                                                                           |
| ------------------------- | --------------------------------------------------------------------------------- |
| O que fica no contracts   | Apenas **tipagens** (request/response e DTOs). Sem schemas de validação.          |
| Validação (Zod, etc.)     | Fica na API (e no SPA se precisar), usando os tipos do contracts como referência. |
| Nomenclatura request      | `{Resource}{Action}Request` ou `Input`                                            |
| Nomenclatura response     | `{Resource}{Action}Response`                                                      |
| Objetos na rede           | `{Entity}Dto`                                                                     |
| Estrutura                 | Por recurso (todos/, users/, …), com tipos por rota e DTOs compartilhados.         |
| Rotas (paths)             | Opcional no contracts (ou no SPA); constante única por rota.                      |
| Build                     | Opção A: apenas source; consumidores resolvem pelo workspace.                    |
| Quando evoluir para spec  | Consumidores externos, múltiplas frentes ou necessidade de OpenAPI/SDKs.         |

Com isso, o pacote de contracts concentra a definição do contrato entre front e API, e ambos consomem do mesmo lugar, com exemplos claros de uso e padrões de nomenclatura.
