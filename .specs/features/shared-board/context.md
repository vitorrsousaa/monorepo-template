# Shared Board Context

**Gathered:** 2026-04-01
**Spec:** `.specs/features/shared-board/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Backend completo para compartilhamento de projetos entre usuários. Owner convida guests por email com role (editor/viewer). Guests acessam o projeto do owner via permissões verificadas no service layer. Modelo genérico para reutilização em módulos futuros (finanças). SPA fica para fase posterior.

---

## Implementation Decisions

### Granularidade do compartilhamento

- Compartilhamento é **por projeto inteiro** — o guest vê todas as tasks do projeto compartilhado
- **Tasks individuais/soltas (inbox) não são compartilháveis** — a inbox é pessoal por design
- Se o casal quer colaborar em algo, cria um projeto compartilhado e coloca as tasks lá

### ResourceType como enum em contracts

- `ResourceType` é um **enum (const object) em `@repo/contracts/sharing/types.ts`** — single source of truth para API e SPA
- Começa com `PROJECT: "project"`, futuros módulos adicionam novos valores (ex: `BUDGET: "budget"`)
- `IPermissionService`, `BoardAccess`, e `Invitation` usam `ResourceType` no type system — nunca `string` genérico
- O SK do `BoardAccess` no DynamoDB inclui o `resourceType`: `BOARD_ACCESS#project#<projectId>`

### Notificações de convite

- **Sem envio de email (SES) por agora** — apenas notificação in-app (convites visíveis via `GET /sharing/invitations`)
- A arquitetura do service de convite deve ser **composável**: o orchestrator chama sub-services em sequência
- Deve existir um **placeholder/TODO** claro no código onde `INotificationService.notify()` será plugado no futuro
- Adicionar o SES no futuro deve ser apenas criar um service que implementa a interface e injetar no orchestrator

### Convites para usuários sem conta

- **Fora do escopo**: auto-vinculação no signup (signup detecta convites e aceita automaticamente)
- **No escopo**: convites pendentes ficam visíveis quando o usuário cria conta e chama `GET /sharing/invitations` (busca por email)
- O `Invitation` é criado com `invited_user_id: null` quando o email não pertence a nenhum usuário
- Deixar **comentários/TODOs** no código sobre o fluxo de auto-vinculação no signup para implementação futura

### Cascade delete

- **Não implementar** cascade delete de `BoardAccess` ao deletar projeto por agora
- Será adicionado quando a feature `delete-project` for implementada
- Deixar **TODO** no código referenciando essa dependência

### Today/Upcoming e tasks compartilhadas

- Tasks de projetos compartilhados **NÃO aparecem** no Today/Upcoming do guest
- Today/Upcoming continuam sendo a visão pessoal do usuário — apenas tasks da sua própria partição
- Tasks compartilhadas só são visíveis ao acessar o projeto diretamente
- Motivo: evitar N+1 queries e manter o Today como dashboard pessoal
- Pode ser adicionado como feature futura sem mudanças na arquitetura de sharing

### Rastreamento do criador da task

- Tasks criadas em projetos compartilhados incluem campo `created_by: userId` (quem criou)
- Para tasks existentes (pré-sharing), `created_by` será `null` ou igual ao `ownerUserId`
- Habilita auditoria ("Bob adicionou essa task") e UX futura de atribuição

### Agent's Discretion

- Estrutura interna de pastas/módulos no API (seguir padrões existentes)
- Naming de erros customizados (seguir convenção do codebase)
- Organização dos mappers DynamoDB → domain → DTO

---

## Specific References

- Docs de referência originais: `novas-features/01` a `07` (parcialmente desatualizados mas úteis para schema DynamoDB e fluxos)
- Pattern de repo DynamoDB: `apps/api/src/infra/db/dynamodb/repositories/projects/`
- Pattern de service: `apps/api/src/app/modules/`
- Pattern de contracts: `packages/contracts/src/` (entities/ + route folders com schema.ts + output.ts)

---

## Deferred Ideas

- Envio de email de convite via SES/Resend (placeholder na arquitetura)
- Auto-vinculação de convites pendentes no `SignupService`
- Compartilhamento de tasks individuais (inbox) via `ResourceType.TASK`
- Módulo de finanças reutilizando `ResourceType.BUDGET`
- Real-time notifications via WebSocket
- Cascade delete de BoardAccess no delete-project
