# layouts

Documentation for the **layouts** folder: UI wrappers that are applied to **all routes** within a given route module.

## What layouts are

Layouts are components that define the common structure (shell) for a set of routes. Instead of repeating sidebar, header, or panel on every page, the layout wraps all pages in that module and renders the current route’s content via React Router’s `<Outlet />`.

**Rule:** A layout must be used as the `element` of a parent route in the router; all child routes (children) of that module are rendered inside that layout. In other words: **all routes within that module use the same layout**.

## Where routes live and how the layout connects to them

- Route modules live in `view/router/modules/` (e.g. `auth.routes.tsx`, `todo.routes.tsx`, `projects.routes.tsx`).
- In each module, the **parent** route has `element: <XLayout />` and `children` with the concrete routes (pages).
- The layout imports `Outlet` from `react-router-dom` and renders `<Outlet />` where the child route content should appear.

Example in `todo.routes.tsx`:

```tsx
export const todoRoutes: RouteObject = {
  path: "/",
  element: <TodoLayout />,
  children: [
    { path: ROUTES.TASKS.DASHBOARD, element: <Dashboard /> },
    { path: ROUTES.TASKS.INBOX, element: <Inbox /> },
    // ...
  ],
};
```

All child routes (dashboard, inbox, today, upcoming) are rendered inside `TodoLayout`.

## Folder structure: `layouts/`

```
layouts/
├── auth/                    # Layout for auth routes (unauthenticated)
│   ├── auth-layout.tsx
│   └── auth-layout-brand-panel.tsx
└── app/                     # Layouts for the authenticated area (inside DashboardLayout)
    ├── dashboard-layout.tsx # Global shell: sidebar + header + Outlet
    ├── todo-layout.tsx      # Wraps only /todo/* routes
    ├── projects-layout.tsx  # Wraps only /projects/* routes
    ├── goals-layout.tsx     # Wraps only /goals/* routes
    ├── user-layout.tsx      # Wraps only /user/* routes
    └── sidebar/             # Sidebar components (nav, lists, etc.)
        ├── sidebar.tsx
        ├── nav-main.tsx
        ├── nav-projects.tsx
        ├── nav-user.tsx
        ├── nav-secondary.tsx
        └── components/
```

## Mapping: layout → route module

| Layout | File | Route module | Routes affected |
|--------|------|----------------|------------------|
| **AuthLayout** | `auth/auth-layout.tsx` | `auth.routes.tsx` | `/`, `/signin`, `/signup` |
| **DashboardLayout** | `app/dashboard-layout.tsx` | Used in `browser.tsx` as parent of the whole authenticated app | All private routes (todo, projects, goals, user) |
| **TodoLayout** | `app/todo-layout.tsx` | `todo.routes.tsx` | `/todo/dashboard`, `/todo/inbox`, `/todo/today`, `/todo/upcoming` |
| **ProjectsLayout** | `app/projects-layout.tsx` | `projects.routes.tsx` | `/projects`, `/projects/:id` |
| **GoalsLayout** | `app/goals-layout.tsx` | `goals.routes.tsx` | `/goals/dashboard` |
| **UserLayout** | `app/user-layout.tsx` | `user.routes.tsx` | `/user`, `/user/settings`, `/user/support` |

Router hierarchy: `AuthGuard (private)` → `DashboardLayout` → (TodoLayout | ProjectsLayout | GoalsLayout | UserLayout) → pages. Each of these intermediate layouts applies only to the routes in its own module.

## Per-layout details

- **auth/**  
  - **AuthLayout**: Grid (brand panel on the left on desktop, form on the right). Used for all auth routes (signin, signup).  
  - **AuthLayoutBrandPanel**: Brand/illustration panel used by AuthLayout.

- **app/**  
  - **DashboardLayout**: Provides `SidebarProvider`, `AppSidebar`, header with breadcrumb and theme toggle; child route content goes in `<Outlet />`. Root layout for the authenticated area.  
  - **TodoLayout**, **ProjectsLayout**, **GoalsLayout**, **UserLayout**: Domain-specific wrappers (e.g. TodoLayout may add `GlobalAddTaskButton`). All render `<Outlet />` for their module’s pages.  
  - **sidebar/**: Sidebar components (main nav, projects, user, etc.), used by `DashboardLayout`.

## Conventions

- **One layout per route module:** Each file in `router/modules/*.routes.tsx` that groups multiple routes should have a dedicated layout (in `auth/` or `app/`) that is the parent route’s `element`.  
- **Naming:** `*-layout.tsx` for the main layout component; helper components for the same layout can live in the same folder (e.g. `auth-layout-brand-panel.tsx`).  
- **Importing layouts in routes:** Use the `@/layouts/...` alias (e.g. `@/layouts/auth/auth-layout`, `@/layouts/app/todo-layout`).  
- **Outlet required:** Every layout that acts as a parent route must render `<Outlet />` where child routes are injected.

## Adding a new layout

1. Create the component in `layouts/auth/` (public routes) or `layouts/app/` (authenticated routes), e.g. `layouts/app/settings-layout.tsx`.  
2. The layout should import `Outlet` from `react-router-dom` and render `<Outlet />` where child content should appear.  
3. In `view/router/modules/`, create or edit the module’s route file (e.g. `settings.routes.tsx`) and define a parent route with `element: <SettingsLayout />` and `children` with the concrete routes.  
4. If it’s a new module, export the routes from `router/modules/index.ts` and register them in `router/browser.tsx` as children of `DashboardLayout` (authenticated area) or of the public auth guard (auth).

## References

- Router and route modules: [../router/](../router/) and [../router/modules/](../router/modules/).
- Route path config: `@/config/routes` (ROUTES).
- View overview: [../CLAUDE.md](../CLAUDE.md).
- SPA overview: [../../CLAUDE.md](../../CLAUDE.md).
