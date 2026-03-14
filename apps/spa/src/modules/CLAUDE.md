# modules

Documento compartilhado para **todos os módulos**. Explica a estrutura genérica dentro de `modules/` (não amarrada a um módulo específico).

## O que é

Parte da aplicação organizada por **módulos** (feature-sliced). Cada módulo é uma fatia de funcionalidade: **auth**, **goals**, **projects**, **sections**, **settings**, **todo**.

## Estrutura dentro de qualquer módulo

```
<module>/
├── app/                    # Camada de aplicação/domínio (regras, dados, API)
│   ├── entities/           # Tipos e modelos de domínio
│   ├── hooks/              # Hooks (React Query, estado)
│   └── services/           # Chamadas à API via httpClient
└── view/                   # Camada de apresentação (UI)
    ├── components/         # Componentes de UI do fluxo
    ├── forms/              # Formulários reutilizáveis (schema, hook, componente)
    └── modals/             # Modais (geralmente envolvem um form em Dialog)
```

### app/

| Subpasta | Propósito |
|----------|-----------|
| **entities/** | Tipos e modelos de domínio (ex.: `Todo`, `Project`, `Section`). Podem existir DTOs de criação (ex.: `CreateProjectInput`). |
| **hooks/** | Hooks que encapsulam React Query e estado (ex.: `useGetInboxTodos`, `useGetAllProjectsByUser`). Usam `@/config/query-keys` e os services do próprio módulo. |
| **services/** | Funções que chamam a API via `httpClient` (ex.: `getInboxTodos`, `createProject`). Retornam dados para os hooks. |

### view/

| Subpasta | Propósito |
|----------|-----------|
| **components/** | Componentes de UI específicos do fluxo (cartões, listas, colunas, botões, etc.). |
| **forms/** | Formulários reutilizáveis, geralmente com schema (Zod), hook de submit e componente; usados por modais e páginas. |
| **modals/** | Modais que envolvem conteúdo (frequentemente um form) em `Dialog`. |

## Exceção: módulo auth

O módulo **auth** não segue exatamente a divisão `app/` + `view/`. Usa **forms/** na raiz do módulo (signin, signup), cada um com schema e hook por form.

## Referências

- Convenção de estrutura de módulo: [.cursor/rules/project-standards.mdc](../../.cursor/rules/project-standards.mdc) (Module Structure).
- Visão geral do SPA: [../CLAUDE.md](../CLAUDE.md).
- Rotas e query keys: `@/config/routes`, `@/config/query-keys`.
