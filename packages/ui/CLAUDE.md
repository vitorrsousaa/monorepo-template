# @repo/ui — Claude Context

Shared component library built on Radix UI + Tailwind CSS. Tree-shakeable ESM output via tsup.

## Stack

| Lib | Purpose |
|-----|---------|
| Radix UI | Headless accessible primitives (dialog, dropdown, select, tabs, tooltip, etc.) |
| Tailwind CSS | Utility-first styling |
| class-variance-authority (CVA) | Component variant management |
| tailwind-merge + clsx | Safe className composition via `cn()` |
| lucide-react | Icons |
| react-hook-form + @hookform/resolvers | Form handling |
| sonner | Toast notifications |
| react-day-picker + date-fns | Date picker / calendar |
| cmdk | Command palette |

## Structure

```
src/
├── components/       # 36+ UI components (one file per component)
├── hooks/
│   └── use-mobile.tsx  # useIsMobile() — breakpoint detection (768px)
├── providers/
│   ├── theme-provider.tsx  # Dark/light/system theme (ThemeProvider + useTheme)
│   └── index.ts
├── utils/
│   ├── cn.ts         # clsx + tailwind-merge wrapper
│   └── index.ts
└── styles/
    └── theme.css     # CSS variables for theming
```

## Import Pattern

Each component is a separate entry point — no single barrel. Import by component name:

```ts
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { DatePicker } from "@repo/ui/date-picker";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import { ThemeProvider, useTheme } from "@repo/ui/providers";
```

## Component Patterns

### CVA-based (most components)

```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
```

Key conventions:
- `forwardRef` for styled wrapper components
- `asChild` prop via Radix `Slot` for composition
- `cn()` always used for className merging
- CVA for variant control

### Compound components

```tsx
// card.tsx — multiple named exports from single file
export { Card, CardHeader, CardTitle, CardContent, CardFooter };
```

### Simple HTML wrappers

```tsx
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn("...", className)} {...props} />;
}
```

### RenderIf — conditional rendering utility

```tsx
// Used by SPA instead of && or ternaries in JSX
<RenderIf condition={isLoading} render={<Skeleton />} />
<RenderIf condition={hasValue} render={<Value />} fallback={<Empty />} />
```

## Build

- **Bundler:** tsup (ESM only, with `.d.ts`, splitting enabled)
- **External:** `react`, `react-dom` (peer deps)
- **Entries:** each component file + utils barrel + providers barrel
- **Output:** `dist/components/*.js` (one file per component for tree-shaking)

## Adding a New Component

1. Create `src/components/<name>.tsx`
2. Use `cn()` for className composition
3. Use `forwardRef` if the component wraps an HTML element
4. Export component + variants (if CVA)
5. Run `pnpm --filter ui build` to generate dist

Alternatively, use the CLI shortcut for shadcn components:
```bash
pnpm cosmos add <component-name>
```

## What NOT to Do

- Don't import raw Tailwind utilities in SPA/web — use `@repo/ui` components
- Don't create barrel `index.ts` in components/ — each component is its own entry
- Don't use `&&` or ternaries for conditional rendering in SPA — use `RenderIf`
