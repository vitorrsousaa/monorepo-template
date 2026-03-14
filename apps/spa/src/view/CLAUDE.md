# view

Documento compartilhado que explica **toda** a estrutura dentro de `view/`: componentes, layouts, páginas e router num só lugar.

## O que é

Camada de UI partilhada: páginas, layouts, componentes reutilizáveis e configuração de rotas. As páginas importam de `@/components`, `@/layouts` e de `@/modules/*/view`.

## Estrutura

```
view/
├── components/     # Componentes partilhados (não específicos de um único módulo)
├── layouts/       # Layouts que envolvem páginas (sidebar, cabeçalho)
├── pages/         # Páginas mapeadas a rotas (cada subpasta = segmento da URL)
├── router/        # Roteamento (router principal, auth guard, rotas por domínio)
└── App.tsx        # Componente raiz da aplicação
```

### components/

Componentes **partilhados** pela view — usados por páginas e layouts, não por um único módulo.

| Exemplo | Uso |
|---------|-----|
| `project-section-block` | Bloco de seção de projeto na listagem. |
| `task-row` | Linha de task em listas. |
| `loading-screen` | Estado de carregamento global. |

### layouts/

Layouts que envolvem páginas e definem a estrutura comum (sidebar, cabeçalho).

| Layout | Uso |
|--------|-----|
| **auth-layout** | Telas de login/signup (fora da área autenticada). |
| **app/** | Área autenticada: `dashboard-layout`, `todo-layout`, `projects-layout`, `goals-layout`, `user-layout`, `sidebar` (nav, listas de projetos, etc.). |

### pages/

Páginas mapeadas a rotas. Cada subpasta corresponde a um segmento da URL.

| Segmento | Conteúdo |
|----------|----------|
| **auth/** | signin, signup. |
| **app/** | todo (inbox, today, dashboard, upcoming), projects (all-projects, project/:id), goals/dashboard, settings, user (profile), support. |
| **not-found/** | 404. |

### router/

Configuração de roteamento.

| Ficheiro / pasta | Propósito |
|------------------|-----------|
| **browser.tsx** | Router principal (React Router). |
| **auth-guard.tsx** | Proteção de rotas (redireciona não autenticados). |
| **modules/** | Rotas agrupadas por domínio: auth, todo, projects, goals, user; `index.ts` agrega. |

## Referências

- Rotas: [../app/config/routes.ts](../app/config/routes.ts).
- Visão geral do SPA: [../CLAUDE.md](../CLAUDE.md).
