Context

 O modulo de tasks esta quase funcional mas faltam 3 pecas para uso basico: Today view no SPA (API ja
 existe), recorrencia (UI pronta mas backend zerado), e edicao de tasks (nao existe). Apos fechar tasks,
 o usuario quer implementar compartilhamento de projetos/tasks (ja tem design docs em novas-features/) e
 depois iniciar um modulo financeiro pessoal (transacoes + categorias).

 ---
 Phase 1 — Fechar Tasks Basico

 1.1 Today View (SPA wiring)

 O endpoint GET /tasks/today ja existe e retorna GetTodayTasksResponse (tasks agrupadas por projeto).
 Falta conectar o SPA.

 Arquivos a criar/modificar:
 - apps/spa/src/modules/tasks/app/services/get-today.ts — service chamando GET /tasks/today
 - apps/spa/src/modules/tasks/app/hooks/use-get-today-tasks.ts — hook useQuery
 - apps/spa/src/view/pages/app/todo/today.tsx — page component (ja existe, precisa wiring com hook real)
 - apps/spa/src/app/config/query-keys.ts — ja tem TASKS.TODAY

 Reusar:
 - Pattern de use-get-inbox-tasks.ts para o hook
 - Pattern de get-inbox.ts para o service
 - inbox-task-card.tsx para renderizar tasks (ou criar today-task-card se layout diferir)

 1.2 Recorrencia (Backend)

 UI do form ja esta pronta (recurrence-panel.tsx, format-recurrence-preview.ts). Precisa:

 Contracts (packages/contracts/src/tasks/):
 - Adicionar campos de recorrencia ao TaskDto em entities/index.ts: isRecurring, recurrenceRule (objeto
 com frequency, weeklyDays, endType, endDate, endCount)
 - Adicionar campos ao createTaskSchema em create/schema.ts

 API Domain (apps/api/src/core/domain/task/task.ts):
 - Adicionar campos: isRecurring, recurrenceRule

 API DynamoDB:
 - apps/api/src/infra/db/dynamodb/mappers/tasks/task-mapper.ts — mapear campos de recorrencia
 - apps/api/src/infra/db/dynamodb/mappers/tasks/types.ts — adicionar campos ao DynamoDB entity type

 API Service:
 - apps/api/src/app/modules/tasks/services/create/service.ts — persistir recorrencia
 - apps/api/src/app/modules/tasks/mappers/task-to-dto.ts — incluir recorrencia no DTO

 SPA Mapper:
 - apps/spa/src/modules/tasks/app/mappers/create-tasks.ts — parar de dropar recurrence, enviar ao API

 Nota: Nesta fase, recorrencia e apenas metadata armazenada na task. A geracao automatica de instancias
 recorrentes (cron/trigger) e uma fase futura — o importante agora e persistir a regra e exibi-la.

 1.3 Edicao de Task

 Contracts (packages/contracts/src/tasks/):
 - Criar update/schema.ts — Zod schema para PATCH (campos parciais: title, description, dueDate,
 priority, projectId, sectionId, recurrenceRule)
 - Criar update/input.ts, update/output.ts, update/index.ts

 API:
 - Controller: apps/api/src/app/modules/tasks/controllers/update/ (PATCH /tasks/{taskId})
 - Service: apps/api/src/app/modules/tasks/services/update/ — busca task, valida ownership, aplica
 partial update
 - Repository: adicionar metodo update() ao tasks-dynamo-repository.ts e interface ITodoRepository
 - Handler: apps/api/src/server/functions/tasks/update-task/index.ts
 - serverless.yml: adicionar rota PATCH /tasks/{taskId}

 SPA:
 - Service: apps/spa/src/modules/tasks/app/services/update-task.ts
 - Hook: apps/spa/src/modules/tasks/app/hooks/use-update-task.ts
 - Mapper: apps/spa/src/modules/tasks/app/mappers/update-task.ts
 - Modal: apps/spa/src/modules/tasks/view/modals/edit-task-modal.tsx (ja existe, precisa wiring)

 ---
 
 Fase 2
 
 Compartilhamento de tasks