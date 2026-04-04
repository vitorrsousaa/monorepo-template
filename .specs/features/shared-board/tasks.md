# Shared Board Tasks

**Spec**: `.specs/features/shared-board/spec.md`
**Design**: `.specs/features/shared-board/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 0: Pre-check (Sequential)

```
T0
```

### Phase 1: Contracts (Parallel after T0)

```
T0 → T1 → T2 [P]
          T3 [P]
          T4 [P]
          T5 (depends T2, T3, T4)
```

### Phase 2: API Foundation (Parallel after T1)

```
T1 → T6 [P]   (domain entities)
     T7 [P]   (IPermissionService)
     T8 [P]   (ISharingRepository)
     T9 [P]   (DynamoDB entity types)
     T10 [P]  (Extend ProjectDynamoDBEntity + mapper)
```

### Phase 3: DynamoDB Infrastructure (After T8, T9, T10)

```
T8, T9 → T11 [P]  (BoardAccessDynamoMapper)
          T12 [P]  (InvitationDynamoMapper)

T10, T11, T12 → T13  (SharingDynamoRepository)
T13 → T14            (sharing-repository-factory)
```

### Phase 4: Errors + Permission + Mappers (Parallel after T6)

```
T6, T1 → T15 [P]  (error classes)
          T16 [P]  (board-access-to-dto mapper)
          T17 [P]  (invitation-to-dto mapper)
          T18 [P]  (member-to-dto mapper)

T7, T8, T14 → T19  (PermissionService)
```

### Phase 5: Sharing Services (Parallel after T19)

```
T19 → T20 [P]  (InviteToProjectService)
      T21 [P]  (AcceptInvitationService)
      T22 [P]  (DeclineInvitationService)
      T23 [P]  (GetMyInvitationsService)
      T24 [P]  (GetProjectMembersService)
      T25 [P]  (GetProjectInvitationsService)
      T26 [P]  (CancelInvitationService)
      T27 [P]  (UpdateMemberRoleService)
      T28 [P]  (RemoveMemberService)
      T29 [P]  (UserSearchService)
```

### Phase 6: Controllers (Parallel, each after its service)

```
T20 → T30 [P]  (InviteToProjectController)
T25 → T31 [P]  (GetProjectInvitationsController)
T26 → T32 [P]  (CancelInvitationController)
T24 → T33 [P]  (GetProjectMembersController)
T27 → T34 [P]  (UpdateMemberRoleController)
T28 → T35 [P]  (RemoveMemberController)
T23 → T36 [P]  (GetMyInvitationsController)
T21 → T37 [P]  (AcceptInvitationController)
T22 → T38 [P]  (DeclineInvitationController)
T29 → T39 [P]  (UserSearchController)
```

### Phase 7: Factories + Handlers (After Phase 6)

```
All controllers → T40  (service factories — 11 files)
T40            → T41  (controller factories — 10 files)
T41            → T42  (Lambda handlers — 10 functions)
T42            → T43  (serverless.yml — function entries)
```

### Phase 8: Modify Existing Services (Parallel after T19)

```
T19 → T44 [P]  (GetProjectDetailService)
      T45 [P]  (GetAllSectionsByProjectService)
      T46 [P]  (CreateTaskService)
      T47 [P]  (UpdateTaskService)
      T48 [P]  (UpdateCompletionService)
      T49 [P]  (CreateSectionService)
      T50 [P]  (GetAllProjectsByUserService)
```

### Phase 9: Validation

```
T43, T50 → T51  (pnpm typecheck)
```

---

## Task Breakdown

### T0: Add UserEmailLookup write to UserDynamoRepository.create()

**What**: Modify `UserDynamoRepository.create()` to also write a `USER_EMAIL#<email> / METADATA` lookup item in the same `transactWrite`, so email-to-userId resolution works for invitation matching.
**Where**: `apps/api/src/infra/db/dynamodb/repositories/user-dynamo-repository.ts`
**Depends on**: None
**Reuses**: `IDatabaseClient.transactWrite`, existing `UserDynamoMapper`
**Requirement**: SHARE-35 (email lookup prerequisite for all invitation flows)

**Done when**:
- [ ] `create()` uses `transactWrite` with 2 items: the existing User Put + new `{ PK: "USER_EMAIL#<email>", SK: "METADATA", entity_type: "USER_EMAIL_LOOKUP", user_id: userId }`
- [ ] `IUserRepository` interface is unchanged
- [ ] `pnpm typecheck` passes on `apps/api`

**Verify**: Call `UserDynamoRepository.create()` → two DynamoDB items written atomically.

---

### T1: Create `packages/contracts/src/sharing/types.ts`

**What**: Define `SharingRole`, `InvitationStatus`, `ResourceType` enums + `SHARING_ROLE_HIERARCHY` map.
**Where**: `packages/contracts/src/sharing/types.ts`
**Depends on**: None
**Requirement**: SHARE-01

**Done when**:
- [ ] `SharingRole`, `InvitationStatus`, `ResourceType` exported as const objects + types
- [ ] `SHARING_ROLE_HIERARCHY: Record<SharingRole, number>` exported
- [ ] No TypeScript errors

