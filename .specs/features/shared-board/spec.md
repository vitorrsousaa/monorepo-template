# Shared Board Specification

## Problem Statement

O LifeOS é single-tenant por design — cada usuário só vê seus próprios dados (`PK = USER#userId`). Casais e grupos precisam colaborar em projetos compartilhados (ex: lista de compras, planejamento de viagem). Além disso, o sistema de compartilhamento será reutilizado no futuro pelo módulo de finanças, então a infra de permissões e convites **não pode ser acoplada a projetos/tasks**.

**Escopo do compartilhamento:** por **projeto inteiro**. Ao compartilhar um projeto, o guest vê **todas as tasks** daquele projeto. Não é possível compartilhar tasks individuais/soltas (inbox). Tasks da inbox são pessoais por design.

## Goals

- [ ] Permitir que o owner de um projeto convide outros usuários por email
- [ ] Guests acessam o projeto do owner com role `editor` ou `viewer`
- [ ] Modelo de permissões genérico (`IPermissionService`) reutilizável por módulos futuros (finanças)
- [ ] Infra de convites genérica (`IInvitationService`) com extensibilidade para notificação por email (SES) no futuro
- [ ] Backend completo — SPA fica para uma fase posterior

## Out of Scope

| Feature | Reason |
|---------|--------|
| Integração SPA (telas, modais, sidebar) | Será especificado separadamente após definição de UX |
| Envio de email de convite (SES/Resend) | Arquitetura pronta para plug-in, mas só notificação in-app por agora |
| Auto-vinculação de convites no signup | Convites pendentes ficam visíveis após criar conta, mas sem link automático signup→accept |
| Cascade delete de BoardAccess no delete-project | Será adicionado quando delete-project for implementado |
| Módulo de finanças | Apenas garantir que permissões e convites sejam genéricos o suficiente |
| Compartilhamento de tasks individuais (inbox) | Tasks soltas são pessoais por design; compartilhamento é por projeto inteiro |
| Tasks compartilhadas no Today/Upcoming do guest | Today/Upcoming são visão pessoal; tasks de projetos compartilhados só aparecem dentro do projeto. Pode ser adicionado como feature futura. |
| Real-time / WebSocket para notificações | Push notifications são futuro; polling ou refetch manual |

---

## User Stories

### P1: Verificação de permissão em projetos compartilhados ⭐ MVP

**User Story**: As an owner, I want the system to enforce access control on my projects so that only authorized guests can view or edit my data.

**Why P1**: Sem permissões, nenhuma outra feature de sharing funciona. É a fundação.

**Acceptance Criteria**:

1. WHEN a requester calls any project/task endpoint THEN the system SHALL resolve the requester's role (`owner`, `editor`, `viewer`) via `IPermissionService.requireRole()`
2. WHEN the requester is the project owner (`Project.userId === requesterId`) THEN the system SHALL return `{ ownerUserId: requesterId, effectiveRole: "owner" }`
3. WHEN the requester is a guest with a valid `BoardAccess` record THEN the system SHALL return `{ ownerUserId: boardAccess.ownerUserId, effectiveRole: boardAccess.role }`
4. WHEN the requester has no ownership or `BoardAccess` THEN the system SHALL throw `AppError("Forbidden", 403)`
5. WHEN the effective role is below the required role (hierarchy: viewer=0, editor=1, owner=2) THEN the system SHALL throw `AppError("Forbidden", 403)`
6. WHEN permission is granted THEN the service layer SHALL use `ownerUserId` (not `requesterId`) for all repository calls, so repos access the owner's DynamoDB partition transparently

**Independent Test**: Call `GET /projects/:id/detail` as a guest with a valid `BoardAccess(role=editor)` → returns project data. Call again without `BoardAccess` → returns 403.

**Requirement IDs**: SHARE-01 through SHARE-06

---

### P1: Listar projetos próprios + compartilhados ⭐ MVP

**User Story**: As a user, I want `GET /projects` to return both my own projects and projects shared with me so that I have a unified view.

**Why P1**: Ponto de entrada principal — sem isso o guest não vê os boards compartilhados.

**Acceptance Criteria**:

1. WHEN `GET /projects` is called THEN the system SHALL query own projects (`PK=USER#requesterId, SK begins_with PROJECT#`) AND shared projects (`PK=USER#requesterId, SK begins_with BOARD_ACCESS#` → fetch each project from owner's partition)
2. WHEN returning own projects THEN each SHALL include `role: "owner"`, `isShared: false`
3. WHEN returning shared projects THEN each SHALL include `role` from `BoardAccess`, `isShared: true`, `ownerName` from User entity, `memberCount`
4. WHEN a `BoardAccess` has `deleted_at` set THEN the system SHALL exclude that project from results

**Independent Test**: Create a `BoardAccess` for user B pointing to user A's project. `GET /projects` as user B → returns user A's project with `role: "editor"`, `isShared: true`.

**Requirement IDs**: SHARE-07 through SHARE-10

---

### P1: Convidar usuário para um projeto ⭐ MVP

**User Story**: As a project owner, I want to invite another user by email so that they can collaborate on my project.

**Why P1**: Sem convites, não há como adicionar guests.

**Acceptance Criteria**:

1. WHEN owner calls `POST /projects/:projectId/invitations` with `{ email, role }` THEN the system SHALL verify `requireRole(requesterId, projectId, "owner")`
2. WHEN the invited email already has access to the project (active `BoardAccess`) THEN the system SHALL return `409 Conflict`
3. WHEN a pending invitation already exists for that email+project THEN the system SHALL return `409 Conflict`
4. WHEN validation passes THEN the system SHALL create an `Invitation` with `status: "pending"`, `expires_at: now + 30 days` via atomic triple-write (guest view + owner view + project view)
5. WHEN the invited email belongs to an existing user THEN the system SHALL set `invited_user_id` on the invitation
6. WHEN the invited email does NOT belong to an existing user THEN the system SHALL create the invitation with `invited_user_id: null` and a comment/TODO for future email notification
7. WHEN invitation is created THEN the system SHALL return the `InvitationDto`

**Independent Test**: Owner calls `POST /projects/abc/invitations` with `{ email: "bob@test.com", role: "editor" }` → returns invitation with `status: "pending"`. Query DynamoDB → 3 items created atomically.

**Requirement IDs**: SHARE-11 through SHARE-17

---

### P1: Aceitar / Recusar convite ⭐ MVP

**User Story**: As an invited user, I want to accept or decline invitations so that I can choose which projects to join.

**Why P1**: Completa o fluxo mínimo de compartilhamento (convite → aceite → acesso).

**Acceptance Criteria**:

1. WHEN user calls `GET /sharing/invitations` THEN the system SHALL return all pending invitations for the user's email
2. WHEN user calls `POST /sharing/invitations/:id/accept` THEN the system SHALL atomically: update invitation status to `"accepted"` (all 3 views) + create `BoardAccess` + update project `members[]` array
3. WHEN user calls `POST /sharing/invitations/:id/decline` THEN the system SHALL update invitation status to `"declined"` across all views
4. WHEN the invitation does not exist or belongs to another email THEN the system SHALL return `404`
5. WHEN the invitation status is not `"pending"` THEN the system SHALL return `409 Conflict`
6. WHEN the invitation has expired (`expires_at < now`) THEN the system SHALL return `410 Gone`

**Independent Test**: Create invitation for bob@test.com → login as Bob → `GET /sharing/invitations` returns 1 invitation → `POST accept` → `GET /projects` now includes the shared project.

**Requirement IDs**: SHARE-18 through SHARE-23

---

### P2: Gerenciamento de membros

**User Story**: As a project owner, I want to manage members (list, change role, remove) so that I can control who has access and what they can do.

**Why P2**: Owner precisa gerenciar, mas o fluxo básico (convite + aceite) funciona sem isso.

**Acceptance Criteria**:

1. WHEN `GET /projects/:projectId/members` is called by any member THEN the system SHALL return owner + all active guests with their roles
2. WHEN `PATCH /projects/:projectId/members/:memberUserId` is called by the owner THEN the system SHALL update the guest's role in `BoardAccess` + project `members[]`
3. WHEN owner tries to change their own role THEN the system SHALL return `400 Bad Request`
4. WHEN `DELETE /projects/:projectId/members/:memberUserId` is called where `memberUserId === requesterId` THEN the system SHALL allow (guest leaves board) — soft-delete `BoardAccess` + remove from `members[]`
5. WHEN `DELETE /projects/:projectId/members/:memberUserId` is called by the owner for another user THEN the system SHALL remove that member
6. WHEN a non-owner tries to remove another member THEN the system SHALL return `403`

**Independent Test**: Owner lists members → sees 2 (self + guest). Changes guest from editor to viewer → `GET members` shows updated role. Guest calls self-remove → `GET /projects` no longer includes that board.

**Requirement IDs**: SHARE-24 through SHARE-29

---

### P2: Gerenciamento de convites pelo owner

**User Story**: As a project owner, I want to see and cancel pending invitations so that I can manage who I've invited.

**Why P2**: Complementar ao convite, mas não bloqueia o fluxo básico.

**Acceptance Criteria**:

1. WHEN `GET /projects/:projectId/invitations` is called by the owner THEN the system SHALL return all invitations for that project (pending, accepted, declined)
2. WHEN `DELETE /projects/:projectId/invitations/:invitationId` is called by the owner THEN the system SHALL soft-delete/cancel the invitation across all views
3. WHEN trying to cancel an already accepted invitation THEN the system SHALL return `409 Conflict` (use remove-member instead)

**Independent Test**: Owner invites bob@test.com → `GET invitations` returns 1 pending → `DELETE` cancels it → `GET invitations` returns 0 pending.

**Requirement IDs**: SHARE-30 through SHARE-32

---

### P2: Busca de usuário por email

**User Story**: As a project owner inviting someone, I want to search users by email so that I can confirm who I'm inviting.

**Why P2**: Melhora UX do convite, mas o convite funciona sem (aceita email direto).

**Acceptance Criteria**:

1. WHEN `GET /users/search?email=<exact-email>` is called THEN the system SHALL return the user's public profile (`id`, `name`, `email`) or `null`
2. WHEN no user exists with that email THEN the system SHALL return `{ user: null }`

**Independent Test**: `GET /users/search?email=alice@test.com` → returns `{ user: { id, name, email } }`. Unknown email → `{ user: null }`.

**Requirement IDs**: SHARE-33, SHARE-34

---

### P3: Visualização de convites pendentes por novo usuário

**User Story**: As a new user who just signed up, I want to see pending invitations sent to my email so that I can join boards that were shared before I had an account.

**Why P3**: Melhora onboarding de novos usuários convidados, mas não é bloqueador.

**Acceptance Criteria**:

1. WHEN a user calls `GET /sharing/invitations` THEN the system SHALL query by the user's email (not userId) via `INVITE_EMAIL#<email>` partition
2. WHEN invitations exist with `invited_user_id: null` for that email THEN the system SHALL return them as pending invitations

**Independent Test**: Create invitation for `new@test.com` (no account). Signup as `new@test.com` → `GET /sharing/invitations` → returns the pending invitation → can accept.

**Requirement IDs**: SHARE-35, SHARE-36

---

## Edge Cases

- WHEN owner invites their own email THEN system SHALL return `400 Bad Request` ("Cannot invite yourself")
- WHEN `BoardAccess` exists but the underlying project has `deleted_at` set THEN system SHALL exclude from `GET /projects` results and return `404` on direct access
- WHEN guest tries to access a project and their `BoardAccess` has `deleted_at` THEN system SHALL return `403`
- WHEN multiple invitations are accepted in rapid succession (race condition) THEN `TransactWriteItems` with condition expressions SHALL prevent duplicate `BoardAccess`
- WHEN the `members[]` array on a project reaches an unexpected size (>20) THEN system SHALL reject the invitation with `422` (safety valve — real limit is ~5 for personal app)
- WHEN an expired invitation is accepted THEN system SHALL return `410 Gone` and not create `BoardAccess`

---

## Architecture Decisions

### A1: Permission model decoupled from resource type

`IPermissionService` receives `(requesterId, resourceType, resourceId, requiredRole)` — not `projectId`. Internally it resolves via `BoardAccess` which stores `resourceType` + `resourceId`. For now, only `"project"` resource type exists. When finance module arrives, `"budget"` or `"account"` resource types use the same service.

**`ResourceType` is a shared enum in `@repo/contracts`** — single source of truth for API and SPA:

```typescript
// packages/contracts/src/sharing/types.ts
export const ResourceType = {
  PROJECT: "project",
  // BUDGET: "budget",  ← futuro, módulo de finanças
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];
```

**`IPermissionService` signature:**

```typescript
requireRole(
  requesterId: string,
  resourceType: ResourceType,
  resourceId: string,
  requiredRole: SharingRole
): Promise<PermissionResult>
```

The repository queries `PK=USER#guestUserId, SK=BOARD_ACCESS#<resourceType>#<resourceId>`.

### A2: Invitation service is composable

`InviteToProjectService` orchestrates:
1. `IPermissionService.requireRole()` — authorization
2. Validation (duplicate check, self-invite check)
3. `IInvitationRepository.createInvitation()` — persistence (triple-write)
4. **Future**: `INotificationService.notify()` — email via SES (not implemented yet, placeholder in code)

The invitation entity itself stores `resource_type` + `resource_id` instead of just `projectId`, making it reusable.

### A3: DynamoDB schema — lookup items instead of GSIs

Following doc 02's decision: no new GSIs. All access patterns solved via lookup items and dual/triple-write:
- User by email → `PK=USER_EMAIL#<email>, SK=METADATA`
- Invitations by guest email → `PK=INVITE_EMAIL#<email>, SK=INVITATION#<id>`
- Invitations by owner → `PK=USER#<ownerUserId>, SK=INVITATION#<id>`
- Invitations by project → `PK=PROJECT#<projectId>, SK=INVITATION#<status>#<id>`

### A4: Today/Upcoming não inclui tasks de projetos compartilhados

`GET /tasks/today` e `GET /tasks/upcoming` continuam buscando apenas na partição do usuário autenticado. Tasks de projetos compartilhados só são visíveis ao acessar o projeto diretamente. Isso evita N+1 queries (1 própria + N projetos compartilhados) e mantém o Today como dashboard pessoal. Pode ser adicionado como feature futura — a arquitetura com `BoardAccess` já tem a informação necessária para agregar.

### A5: Tasks em projetos compartilhados rastreiam o criador

Toda task criada em projeto compartilhado inclui `created_by: userId` (quem criou). Para tasks existentes (criadas antes do sharing), `created_by` é `null` ou igual ao `ownerUserId`. Isso habilita auditoria ("Bob adicionou essa task") e UX futura de atribuição.

### A6: Repos unchanged — service layer resolves ownerUserId

Repositories keep receiving `(userId, projectId)` as before. The service layer calls `IPermissionService` first, gets `ownerUserId`, and passes that to the repo. Zero changes to existing repository interfaces.

---

## DynamoDB Entities (New)

| Entity | PK | SK | Notes |
|--------|----|----|-------|
| BoardAccess | `USER#<guestUserId>` | `BOARD_ACCESS#<resourceType>#<resourceId>` | `resource_type` field added for genericity |
| Invitation (guest view) | `INVITE_EMAIL#<email>` | `INVITATION#<invitationId>` | Indexed by email for guest inbox |
| Invitation (owner view) | `USER#<ownerUserId>` | `INVITATION#<invitationId>` | Owner's sent invitations |
| Invitation (resource view) | `PROJECT#<resourceId>` | `INVITATION#<status>#<invitationId>` | Per-project invitation list |
| Project (modified) | `USER#<ownerUserId>` | `PROJECT#<projectId>` | New field: `members[]` array |

**Note**: `User` and `UserEmailLookup` entities already exist in the codebase.

---

## Requirement Traceability

| Requirement ID | Story | Status |
|----------------|-------|--------|
| SHARE-01..06 | P1: Verificação de permissão | Pending |
| SHARE-07..10 | P1: Listar projetos + compartilhados | Pending |
| SHARE-11..17 | P1: Convidar usuário | Pending |
| SHARE-18..23 | P1: Aceitar/Recusar convite | Pending |
| SHARE-24..29 | P2: Gerenciamento de membros | Pending |
| SHARE-30..32 | P2: Gerenciamento de convites | Pending |
| SHARE-33..34 | P2: Busca de usuário por email | Pending |
| SHARE-35..36 | P3: Convites para novos usuários | Pending |

**Coverage**: 36 requirements total, 0 mapped to tasks, 36 unmapped

---

## Success Criteria

- [ ] Owner convida guest por email → guest aceita → `GET /projects` do guest inclui o projeto com `role` correto
- [ ] Guest `editor` cria/edita/completa tasks no projeto do owner → dados persistem na partição do owner
- [ ] Guest `viewer` tenta criar task → recebe 403
- [ ] `IPermissionService` aceita `resourceType` como parâmetro — não é hard-coded para "project"
- [ ] Invitation triple-write é atômico (`TransactWriteItems`)
- [ ] Nenhum repositório existente tem sua interface alterada
- [ ] Nenhum novo GSI é adicionado ao DynamoDB
