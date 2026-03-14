# Task Form & Modal Redesign Plan

## Context

The current task form (`TodoForm`) and its modal wrappers (`NewTodoModal`, `EditTodoModal`) need a visual and structural redesign to match a new HTML mockup provided by the user. The mockup features a polished two-column layout with:
- Icon-button header actions (duplicate, delete, close) instead of a dropdown menu
- A recurrence section with toggle + expandable configuration panel
- A goal field in the sidebar
- Cleaner, more compact select styling
- A checkbox for task completion in the title row
- Footer with mode hint + action buttons

**Separate modals** for new vs edit (no View/Edit toggle).

---

## Phase 1: UI Library Changes (`packages/ui`)

### 1.1 Add RadioGroup component

**Create:** `packages/ui/src/components/radio-group.tsx`

- Install `@radix-ui/react-radio-group` in `packages/ui/package.json`
- Standard shadcn RadioGroup + RadioGroupItem pattern
- Needed for the recurrence "Ends" options (Never / On date / After)

### 1.2 Update Select — add `variant="compact"` to SelectTrigger

**Modify:** `packages/ui/src/components/select.tsx`

Add a `variant` prop to `SelectTrigger`: `"default" | "compact"`

- `default` = current behavior (no breaking changes)
- `compact` variant:
  - `h-[30px]` height
  - `rounded-lg` (8px radius)
  - `bg-muted/50` background
  - `text-[11px]` font size
  - Smaller padding `px-2.5 py-1`
  - Matches the HTML mockup's sidebar select style

### 1.3 Add `hideDefaultClose` prop to DialogContent

**Modify:** `packages/ui/src/components/dialog.tsx`

Add `hideDefaultClose?: boolean` to `DialogContent` props interface. When `true`, skip rendering the built-in `<DialogPrimitive.Close>` X button. Default: `false` (backward compatible).

```typescript
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  hideDefaultClose?: boolean;
}
```

### 1.4 Export RadioGroup from package

**Modify:** `packages/ui/package.json` — add radio-group to exports if needed (wildcard `"./*"` should cover it already).

---

## Phase 2: Schema & Types Updates

### 2.1 Extend form schema

**Modify:** `apps/spa/src/modules/todo/view/forms/todo/todo-form.schema.ts`

Add fields:
```typescript
completed: z.boolean().optional(),
goal: z.string().optional(),
recurrence: z.object({
  enabled: z.boolean(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  weeklyDays: z.array(z.number().min(0).max(6)).optional(), // 0=Sun..6=Sat
  endType: z.enum(["never", "on_date", "after_count"]).optional(),
  endDate: z.date().optional(),
  endCount: z.number().positive().optional(),
}).optional(),
```

Update `defaultInitialValues`:
```typescript
completed: false,
goal: undefined,
recurrence: { enabled: false },
```

### 2.2 Update TodoFormProps

**Modify:** `apps/spa/src/modules/todo/view/forms/todo/todo-form.tsx`

```typescript
export interface TodoFormProps {
  onCancel?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  initialValues?: Partial<TTodoFormSchema>;
  mode: "create" | "edit";
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
  };
}
```

`mode` is now an explicit prop rather than inferred from `initialValues?.id`.

---

## Phase 3: Goals Data Layer (Stub)

### 3.1 Add goals query key

**Modify:** `apps/spa/src/app/config/query-keys.ts`

```typescript
GOALS: { ALL: ["goals", "all"] }
```

### 3.2 Create goals service stub

**Create:** `apps/spa/src/modules/goals/app/services/get-all-goals.ts`

Returns mock `Goal[]` data (consistent with the mocked-repo pattern used elsewhere).

### 3.3 Create goals query hook

**Create:** `apps/spa/src/modules/goals/app/hooks/use-get-all-goals.ts`

Same pattern as `useGetAllProjectsByUser`:
```typescript
export function useGetAllGoals() {
  const { data, isError, isFetching, isPending, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.GOALS.ALL,
    queryFn: getAllGoals,
  });
  return {
    goals: data || [],
    isErrorGoals: isError,
    isFetchingGoals: isFetching || isPending || isLoading,
    refetchGoals: refetch,
  };
}
```

---

## Phase 4: Recurrence Panel Component

### 4.1 Create recurrence preview formatter

**Create:** `apps/spa/src/modules/todo/view/forms/todo/format-recurrence-preview.ts`

Pure function that takes recurrence form values and returns a human-readable string:
- `"Repeats every day"`
- `"Repeats every week on Mon, Wed, Fri"`
- `"Repeats every month · until Dec 31, 2026"`
- `"Repeats every year · 10 times"`

