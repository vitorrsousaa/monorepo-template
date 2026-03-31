# CLI — Claude Context

Boilerplate generator for the monorepo. Run via `pnpm cosmos create` (interactive) or `pnpm cosmos add <component>`.

## Stack

- **Entry:** commander (CLI framework)
- **Prompts:** inquirer (interactive selection)
- **File ops:** fs-extra
- **Build:** tsup → CommonJS, target Node 20

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm cosmos create` | Interactive prompt: creates module, controller, service, or provider |
| `pnpm cosmos add <name>` | Installs a shadcn/ui component into `packages/ui/` |

## Structure

```
src/
├── index.ts                  # CLI entry, command registration
├── utils.ts                  # toPascalCase, toCamelCase, toKebabCase
├── lib/
│   └── paths.ts              # Path resolution (relative to dist/)
└── commands/
    ├── add.ts                # shadcn/ui component installer
    └── create/
        ├── handler.ts        # Interactive prompt orchestrator
        ├── module.ts         # Creates module dir + default service + controller
        ├── controller.ts     # Creates controller in existing module
        ├── service.ts        # Creates service in existing module
        ├── provider.ts       # Creates provider
        └── templates/        # String template generators
            ├── controller.ts
            ├── controller-schema.ts
            ├── service.ts
            ├── dto.ts
            ├── provider.ts
            └── index.ts
```

## What `create` Generates

| Type | Output directory | Files |
|------|------------------|-------|
| **module** | `apps/api/src/app/modules/<name>/` | `controllers/` + `services/` dirs, plus default controller + service |
| **controller** | `modules/<module>/controllers/<name>/` | `controller.ts`, `schema.ts`, `index.ts` |
| **service** | `modules/<module>/services/<name>/` | `service.ts`, `dto.ts`, `index.ts` |
| **provider** | `apps/api/src/app/providers/<name>/` | `provider.ts`, `types.ts`, `index.ts` |

## CRITICAL: Templates Are Outdated

The CLI templates use the **old** controller pattern:

```ts
// OLD pattern (CLI generates this)
export class XController implements IController {
  async handle(request: IRequest): Promise<IResponse> {
    try {
      const [status, parsedBody] = missingFields(schema, request.body);
      // ... manual try/catch + errorHandler
    }
  }
}
```

The actual API now uses the **new** pattern:

```ts
// NEW pattern (what the codebase actually uses)
export class XController extends Controller<"private", TResponse> {
  constructor(private readonly service: IXService) {
    super("private");
  }
  protected override async handle(request: Controller.Request<"private">): Promise<Controller.Response<TResponse>> {
    // No try/catch, no errorHandler — base class handles it
  }
}
```

**After running `pnpm cosmos create`, manually update the generated controller to use the new `Controller<TType>` base class pattern.** See `apps/api/CLAUDE.md` for the correct pattern.

## Path Resolution

Templates resolve paths relative to `dist/commands/create/` (compiled output). The `getApiModulesPath()` helper navigates `../../../` up to monorepo root, then into `apps/api/src/app/modules/`.

## What NOT to Do

- Don't trust CLI-generated code as-is — always verify against current API patterns
- Don't add new templates without updating to the new `Controller` base class pattern
- Don't use the CLI for SPA boilerplate — it only generates API code
