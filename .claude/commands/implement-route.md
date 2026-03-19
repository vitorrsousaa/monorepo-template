# Implement Route

Guides implementation of a new API route following the Contracts → API → SPA pattern.

## Usage

`/implement-route <domain> <feature>` — e.g. `/implement-route sections create`

## Phase-by-Phase Checklist

### Phase 1 — Contracts (`packages/contracts/src/<domain>/`)

- [ ] **`entities/index.ts`** — `<Entity>Dto` interface; dates as ISO strings (`string`), no `Date` objects
- [ ] For POST/PUT/PATCH routes with a request body:
  - [ ] **`<route>/schema.ts`** — Zod schema + exported validation constants (`<FIELD>_MIN`, `<FIELD>_MAX`)
  - [ ] **`<route>/input.ts`** — `export type <Action>Input = z.infer<typeof <action>Schema>`
  - [ ] **`<route>/output.ts`** — response interface (references `<Entity>Dto`)
  - [ ] **`<route>/index.ts`** — barrel: export schema, constants, input type, output type
- [ ] For GET/DELETE routes (no request body):
  - [ ] **`<route>/output.ts`** — response interface
  - [ ] **`<route>/index.ts`** — barrel: export output type + re-export entity
- [ ] **`index.ts`** — top-level barrel: `export type { <Entity>Dto } from "./entities"`
- [ ] Update `packages/contracts/CLAUDE.md` — add to Structure + Main entry points table

### Phase 2 — API

#### 2a. Mapper (`apps/api/src/app/modules/<domain>/mappers/<entity>-to-dto.ts`)
- [ ] `<entity>ToDto(entity: <Entity>): <Entity>Dto` — converts Date → ISO string
- [ ] Follow `projects/mappers/project-to-dto.ts` pattern exactly

#### 2b. Service DTO (`services/<feature>/dto.ts`)
- [ ] **Pure TS interface** — no Zod in services
- [ ] `<Action>ServiceInput extends <Action>Input { userId: string; projectId?: string; }`
- [ ] `<Action>ServiceOutput { <entity>: <Entity>; }` — returns domain entity (controller maps to DTO)

#### 2c. Service (`services/<feature>/service.ts`)
- [ ] Uses `<Action>ServiceInput` / `<Action>ServiceOutput` from dto.ts
- [ ] Returns domain entity (not DTO) — date serialization happens in controller

#### 2d. Controller (`controllers/<feature>/controller.ts`)
- [ ] `extends Controller<"private", <Action>Output>` — typed response
- [ ] Imports `<action>Schema`, `<Action>Input`, `<Action>Output` from `@repo/contracts/<domain>/<route>`
- [ ] `protected override schema = <action>Schema` — validation from contracts, no local schema.ts
- [ ] Calls `<entity>ToDto(result.<entity>)` before returning
- [ ] `super()` — no argument (existing pattern)

#### 2e. Delete local `schema.ts`
- [ ] If a local `schema.ts` exists in the controller folder, delete it (contracts is the source of truth)
- [ ] Update `index.ts` to only export `./controller`

### Phase 3 — SPA

#### 3a. Entities (`modules/<domain>/app/entities/`)
- [ ] `<entity>.ts` — `export type { <Entity>Dto as <Entity> } from "@repo/contracts/<domain>/entities"`
- [ ] `create-<entity>.ts` — `export type { <Action>Input } from "@repo/contracts/<domain>/create"`

#### 3b. Services (`modules/<domain>/app/services/`)
- [ ] `create-<entity>.ts`:
  - Extends `<Action>Input` with `projectId` (URL path param — **not** sent in body)
  - Destructures: `const { projectId, ...body } = input` — only `body` goes in POST
- [ ] `get-all-by-project.ts` — use `GetAllSectionsResponse` from contracts as response type

#### 3c. Mapper (`modules/<domain>/app/mappers/<feature>-mappers.ts`)
- [ ] `map<Form>To<Action>Input(formData: T<Form>Schema): <Action>Input`
- [ ] JSDoc listing all transformations

#### 3d. Form (`modules/<domain>/view/forms/<entity>/`)
- [ ] **`<entity>-form.schema.ts`** — imports `<FIELD>_MIN`, `<FIELD>_MAX` from contracts, not hardcoded
- [ ] **`<entity>-form.hook.ts`** — `useForm` + `zodResolver`, resets on submit
- [ ] **`<entity>-form.tsx`** — React form, `maxLength={<FIELD>_MAX}` on inputs
- [ ] **`index.ts`** — barrel export

---

## Key Rules

| Rule | Why |
|------|-----|
| No Zod in services | Controller already validated; services receive typed data |
| No local `schema.ts` in controller when contracts exist | Contracts is the single source of truth |
| `projectId` is a URL path param, never in POST body | It's in the URL — sending it in body is a bug |
| Date serialization happens in controller (via mapper) | Service returns domain entities; only the wire layer serializes |
| Validation constants exported from contracts | SPA forms import `MAX`/`MIN` from contracts — keeps validation in sync |
| `extends Controller<"private", TOutput>` | Typed response prevents mismatched shapes |

---

## Reference Implementations

| Layer | Example |
|-------|---------|
| Contracts entity | `packages/contracts/src/sections/entities/index.ts` |
| Contracts route | `packages/contracts/src/sections/create/` |
| API mapper | `apps/api/src/app/modules/sections/mappers/section-to-dto.ts` |
| API controller | `apps/api/src/app/modules/sections/controllers/create-section/controller.ts` |
| API service DTO | `apps/api/src/app/modules/sections/services/create-section/dto.ts` |
| SPA service (bug fix pattern) | `apps/spa/src/modules/sections/app/services/create-section.ts` |
| SPA mapper | `apps/spa/src/modules/sections/app/mappers/section-mappers.ts` |
| SPA form schema | `apps/spa/src/modules/sections/view/forms/section/section-form.schema.ts` |

---

## Verification

```bash
# 1. Build contracts (required before API/SPA typecheck)
cd packages/contracts && pnpm build

# 2. Full monorepo typecheck
pnpm typecheck

# 3. Confirm no local schema.ts files remain in controller folders wired to contracts
# 4. Confirm POST body does NOT include projectId
# 5. Confirm all Date fields in wire responses are ISO strings (string, not Date)
```
