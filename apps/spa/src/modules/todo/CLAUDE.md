# todo module — Claude Context

Today page kanban: groups tasks by project, renders columns and task cards.

## Column color accent

Each column renders a 3px top bar using `project.color` (hex string from the API). Inbox receives `#8A8782` (gray) from the API — no hardcoded client-side color for Inbox.

```tsx
<div
  className="h-[3px] w-full flex-shrink-0"
  style={{ background: project.color }}
  aria-hidden
/>
```

Color origin: `GetTodayTasksService` sets `color` on each `TodayProjectOutput`, sourced from DynamoDB `project.color` (or the Inbox constant). Propagates through `TodayProjectDto` in `@repo/contracts/tasks/today`.

## Priority stripe utility

Task cards show a left stripe based on **priority**, not project. Use `getPriorityStripeColor` from `@/utils/priority`:

```ts
import { getPriorityStripeColor } from "@/utils/priority";

const stripeColor = getPriorityStripeColor(task.priority);
// null when priority is null — no stripe rendered
```

Mapping:
- `"high"` → `bg-red-500`
- `"medium"` → `bg-amber-500`
- `"low"` → `bg-primary/70`
- `null` → `null` (stripe not rendered)

File: `apps/spa/src/app/utils/priority.ts`

## Key files

- `view/components/project-column/project-column.tsx` — column + task card rendering
- `view/components/project-column-header/` — column header (name, actions)