### 4.2 Create recurrence panel component

**Create:** `apps/spa/src/modules/todo/view/forms/todo/recurrence-panel.tsx`

Structure:
```
┌──────────────────────────────────────────────┐
│ 🔄 Repeat                         [Switch]  │
├──────────────────────────────────────────────┤
│ (Collapsible, visible when enabled)          │
│                                              │
│ FREQUENCY                                    │
│ [Daily] [Weekly] [Monthly] [Yearly]  (chips) │
│                                              │
│ ON DAYS (only for Weekly)                    │
│ (Su) (Mo) (Tu) (We) (Th) (Fr) (Sa)          │
│                                              │
│ ENDS                                         │
│ ○ Never  ○ On date  ○ After                  │
│ [DatePicker or NumberInput conditionally]     │
│                                              │
│ Preview pill: "Every week on Mon, Wed"       │
└──────────────────────────────────────────────┘
```

Components used:
- `Switch` from `@repo/ui/switch` — toggle
- `Collapsible` from `@repo/ui/collapsible` — expand/collapse
- `RadioGroup` + `RadioGroupItem` from `@repo/ui/radio-group` — end options
- `DatePicker` from `@repo/ui/date-picker` — end date
- `Input` from `@repo/ui/input` — end count
- Custom chip buttons styled with `cn()` — frequency + day selectors

Receives `control` from react-hook-form as prop for field binding.

---

## Phase 5: Main Form Rewrite

### 5.1 Rewrite `todo-form.tsx`

**Modify:** `apps/spa/src/modules/todo/view/forms/todo/todo-form.tsx`

New layout (form renders body + footer, header is in modal wrapper):

```
<Form {...methods}>
  <form onSubmit={handleSubmit}>
    <div className="flex flex-1 overflow-hidden">

      {/* LEFT COLUMN */}
      <div className="flex-1 border-r border-border overflow-y-auto max-h-[82vh]">

        {/* Title area */}
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2.5">
            <Checkbox />  {/* bound to 'completed' field */}
          </div>
          <Input />  {/* bound to 'title' field, borderless */}
        </div>

        {/* Description */}
        <div className="px-5 py-3 border-b border-border">
          <label>Description</label>
          <Textarea />  {/* bound to 'description' field, borderless */}
        </div>

        {/* Recurrence */}
        <div className="px-5 py-3 border-b border-border">
          <RecurrencePanel control={methods.control} />
        </div>

        {/* Comments placeholder */}
        <div className="px-5 py-4 flex-1">
          <label>Comments</label>
          <Textarea disabled placeholder="Comments coming soon..." />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-48 p-4 space-y-4 overflow-y-auto max-h-[82vh]">
        {/* Project select (compact, with colored dot) */}
        {/* Section select (compact, depends on project) */}
        {/* Due date picker */}
        {/* Priority select (compact, color-coded) */}
        {/* Goal select (compact, with emoji) */}
        {/* Metadata timestamps (edit mode only) */}
      </div>
    </div>

    {/* FOOTER */}
    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
      <span className="text-xs text-muted-foreground">
        {mode === "edit" ? "Editing task" : "New task"}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Discard</Button>
        <Button type="submit" size="sm">
          {mode === "edit" ? "Save changes" : "Create task"}
        </Button>
      </div>
    </div>
  </form>
</Form>
```

**Sidebar field details:**
- Each field: label (`text-[10px] font-semibold uppercase tracking-wide text-muted-foreground`) + Select with `variant="compact"`
- **Project**: Colored dot (`<span className="w-1.5 h-1.5 rounded-full">`) before name
- **Priority**: Color-coded text — high=`text-red-500`, medium=`text-amber-500`, low=`text-blue-500`
- **Goal**: Emoji + name in select items
- **Metadata**: `text-[11px] text-muted-foreground`, border-top separator, only shown in edit mode

### 5.2 Update form hook

**Modify:** `apps/spa/src/modules/todo/view/forms/todo/todo-form.hook.ts`

- Import and call `useGetAllGoals()` hook
- Return `goals` array
- Handle `recurrence` defaults
- No changes to project/section cascade logic

---

## Phase 6: Modal Wrapper Redesign

### 6.1 Redesign `new-todo-modal.tsx`

**Modify:** `apps/spa/src/modules/todo/view/modals/new-todo-modal.tsx`

