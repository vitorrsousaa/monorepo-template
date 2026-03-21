# projects pages

Páginas relacionadas ao domínio de projetos.

## Estrutura de arquivos

```
projects/
├── all-projects/                     ← Lista de todos os projetos do usuário
│   ├── all-projects.tsx              ← Componente principal (usa useGetProjectsSummary)
│   ├── all-projects-skeleton.tsx     ← Grid skeleton de loading
│   ├── all-projects-empty-state.tsx  ← Estado vazio (sem projetos / sem resultados de busca)
│   └── all-projects-error-state.tsx  ← Estado de erro com botão retry
└── project/                          ← Detalhe de um projeto específico
```

## Hook usado

`useGetProjectsSummary` — em `@/modules/projects/app/hooks/use-get-projects-summary`.

Retorna `ProjectSummary[]` do contracts (`@repo/contracts/projects/summary`):
- `id`, `name`, `description`, `color`
- `completedCount`, `totalCount`, `percentageCompleted` — calculados pela API

## Lógica de status derivado

Não existe campo `status` no `ProjectSummary`. O status é **derivado** em runtime:

```ts
function deriveStatus(project: ProjectSummary): "ativo" | "concluido" {
  if (project.totalCount > 0 && project.completedCount === project.totalCount) {
    return "concluido";
  }
  return "ativo"; // zero tasks OU tasks pendentes
}
```

**Sem status "arquivado"** — removido do escopo. Apenas `ativo` e `concluido`.

## Filtros disponíveis

| Tab | Lógica |
|-----|--------|
| Todos | sem filtro de status |
| Ativos | `status === "ativo"` |
| Concluídos | `status === "concluido"` |

Busca por nome (`search`) + filtro de status são combinados com `&&`.

## Convenções do card

- Sem `emoji` (não existe no `ProjectSummary`) — usa **primeira letra** do nome em badge colorido
- Sem `deadline` (não existe no `ProjectSummary`) — linha removida
- Progresso vem diretamente de `percentageCompleted`, `completedCount`, `totalCount` da API

## Renderização condicional

Usa `RenderIf` (não `&&` nem ternários):

```tsx
<RenderIf condition={isFetchingProjectsSummary} render={<AllProjectsSkeleton />} />
<RenderIf condition={isErrorProjectsSummary} render={<AllProjectsErrorState onRetry={...} />} />
<RenderIf condition={showEmpty} render={<AllProjectsEmptyState ... />} />
<RenderIf condition={showList} render={<Grid ... />} />
```