**Verify**: `pnpm typecheck` passes on `packages/contracts`.

---

### T2: Create `packages/contracts/src/sharing/entities/`

**What**: Create 3 DTO files: `board-access.ts` (`BoardAccessDto`), `invitation.ts` (`InvitationDto`), `member.ts` (`MemberDto`) + `index.ts` barrel.
**Where**: `packages/contracts/src/sharing/entities/`
**Depends on**: T1
**Requirement**: SHARE-07, SHARE-18, SHARE-24

**Done when**:
- [ ] `BoardAccessDto`, `InvitationDto`, `MemberDto` interfaces match design spec
- [ ] `index.ts` re-exports all three
- [ ] Types use `SharingRole`, `InvitationStatus`, `ResourceType` from `../types`

**Verify**: Import from `@repo/contracts/sharing/entities` without errors.

---

### T3: Create sharing route contracts

**What**: Create 7 route folders under `packages/contracts/src/sharing/` — one per endpoint family. Each with `output.ts` (and `schema.ts` + `input.ts` where there's a body).
**Where**: `packages/contracts/src/sharing/{invite-to-project,get-my-invitations,accept-invitation,decline-invitation,get-project-members,get-project-invitations,cancel-invitation,update-member-role,user-search}/`
**Depends on**: T1, T2
**Requirement**: SHARE-11, SHARE-18, SHARE-21, SHARE-24, SHARE-30, SHARE-33

Folders + files:
| Folder | Files |
|--------|-------|
| `invite-to-project/` | `schema.ts` (Zod: email + role), `input.ts`, `output.ts`, `index.ts` |
| `get-my-invitations/` | `output.ts`, `index.ts` |
| `accept-invitation/` | `output.ts`, `index.ts` |
| `decline-invitation/` | `output.ts`, `index.ts` |
| `get-project-members/` | `output.ts`, `index.ts` |
| `get-project-invitations/` | `output.ts`, `index.ts` |
| `cancel-invitation/` | `output.ts`, `index.ts` |
| `update-member-role/` | `schema.ts` (Zod: role), `input.ts`, `output.ts`, `index.ts` |
| `user-search/` | `output.ts`, `index.ts` |

**Done when**:
- [ ] All output types reference correct DTO types from entities
- [ ] Zod schemas in `invite-to-project/schema.ts` validate `email` (string, email format) and `role` (enum: "editor"|"viewer")
- [ ] Zod schema in `update-member-role/schema.ts` validates `role` (enum)
- [ ] `pnpm typecheck` passes

**Verify**: Import `InviteToProjectResponse` from `@repo/contracts/sharing/invite-to-project` without errors.

---

### T4: Modify `ProjectDto` to add optional sharing fields

**What**: Add 3 optional fields to `Project` interface in `packages/contracts/src/projects/entities/index.ts`: `role?: SharingRole`, `isShared?: boolean`, `memberCount?: number`.
**Where**: `packages/contracts/src/projects/entities/index.ts`
**Depends on**: T1
**Requirement**: SHARE-07, SHARE-08, SHARE-09

**Done when**:
- [ ] Fields added as optional (no breaking change)
- [ ] `SharingRole` imported from `../sharing/types` (or `../../sharing/types`)
- [ ] `pnpm typecheck` passes — existing code that doesn't use these fields is unaffected

**Verify**: Build `packages/contracts` — no errors.

---

### T5: Create `packages/contracts/src/sharing/index.ts` barrel

**What**: Top-level barrel for the `sharing/` module, re-exporting from `types`, `entities`, and all route folders.
**Where**: `packages/contracts/src/sharing/index.ts`
**Depends on**: T2, T3, T4
**Requirement**: N/A (structural)

**Done when**:
- [ ] `export * from "./types"`, `export * from "./entities"` + named route exports
- [ ] Import from `@repo/contracts/sharing` resolves all public types

---

### T6: Create API domain entities for sharing

**What**: Create 3 internal domain interface files: `board-access.ts`, `invitation.ts`, `member.ts`.
**Where**: `apps/api/src/core/domain/sharing/`
**Depends on**: T1
**Requirement**: SHARE-01

These are API-internal types (not exported to SPA). Match design spec exactly.

**Done when**:
- [ ] `BoardAccess`, `Invitation`, `Member` interfaces defined as per design
- [ ] Types reference `SharingRole`, `InvitationStatus`, `ResourceType` from `@repo/contracts/sharing/types`
- [ ] `index.ts` barrel exports all three

---

### T7: Create `IPermissionService` interface

**What**: Define `IPermissionService` interface + `RequireRoleParams` + `PermissionResult` types.
**Where**: `apps/api/src/data/protocols/sharing/permission-service.ts`
**Depends on**: T1
**Requirement**: SHARE-01

```typescript
interface RequireRoleParams {
  requesterId: string;
  resourceType: ResourceType;
  resourceId: string;
  requiredRole: SharingRole;
}
interface PermissionResult { ownerUserId: string; effectiveRole: SharingRole; }
interface IPermissionService {
  requireRole(params: RequireRoleParams): Promise<PermissionResult>;
}
```

**Done when**:
- [ ] Interface matches design spec exactly
- [ ] Exported from `apps/api/src/data/protocols/sharing/`

---

### T8: Create `ISharingRepository` interface

**What**: Define full `ISharingRepository` interface with all 11 methods from design spec.
**Where**: `apps/api/src/data/protocols/sharing/sharing-repository.ts`
**Depends on**: T6
**Requirement**: All SHARE requirements (foundation)

**Done when**:
- [ ] All methods defined with correct typed-object params (>2 params use object)
- [ ] Return types use domain entities (`BoardAccess`, `Invitation`) from T6
- [ ] `index.ts` barrel in `apps/api/src/data/protocols/sharing/` exports both interfaces

---

### T9: Create DynamoDB entity types for sharing

**What**: Create 5 DynamoDB entity interfaces: `BoardAccessDynamoDBEntity`, `InvitationDynamoDBEntity`, `InvitationOwnerViewDynamoDBEntity`, `InvitationProjectViewDynamoDBEntity`, `UserEmailLookupDynamoDBEntity`.
**Where**: `apps/api/src/infra/db/dynamodb/mappers/sharing/types.ts`
**Depends on**: T6
**Requirement**: SHARE-11 (DynamoDB schema)

All extend `BaseDynamoDBEntity` from `src/infra/db/dynamodb/contracts/entity.ts`.

**Done when**:
- [ ] All 5 interfaces defined per design spec
- [ ] No TypeScript errors

---

### T10: Extend `ProjectDynamoDBEntity` with `members[]` field + update mapper

**What**: Add optional `members?: Array<{...}>` to `ProjectDynamoDBEntity` and update `ProjectMapper.toDomain()` to map it to `Member[]`.
**Where**:
  - `apps/api/src/infra/db/dynamodb/mappers/projects/types.ts` (entity type)
  - `apps/api/src/infra/db/dynamodb/mappers/projects/project-mapper.ts` (toDomain)
**Depends on**: T6
**Requirement**: SHARE-09 (memberCount), SHARE-24 (member list)

**Done when**:
- [ ] `members` field is optional — existing code that doesn't set it is unaffected
- [ ] `toDomain()` maps `members` array (or `undefined`) to `Member[]` (empty array as default)
- [ ] `pnpm typecheck` passes

---

### T11: Create `BoardAccessDynamoMapper`

**What**: Mapper class with `toDatabase()` and `toDomain()` for `BoardAccess` ↔ `BoardAccessDynamoDBEntity`.
**Where**: `apps/api/src/infra/db/dynamodb/mappers/sharing/board-access-mapper.ts`
**Depends on**: T9
**Requirement**: SHARE-07

Key logic:
- `toDatabase()`: `PK = USER#<guestUserId>`, `SK = BOARD_ACCESS#<resourceType>#<resourceId>`, `entity_type = "BOARD_ACCESS"`
- `toDomain()`: reverse mapping

**Done when**:
- [ ] Both methods implemented per design spec
- [ ] No TypeScript errors

---

### T12: Create `InvitationDynamoMapper`

**What**: Mapper class with 3 `toDatabase*()` methods (guest view, owner view, project view) and 1 `toDomain()`.
**Where**: `apps/api/src/infra/db/dynamodb/mappers/sharing/invitation-mapper.ts`
**Depends on**: T9
**Requirement**: SHARE-11 (triple-write)

Key logic:
- `toDatabaseGuestView()`: `PK = INVITE_EMAIL#<email>`, `SK = INVITATION#<id>`
- `toDatabaseOwnerView()`: `PK = USER#<ownerUserId>`, `SK = INVITATION#<id>`
- `toDatabaseProjectView()`: `PK = PROJECT#<resourceId>`, `SK = INVITATION#<status>#<id>` (status in SK — enables query-by-status)
- `toDomain()`: from guest view item

**Done when**:
- [ ] All 4 methods implemented per design spec
- [ ] Different `entity_type` values per view
- [ ] No TypeScript errors

---

### T13: Create `SharingDynamoRepository`

**What**: Full implementation of `ISharingRepository` with all 11 methods. Constructor receives `IDatabaseClient`, `BoardAccessDynamoMapper`, `InvitationDynamoMapper`, `ProjectMapper`.
**Where**: `apps/api/src/infra/db/dynamodb/repositories/sharing/sharing-dynamo-repository.ts`
**Depends on**: T8, T11, T12
**Requirement**: All SHARE persistence requirements

Key implementations per design:
- `acceptInvitation()`: uses `transactWrite` (6 items: 3 invitation updates, 1 BoardAccess create, 1 project-view delete+insert, 1 project members update via `projectMapper.toDatabase()` for key resolution)
- `createInvitation()`: `transactWrite` with 3 Put items (triple-write)
- `declineInvitation()` / `cancelInvitation()`: update status across all 3 views
- `getUserIdByEmail()`: GetItem on `USER_EMAIL#<email> / METADATA`

**Done when**:
- [ ] All 11 methods implemented
- [ ] `acceptInvitation` uses mapper injection for project PK/SK (no hardcoded prefixes)
- [ ] Status-in-SK handled correctly: delete `INVITATION#pending#id` + put `INVITATION#accepted#id`
- [ ] `pnpm typecheck` passes

---

### T14: Create `sharing-repository-factory`

**What**: Factory function that wires `SharingDynamoRepository` with its dependencies.
**Where**: `apps/api/src/infra/db/dynamodb/factories/sharing-repository-factory.ts`
**Depends on**: T13
**Requirement**: N/A (DI wiring)

**Done when**:
- [ ] `makeSharingRepository()` returns `ISharingRepository`
- [ ] Injects existing `DynamoDBClient`, `BoardAccessDynamoMapper`, `InvitationDynamoMapper`, `ProjectMapper` instances

---

### T15: Create sharing error classes

**What**: Create 6 `AppError` subclasses for sharing-specific errors.
**Where**: `apps/api/src/app/modules/sharing/errors/`

| File | Class | Status | Message |
|------|-------|--------|---------|
| `already-member.ts` | `AlreadyMemberError` | 409 | "User already has access to this project" |
| `pending-invitation.ts` | `PendingInvitationError` | 409 | "A pending invitation already exists for this email" |
| `invitation-not-found.ts` | `InvitationNotFoundError` | 404 | "Invitation not found" |
| `invitation-expired.ts` | `InvitationExpiredError` | 410 | "Invitation has expired" |
| `invitation-not-pending.ts` | `InvitationNotPendingError` | 409 | "Invitation is not pending" |
| `self-invite.ts` | `SelfInviteError` | 400 | "Cannot invite yourself" |
| `member-limit-exceeded.ts` | `MemberLimitExceededError` | 422 | "Project member limit exceeded" |

**Depends on**: None (uses `AppError` from `src/app/errors/app-error.ts`)
**Requirement**: All SHARE error scenarios

**Done when**:
- [ ] All 7 classes defined, extend `AppError`, set correct status codes
- [ ] `index.ts` barrel exports all

---

### T16: Create board-access-to-dto mapper

**What**: Function `boardAccessToDto(boardAccess: BoardAccess): BoardAccessDto`.
**Where**: `apps/api/src/app/modules/sharing/mappers/board-access-to-dto.ts`
**Depends on**: T1, T6
**Requirement**: SHARE-07

**Done when**:
- [ ] Maps all domain fields to DTO fields
- [ ] No TypeScript errors

---

### T17: Create invitation-to-dto mapper

**What**: Function `invitationToDto(params: { invitation: Invitation; projectName: string; ownerName: string }): InvitationDto`.
**Where**: `apps/api/src/app/modules/sharing/mappers/invitation-to-dto.ts`
**Depends on**: T1, T6
**Requirement**: SHARE-18

**Done when**:
- [ ] Maps `Invitation` domain + enriched data → `InvitationDto`
- [ ] `projectName` and `ownerName` injected as params (not fetched in mapper)

---

### T18: Create member-to-dto mapper

**What**: Function `memberToDto(member: Member): MemberDto`.
**Where**: `apps/api/src/app/modules/sharing/mappers/member-to-dto.ts`
**Depends on**: T1, T6
**Requirement**: SHARE-24

**Done when**:
- [ ] Straightforward field mapping
- [ ] `index.ts` barrel in `mappers/` exports all three mappers

---

### T19: Create `PermissionService`

**What**: Implementation of `IPermissionService.requireRole()` — checks ownership first, then `BoardAccess`, then validates role hierarchy.
**Where**: `apps/api/src/app/modules/sharing/services/permission/service.ts`
**Depends on**: T7, T8, T14
**Requirement**: SHARE-01 through SHARE-06

Logic:
1. `projectRepo.getById(resourceId, requesterId)` → if found, return `{ ownerUserId: requesterId, effectiveRole: "owner" }`
2. `sharingRepo.getBoardAccess(...)` → if found, use `boardAccess.ownerUserId` and `boardAccess.role`
3. If neither: throw `AppError("Forbidden", 403)`
4. `SHARING_ROLE_HIERARCHY[effectiveRole] < SHARING_ROLE_HIERARCHY[requiredRole]` → throw 403

**Done when**:
- [ ] All 4 steps implemented
- [ ] Uses `IProjectRepository` + `ISharingRepository` (both injected via constructor)
- [ ] Unit test coverage: owner pass, guest-editor pass, guest-viewer fails editor check, no access → 403

---

### T20: Create `InviteToProjectService`

**What**: Service that validates and creates a project invitation.
**Where**: `apps/api/src/app/modules/sharing/services/invite-to-project/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-11 through SHARE-17

Logic (per design):
1. `requireRole(owner)` — only owners can invite
2. Self-invite check → `SelfInviteError`
3. `getBoardAccess` → `AlreadyMemberError` if exists
4. `getPendingInvitation` → `PendingInvitationError` if exists
5. `getUserIdByEmail` → set `invitedUserId` or null
6. `createInvitation` (triple-write)
7. Return `InvitationDto`

**Done when**:
- [ ] All steps implemented in order
- [ ] `expiresAt = now + 30 days`
- [ ] Returns `InvitationDto` via mapper

---

### T21: Create `AcceptInvitationService`

**What**: Service that validates and atomically accepts an invitation.
**Where**: `apps/api/src/app/modules/sharing/services/accept-invitation/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-18 through SHARE-22

Logic:
1. `userRepo.getById(userId)` — need email
2. `getInvitationByIdAndEmail` → `InvitationNotFoundError`
3. Status check → `InvitationNotPendingError`
4. Expiry check → `InvitationExpiredError`
5. `projectRepo.getById(resourceId, ownerUserId)` — fetch project for member count + pass to repo
6. Member count ≤ 20 check → `MemberLimitExceededError`
7. `sharingRepo.acceptInvitation(...)` — atomic 6-item transact

**Done when**:
- [ ] All steps implemented
- [ ] Returns `ProjectDto` (shared project data with `role`, `isShared: true`)

---

### T22: Create `DeclineInvitationService`

**What**: Updates invitation status to "declined" across all 3 views.
**Where**: `apps/api/src/app/modules/sharing/services/decline-invitation/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-21

Logic:
1. `userRepo.getById(userId)` — need email
2. `getInvitationByIdAndEmail` → 404
3. Status check → `InvitationNotPendingError`
4. `sharingRepo.declineInvitation(invitation)`

**Done when**:
- [ ] Implemented and returns `void` (204 response)

---

### T23: Create `GetMyInvitationsService`

**What**: Returns all pending invitations for the authenticated user's email.
**Where**: `apps/api/src/app/modules/sharing/services/get-my-invitations/service.ts`
**Depends on**: T8
**Requirement**: SHARE-18, SHARE-35

Logic:
1. `userRepo.getById(userId)` — need email
2. `sharingRepo.getAllInvitationsByEmail(email)` — queries `INVITE_EMAIL#<email>` partition
3. Map to `InvitationDto[]` (enrich with `projectName`, `ownerName` from project/user lookups)

**Done when**:
- [ ] Returns `InvitationDto[]` with full enrichment
- [ ] Works for users with no invitations (empty array)

---

### T24: Create `GetProjectMembersService`

**What**: Returns owner + all active guests for a project.
**Where**: `apps/api/src/app/modules/sharing/services/get-project-members/service.ts`
**Depends on**: T19
**Requirement**: SHARE-24

Logic:
1. `requireRole(viewer)` — any member can list
2. `projectRepo.getById(resourceId, ownerUserId)` — get project with `members[]`
3. Get owner user info from `userRepo`
4. Combine owner as `MemberDto { role: "owner" }` + existing `members[]` guests
5. Return `MemberDto[]`

**Done when**:
- [ ] Owner always included first in result
- [ ] `members[]` undefined → treated as empty

---

### T25: Create `GetProjectInvitationsService`

**What**: Returns all invitations for a project (owner only).
**Where**: `apps/api/src/app/modules/sharing/services/get-project-invitations/service.ts`
**Depends on**: T19
**Requirement**: SHARE-30

Logic:
1. `requireRole(owner)` — only owner
2. `sharingRepo.getAllInvitationsByProject(projectId)` — queries `PROJECT#<id>` partition
3. Map to `InvitationDto[]`

**Done when**:
- [ ] Owner-only check enforced
- [ ] Returns invitations of all statuses (pending, accepted, declined)

---

### T26: Create `CancelInvitationService`

**What**: Soft-deletes a pending invitation across all 3 views.
**Where**: `apps/api/src/app/modules/sharing/services/cancel-invitation/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-31, SHARE-32

Logic:
1. `requireRole(owner)` on `projectId`
2. Find invitation via `getAllInvitationsByProject` + filter by `invitationId`
3. If status === "accepted" → 409 ("Cannot cancel an accepted invitation — use remove-member")
4. `sharingRepo.cancelInvitation(invitation)` — soft-delete across 3 views

**Done when**:
- [ ] Accepted invitation cancel blocked with correct error
- [ ] Soft-delete (sets `deleted_at`) not hard delete

---

### T27: Create `UpdateMemberRoleService`

**What**: Updates a guest's role in `BoardAccess` and project `members[]`.
**Where**: `apps/api/src/app/modules/sharing/services/update-member-role/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-25, SHARE-26

Logic:
1. `requireRole(owner)` on `projectId`
2. If `memberUserId === requesterId` → 400 ("Cannot change owner role")
3. `sharingRepo.getBoardAccess(...)` → 404 if no access
4. `projectRepo.getById` → fetch project for members[]
5. `sharingRepo.updateMemberRole({ boardAccess, newRole, project, updatedMembers })`

**Done when**:
- [ ] Self-role-change blocked
- [ ] Atomic update of BoardAccess + members[]

---

### T28: Create `RemoveMemberService`

**What**: Removes a guest from a project (self-remove or owner-removes).
**Where**: `apps/api/src/app/modules/sharing/services/remove-member/service.ts`
**Depends on**: T19, T15
**Requirement**: SHARE-27, SHARE-28, SHARE-29

Logic:
1. If `memberUserId === requesterId`: self-remove (any guest can do this) — `requireRole(viewer)` and skip ownership check
2. If `memberUserId !== requesterId`: owner-only — `requireRole(owner)`
3. `sharingRepo.getBoardAccess(...)` → 404 if not found
4. `projectRepo.getById` → fetch project
5. `sharingRepo.removeMember({ boardAccess, project, updatedMembers })`

**Done when**:
- [ ] Non-owner removing other member → 403
- [ ] Soft-delete of BoardAccess (sets `deleted_at`)
- [ ] Project `members[]` updated atomically

---

### T29: Create `UserSearchService`

**What**: Resolves a user by email, returns public profile or null.
**Where**: `apps/api/src/app/modules/sharing/services/user-search/service.ts`
**Depends on**: T8
**Requirement**: SHARE-33, SHARE-34

Logic:
1. `sharingRepo.getUserIdByEmail(email)` → null if not found
2. If found: `userRepo.getById(userId)` → return `{ id, name, email }`
3. If not found: return `{ user: null }`

**Done when**:
- [ ] Returns `UserSearchResponse` (user or null)
- [ ] Does not throw — unknown emails return null gracefully

---

### T30: Create `InviteToProjectController`

**What**: Controller for `POST /projects/{projectId}/invitations`.
**Where**: `apps/api/src/app/modules/sharing/controllers/invite-to-project/controller.ts`
**Depends on**: T20
**Requirement**: SHARE-11

- Validates body with Zod schema from `@repo/contracts/sharing/invite-to-project`
- Extracts `projectId` from path params, `userId` from JWT
- Returns 201 + `InvitationDto`

**Done when**:
- [ ] Extends `Controller<"private", InviteToProjectResponse>`
- [ ] Validates `{ email, role }` body
- [ ] `schema.ts` file co-located if controller needs local schema (or imports from contracts)

---

### T31: Create `GetProjectInvitationsController`

**What**: Controller for `GET /projects/{projectId}/invitations`.
**Where**: `apps/api/src/app/modules/sharing/controllers/get-project-invitations/controller.ts`
**Depends on**: T25
**Requirement**: SHARE-30

**Done when**:
- [ ] Extracts `projectId` from path, `userId` from JWT
- [ ] Returns 200 + `GetProjectInvitationsResponse`

---

### T32: Create `CancelInvitationController`

**What**: Controller for `DELETE /projects/{projectId}/invitations/{invitationId}`.
**Where**: `apps/api/src/app/modules/sharing/controllers/cancel-invitation/controller.ts`
**Depends on**: T26
**Requirement**: SHARE-31

**Done when**:
- [ ] Extracts both path params
- [ ] Returns 204 (no body)

---

### T33: Create `GetProjectMembersController`

**What**: Controller for `GET /projects/{projectId}/members`.
**Where**: `apps/api/src/app/modules/sharing/controllers/get-project-members/controller.ts`
**Depends on**: T24
**Requirement**: SHARE-24

**Done when**:
- [ ] Extracts `projectId`, `userId`
- [ ] Returns 200 + `GetProjectMembersResponse`

---

### T34: Create `UpdateMemberRoleController`

**What**: Controller for `PATCH /projects/{projectId}/members/{memberUserId}`.
**Where**: `apps/api/src/app/modules/sharing/controllers/update-member-role/controller.ts`
**Depends on**: T27
**Requirement**: SHARE-25

- Validates `{ role }` body with Zod from `@repo/contracts/sharing/update-member-role`

**Done when**:
- [ ] Extracts `projectId`, `memberUserId`, `userId`
- [ ] Returns 200 + `UpdateMemberRoleResponse`

---

### T35: Create `RemoveMemberController`

**What**: Controller for `DELETE /projects/{projectId}/members/{memberUserId}`.
**Where**: `apps/api/src/app/modules/sharing/controllers/remove-member/controller.ts`
**Depends on**: T28
**Requirement**: SHARE-27

**Done when**:
- [ ] Extracts both path params + `userId`
- [ ] Returns 204

---

### T36: Create `GetMyInvitationsController`

**What**: Controller for `GET /sharing/invitations`.
**Where**: `apps/api/src/app/modules/sharing/controllers/get-my-invitations/controller.ts`
**Depends on**: T23
**Requirement**: SHARE-18

**Done when**:
- [ ] Only uses `userId` from JWT (no path params)
- [ ] Returns 200 + `GetMyInvitationsResponse`

---

### T37: Create `AcceptInvitationController`

**What**: Controller for `POST /sharing/invitations/{invitationId}/accept`.
**Where**: `apps/api/src/app/modules/sharing/controllers/accept-invitation/controller.ts`
**Depends on**: T21
**Requirement**: SHARE-19

**Done when**:
- [ ] Extracts `invitationId` from path
- [ ] Returns 200 + shared project data

---

### T38: Create `DeclineInvitationController`

**What**: Controller for `POST /sharing/invitations/{invitationId}/decline`.
**Where**: `apps/api/src/app/modules/sharing/controllers/decline-invitation/controller.ts`
**Depends on**: T22
**Requirement**: SHARE-21

**Done when**:
- [ ] Extracts `invitationId` from path
- [ ] Returns 204

---

### T39: Create `UserSearchController`

**What**: Controller for `GET /users/search?email=<email>`.
**Where**: `apps/api/src/app/modules/sharing/controllers/user-search/controller.ts`
**Depends on**: T29
**Requirement**: SHARE-33

**Done when**:
- [ ] Extracts `email` from query params
- [ ] Returns 200 + `UserSearchResponse` (user or null — never 404)

---

### T40: Create service factories

**What**: 11 factory files (one per service), each wires dependencies via existing factories.
**Where**: `apps/api/src/factories/services/sharing/` (one file per service)

| File | Factory function |
|------|-----------------|
| `permission-service-factory.ts` | `makePermissionService()` |
| `invite-to-project-service-factory.ts` | `makeInviteToProjectService()` |
| `accept-invitation-service-factory.ts` | `makeAcceptInvitationService()` |
| `decline-invitation-service-factory.ts` | `makeDeclineInvitationService()` |
| `get-my-invitations-service-factory.ts` | `makeGetMyInvitationsService()` |
| `get-project-members-service-factory.ts` | `makeGetProjectMembersService()` |
| `get-project-invitations-service-factory.ts` | `makeGetProjectInvitationsService()` |
| `cancel-invitation-service-factory.ts` | `makeCancelInvitationService()` |
| `update-member-role-service-factory.ts` | `makeUpdateMemberRoleService()` |
| `remove-member-service-factory.ts` | `makeRemoveMemberService()` |
| `user-search-service-factory.ts` | `makeUserSearchService()` |

**Depends on**: All services (T19–T29), T14
**Requirement**: N/A (DI)

**Done when**:
- [ ] Each factory returns its interface type
- [ ] All inject `makeSharingRepository()` + existing repo factories

---

### T41: Create controller factories

**What**: 10 factory files (one per controller), each wires its service factory.
**Where**: `apps/api/src/factories/controllers/sharing/`

Same pattern as T40, one file per controller. Each `makeXController()` calls `makeXService()`.

**Depends on**: T40, all controllers (T30–T39)
**Requirement**: N/A (DI)

**Done when**:
- [ ] All 10 factories defined, return controller instances

---

### T42: Create Lambda handlers (10 functions)

**What**: Lambda handler files for all 10 new endpoints.
**Where**: `apps/api/src/server/functions/`

| Folder | Handler |
|--------|---------|
| `sharing/get-my-invitations/` | GET /sharing/invitations |
| `sharing/accept-invitation/` | POST /sharing/invitations/:id/accept |
| `sharing/decline-invitation/` | POST /sharing/invitations/:id/decline |
| `projects/invite-to-project/` | POST /projects/:id/invitations |
| `projects/get-project-invitations/` | GET /projects/:id/invitations |
| `projects/cancel-invitation/` | DELETE /projects/:id/invitations/:invId |
| `projects/get-project-members/` | GET /projects/:id/members |
| `projects/update-member-role/` | PATCH /projects/:id/members/:userId |
| `projects/remove-member/` | DELETE /projects/:id/members/:userId |
| `users/search/` | GET /users/search |

Each handler: `handler.ts` (`export const handler = lambdaHttpAdapter(makeXController())`) + `index.ts`.

**Depends on**: T41
**Requirement**: All SHARE API endpoints

**Done when**:
- [ ] All 10 handlers follow existing handler pattern
- [ ] `index.ts` re-exports `handler`

---

### T43: Add function entries to `serverless.yml`

**What**: Register 10 new Lambda functions + add `USER_EMAIL_LOOKUP` DynamoDB item type to CloudFormation if needed.
**Where**: `apps/api/serverless.yml`
**Depends on**: T42
**Requirement**: All SHARE endpoints

All functions use `CognitoAuthorizer`. Paths per design:
- `POST /projects/{projectId}/invitations`
- `GET /projects/{projectId}/invitations`
- `DELETE /projects/{projectId}/invitations/{invitationId}`
- `GET /projects/{projectId}/members`
- `PATCH /projects/{projectId}/members/{memberUserId}`
- `DELETE /projects/{projectId}/members/{memberUserId}`
- `GET /sharing/invitations`
- `POST /sharing/invitations/{invitationId}/accept`
- `POST /sharing/invitations/{invitationId}/decline`
- `GET /users/search`

**Done when**:
- [ ] All 10 functions declared with correct paths and authorizers
- [ ] Handler paths match T42 file locations
- [ ] No duplicate function names

---

### T44: Modify `GetProjectDetailService`

**What**: Add `IPermissionService` injection, use `ownerUserId` for repo call, add `role`/`isShared`/`members` to response.
**Where**: `apps/api/src/app/modules/projects/services/get-project-detail/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01, SHARE-09

```typescript
// Before:
const project = await this.projectRepo.getById(projectId, userId);

// After:
const { ownerUserId, effectiveRole } = await this.permissionService.requireRole({
  requesterId: userId, resourceType: "project", resourceId: projectId, requiredRole: "viewer",
});
const project = await this.projectRepo.getById(projectId, ownerUserId);
// Add role + isShared + members to ProjectDto response
```

**Done when**:
- [ ] `requireRole` called before repo access
- [ ] `ownerUserId` used for all repo calls
- [ ] Response includes `role`, `isShared: ownerUserId !== userId`, `memberCount: project.members?.length ?? 0`
- [ ] Factory updated to inject `IPermissionService`

---

### T45: Modify `GetAllSectionsByProjectService`

**What**: Same permission pattern as T44 — inject `IPermissionService`, use `ownerUserId`.
**Where**: `apps/api/src/app/modules/sections/services/get-all-sections/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01

**Done when**:
- [ ] `requireRole(viewer)` called; `ownerUserId` passed to section repo
- [ ] Factory updated

---

### T46: Modify `CreateTaskService`

**What**: Add permission check (`editor` required), use `ownerUserId`, add `created_by` field.
**Where**: `apps/api/src/app/modules/tasks/services/create-task/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01, A5 (`created_by` tracking)

**Done when**:
- [ ] `requireRole(editor)` enforced
- [ ] Task created with `created_by: userId` (the requester, not the owner)
- [ ] Task stored in owner's DynamoDB partition

---

### T47: Modify `UpdateTaskService`

**What**: Add `requireRole(editor)` + use `ownerUserId`.
**Where**: `apps/api/src/app/modules/tasks/services/update-task/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01

**Done when**:
- [ ] Permission check added; `ownerUserId` used for repo call

---

### T48: Modify `UpdateCompletionService`

**What**: Add `requireRole(editor)` + use `ownerUserId`.
**Where**: `apps/api/src/app/modules/tasks/services/update-completion/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01

**Done when**:
- [ ] Permission check added; factory updated

---

### T49: Modify `CreateSectionService`

**What**: Add `requireRole(editor)` + use `ownerUserId`.
**Where**: `apps/api/src/app/modules/sections/services/create-section/service.ts`
**Depends on**: T19
**Requirement**: SHARE-01

**Done when**:
- [ ] Permission check added; factory updated

---

### T50: Modify `GetAllProjectsByUserService`

**What**: Extend to return own + shared projects in a unified list.
**Where**: `apps/api/src/app/modules/projects/services/get-all-projects/service.ts`
**Depends on**: T19
**Requirement**: SHARE-07 through SHARE-10

Logic:
1. Own projects: `projectRepo.getAllProjectsByUser(requesterId)` → tag with `role: "owner", isShared: false`
2. Shared boards: `sharingRepo.getAllBoardAccessByGuest(requesterId)` → for each, `projectRepo.getById(resourceId, ownerUserId)` → tag with `role` from BoardAccess, `isShared: true`
3. Filter out any with `deleted_at` set on BoardAccess
4. Merge and return unified list

**Done when**:
- [ ] Both queries executed and results merged
- [ ] Deleted BoardAccess excluded
- [ ] `memberCount` populated for all projects
- [ ] Factory updated to inject `ISharingRepository`

---

### T51: Run typecheck + fix errors

**What**: Run `pnpm typecheck` across the full monorepo and resolve all TypeScript errors introduced by this feature.
**Where**: monorepo root
**Depends on**: T43, T50

```bash
pnpm typecheck
```

**Done when**:
- [ ] `pnpm typecheck` exits 0 with no errors
- [ ] No `any` casts added to silence errors — all types properly resolved

---

## Parallel Execution Map

```
Phase 0 (Sequential):
  T0

Phase 1 (Parallel after T0):
  T0 → T1 → T2 [P]
             T3 [P]
             T4 [P]
             T5 (waits T2, T3, T4)

Phase 2 (Parallel after T1):
  T1 → T6 [P]  T7 [P]  T8 [P]  T9 [P]  T10 [P]

Phase 3 (DynamoDB):
  T9 → T11 [P], T12 [P]
  T10, T11, T12 → T13 → T14

Phase 4 (Parallel after T6, T1):
  T15 [P]  T16 [P]  T17 [P]  T18 [P]
  T7, T8, T14 → T19

Phase 5 (Parallel after T19):
  T20 [P]  T21 [P]  T22 [P]  T23 [P]  T24 [P]
  T25 [P]  T26 [P]  T27 [P]  T28 [P]  T29 [P]

Phase 6 (Parallel, each after its service):
  T30 [P]  T31 [P]  T32 [P]  T33 [P]  T34 [P]
  T35 [P]  T36 [P]  T37 [P]  T38 [P]  T39 [P]
  T44 [P]  T45 [P]  T46 [P]  T47 [P]  T48 [P]  T49 [P]  T50 [P]

Phase 7 (Sequential):
  All Phase 6 → T40 → T41 → T42 → T43

Phase 8 (Final):
  T43, T50 → T51
```

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T0: UserEmailLookup write | 1 method change | ✅ |
| T1: types.ts | 1 file, 4 exports | ✅ |
| T2: 3 DTO files + barrel | 4 files, cohesive | ✅ |
| T3: 9 route contract folders | Grouped by purpose, all trivial | ✅ |
| T9: DynamoDB types | 5 interfaces, 1 file | ✅ |
| T11: BoardAccessMapper | 1 class, 2 methods | ✅ |
| T12: InvitationMapper | 1 class, 4 methods | ✅ |
| T13: SharingDynamoRepository | 1 class, 11 methods | ⚠️ Large but unified by design |
| T15: 7 error classes | All trivial, grouped | ✅ |
| T40: 11 service factories | Grouped DI wiring | ✅ |
| T41: 10 controller factories | Grouped DI wiring | ✅ |
| T42: 10 Lambda handlers | Grouped by pattern | ✅ |