```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-[620px] p-0 gap-0 flex flex-col max-h-[85vh]" hideDefaultClose>
    {/* Header: close button only */}
    <div className="flex items-center justify-end px-4 py-3 border-b border-border">
      <DialogClose asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </DialogClose>
    </div>
    <TodoForm mode="create" onCancel={onClose} initialValues={initialValues} />
  </DialogContent>
</Dialog>
```

### 6.2 Redesign `edit-todo-modal.tsx`

**Modify:** `apps/spa/src/modules/todo/view/modals/edit-todo-modal.tsx`

```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-[620px] p-0 gap-0 flex flex-col max-h-[85vh]" hideDefaultClose>
    {/* Header: duplicate + delete + close icon buttons */}
    <div className="flex items-center justify-end gap-1.5 px-4 py-3 border-b border-border">
      <Button variant="ghost" size="icon" className="h-7 w-7" title="Duplicate">
        <Copy className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" title="Delete">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
      <DialogClose asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <X className="w-3.5 h-3.5" />
        </Button>
      </DialogClose>
    </div>
    <TodoForm
      mode="edit"
      onCancel={onClose}
      initialValues={initialValues}
      metadata={headerMeta}
    />
  </DialogContent>
</Dialog>
```

Removed: `DropdownMenu`, `formatDate` helper, project name in header.

---

## Files Summary

### Files to CREATE (5):
| File | Purpose |
|------|---------|
| `packages/ui/src/components/radio-group.tsx` | RadioGroup for recurrence end options |
| `apps/spa/src/modules/todo/view/forms/todo/recurrence-panel.tsx` | Recurrence toggle + panel |
| `apps/spa/src/modules/todo/view/forms/todo/format-recurrence-preview.ts` | Recurrence summary string |
| `apps/spa/src/modules/goals/app/services/get-all-goals.ts` | Goals service stub |
| `apps/spa/src/modules/goals/app/hooks/use-get-all-goals.ts` | Goals TanStack Query hook |

### Files to MODIFY (9):
| File | Changes |
|------|---------|
| `packages/ui/package.json` | Add `@radix-ui/react-radio-group` dep |
| `packages/ui/src/components/select.tsx` | Add `variant="compact"` to SelectTrigger |
| `packages/ui/src/components/dialog.tsx` | Add `hideDefaultClose` prop to DialogContent |
| `apps/spa/src/app/config/query-keys.ts` | Add `GOALS` query key |
| `apps/spa/src/modules/todo/view/forms/todo/todo-form.schema.ts` | Add completed, goal, recurrence fields |
| `apps/spa/src/modules/todo/view/forms/todo/todo-form.hook.ts` | Add goals hook, return goals |
| `apps/spa/src/modules/todo/view/forms/todo/todo-form.tsx` | Full rewrite: new layout |
| `apps/spa/src/modules/todo/view/modals/new-todo-modal.tsx` | Redesign: close-only header |
| `apps/spa/src/modules/todo/view/modals/edit-todo-modal.tsx` | Redesign: icon buttons header |

---

## Implementation Order

1. **Phase 1** — `packages/ui` changes (radio-group, select variant, dialog prop)
2. **Phase 2** — Schema update
3. **Phase 3** — Goals data layer (service + hook + query key)
4. **Phase 4** — Recurrence panel + preview formatter
5. **Phase 5** — Main form rewrite + hook update
6. **Phase 6** — Modal wrapper redesign

---

## Verification

- [ ] `pnpm typecheck` passes
- [ ] `pnpm dev:front` starts without errors
- [ ] **New Task modal**: close button only in header, create mode, no metadata
- [ ] **Edit Task modal**: duplicate + delete + close icons, edit mode, metadata timestamps
- [ ] Sidebar selects use compact styling (30px height, muted bg, small text)
- [ ] Project select shows colored dot
- [ ] Priority select shows color-coded text
- [ ] Goal select shows emoji + name
- [ ] Checkbox next to title toggles completed state
- [ ] Recurrence toggle expands/collapses panel
- [ ] Frequency chips toggle correctly
- [ ] Weekly days selector only appears for "Weekly"
- [ ] Recurrence end options work with RadioGroup
- [ ] Preview pill updates dynamically
- [ ] Footer: mode hint + Discard + Save buttons
- [ ] Comments section: disabled placeholder
- [ ] No new `Todo` symbols (use `Task` naming)

---

## Notes

- **Recurrence data not persisted**: API has no recurrence endpoint. Form collects data but `handleSubmit` logs it (consistent with current mock pattern).
- **Goals mock data**: No API endpoint. Service stub returns hardcoded goals matching the `Goal` entity type.
- **Form overflow**: With recurrence expanded, use `max-h-[82vh]` + `overflow-y-auto` on left column.
