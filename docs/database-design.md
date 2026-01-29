# Design de Banco de Dados - Artemis (DynamoDB)

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Entidades Principais](#entidades-principais)
3. [Relacionamentos](#relacionamentos)
4. [Rotas da Aplicação](#rotas-da-aplicação)
5. [Métodos de Busca Necessários](#métodos-de-busca-necessários)
6. [Estrutura DynamoDB](#estrutura-dynamodb)
7. [Padrões de Acesso](#padrões-de-acesso)
8. [Soft Delete](#soft-delete)
9. [Tarefas Recorrentes (Recurring Tasks)](#tarefas-recorrentes-recurring-tasks)

---

## Visão Geral

A aplicação Artemis é um sistema de gerenciamento de tarefas (todo) e metas (goals) que permite aos usuários organizar suas atividades em projetos, com suporte a seções, tags, prioridades e datas de vencimento. O sistema será multi-tenant, onde cada usuário terá seus próprios dados isolados.

---

## Entidades Principais

### 1. User (Usuário)

**Descrição**: Representa um usuário do sistema. Futuramente será usado para autenticação e isolamento de dados.

**Propriedades**:

- `id` (string, PK): Identificador único do usuário
- `email` (string): Email do usuário (único)
- `name` (string): Nome completo do usuário
- `passwordHash` (string): Hash da senha (futuro)
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 2. Project (Projeto/Grupo)

**Descrição**: Representa um projeto ou grupo de contexto para organizar tarefas. Equivalente a "Groups" no documento de ideias.

**Propriedades**:

- `id` (string): Identificador único do projeto
- `userId` (string): ID do usuário proprietário (FK)
- `name` (string): Nome do projeto
- `description` (string, opcional): Descrição do projeto
- `emoji` (string, opcional): Emoji/ícone do projeto
- `color` (string, opcional): Cor do projeto
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 3. Section (Seção)

**Descrição**: Representa uma seção dentro de um projeto (ex: Backlog, In Progress, Review, Done). Usado para organizar tarefas em colunas/estados.

**Propriedades**:

- `id` (string): Identificador único da seção
- `projectId` (string): ID do projeto (FK)
- `userId` (string): ID do usuário proprietário (FK)
- `name` (string): Nome da seção (ex: "Backlog", "In Progress")
- `order` (number): Ordem de exibição da seção
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 4. Todo/Task (Tarefa)

**Descrição**: A entidade central do sistema. Representa uma tarefa que pode estar associada a um projeto, seção, meta e tags.

**Propriedades**:

- `id` (string): Identificador único da tarefa
- `userId` (string): ID do usuário proprietário (FK)
- `title` (string): Título da tarefa
- `description` (string, opcional): Descrição detalhada
- `completed` (boolean): Status de conclusão
- `completedAt` (ISO8601, opcional): Data de conclusão
- `projectId` (string, opcional): ID do projeto (FK)
- `sectionId` (string, opcional): ID da seção (FK)
- `goalId` (string, opcional): ID da meta associada (FK)
- `priority` (string): Prioridade (low, medium, high)
- `dueDate` (ISO8601, opcional): Data de vencimento
- `order` (number, opcional): Ordem dentro da seção/projeto
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

**Campos adicionais observados no código**:

- `tags` (array de strings, opcional): Tags/labels da tarefa
- `comments` (number, opcional): Contador de comentários

**Campos para Tarefas Recorrentes**:

- `isRecurring` (boolean): Indica se a tarefa é recorrente
- `recurrenceTemplateId` (string, opcional): ID do template de recorrência (FK para RecurrenceTemplate)
- `parentTodoId` (string, opcional): ID da tarefa pai (para tarefas geradas automaticamente)
- `recurrenceSequence` (number, opcional): Número da sequência (1, 2, 3...) para tarefas geradas

---

### 5. Goal (Meta)

**Descrição**: Representa uma meta de longo prazo que pode ter tarefas associadas para rastrear progresso.

**Propriedades**:

- `id` (string): Identificador único da meta
- `userId` (string): ID do usuário proprietário (FK)
- `name` (string): Nome da meta
- `description` (string, opcional): Descrição da meta
- `targetValue` (number, opcional): Valor alvo (para metas quantitativas)
- `deadline` (ISO8601, opcional): Prazo final da meta
- `progress` (number): Progresso calculado (0-100)
- `tasks` (number): Total de tarefas associadas (calculado)
- `pending` (number): Tarefas pendentes (calculado)
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 6. Tag (Tag/Label)

**Descrição**: Representa uma tag ou label que pode ser associada a tarefas para categorização.

**Propriedades**:

- `id` (string): Identificador único da tag
- `userId` (string): ID do usuário proprietário (FK)
- `name` (string): Nome da tag
- `color` (string, opcional): Cor da tag
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 7. TodoTag (Associação Todo-Tag)

**Descrição**: Tabela de associação muitos-para-muitos entre Todo e Tag.

**Propriedades**:

- `todoId` (string): ID da tarefa (FK)
- `tagId` (string): ID da tag (FK)
- `userId` (string): ID do usuário (FK)

---

### 8. Comment (Comentário)

**Descrição**: Comentários associados a tarefas.

**Propriedades**:

- `id` (string): Identificador único do comentário
- `todoId` (string): ID da tarefa (FK)
- `userId` (string): ID do usuário que criou (FK)
- `content` (string): Conteúdo do comentário
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

---

### 9. RecurrenceTemplate (Template de Recorrência)

**Descrição**: Define as regras de recorrência para tarefas. Armazena a configuração de recorrência que será usada para gerar novas instâncias da tarefa.

**Propriedades**:

- `id` (string): Identificador único do template
- `userId` (string): ID do usuário proprietário (FK)
- `todoId` (string): ID da tarefa original que criou este template (FK)
- `recurrenceType` (string): Tipo de recorrência (`daily`, `weekly`, `biweekly`, `monthly`, `custom`)
- `recurrenceInterval` (number): Intervalo da recorrência (ex: 15 para "a cada 15 dias")
- `recurrenceUnit` (string): Unidade do intervalo (`days`, `weeks`, `months`)
- `recurrenceEndDate` (ISO8601, opcional): Data final da recorrência (null = sem fim)
- `recurrenceCount` (number, opcional): Número máximo de ocorrências (null = ilimitado)
- `recurrenceDaysOfWeek` (array de numbers, opcional): Dias da semana (0=domingo, 6=sábado) para recorrência semanal
- `recurrenceDayOfMonth` (number, opcional): Dia do mês (1-31) para recorrência mensal
- `lastGeneratedDate` (ISO8601, opcional): Data da última tarefa gerada
- `isActive` (boolean): Se o template está ativo (pode ser pausado)
- `deletedAt` (ISO8601, opcional): Data de exclusão (soft delete)
- `createdAt` (ISO8601): Data de criação
- `updatedAt` (ISO8601): Data da última atualização

**Exemplos de configuração**:

- A cada 15 dias: `recurrenceType: "custom"`, `recurrenceInterval: 15`, `recurrenceUnit: "days"`
- Toda segunda-feira: `recurrenceType: "weekly"`, `recurrenceDaysOfWeek: [1]`
- Todo dia 1º do mês: `recurrenceType: "monthly"`, `recurrenceDayOfMonth: 1`
- Diariamente: `recurrenceType: "daily"`, `recurrenceInterval: 1`, `recurrenceUnit: "days"`

---

## Relacionamentos

```
User (1) ──< (N) Project
User (1) ──< (N) Todo
User (1) ──< (N) Goal
User (1) ──< (N) Tag
User (1) ──< (N) Section
User (1) ──< (N) RecurrenceTemplate

Project (1) ──< (N) Section
Project (1) ──< (N) Todo

Section (1) ──< (N) Todo

Goal (1) ──< (N) Todo

Todo (N) ──< (N) Tag (via TodoTag)

Todo (1) ──< (N) Comment

RecurrenceTemplate (1) ──< (N) Todo (tarefas geradas)
Todo (1) ──< (1) RecurrenceTemplate (tarefa original)
Todo (1) ──< (N) Todo (tarefa pai → tarefas filhas geradas)
```

**Resumo dos relacionamentos**:

- Um usuário pode ter múltiplos projetos, tarefas, metas, tags, seções e templates de recorrência
- Um projeto pode ter múltiplas seções e tarefas
- Uma seção pertence a um projeto e pode ter múltiplas tarefas
- Uma tarefa pode pertencer a um projeto (opcional), uma seção (opcional), uma meta (opcional)
- Uma tarefa pode ter múltiplas tags (relacionamento muitos-para-muitos)
- Uma tarefa pode ter múltiplos comentários
- Uma meta pode ter múltiplas tarefas associadas
- **Recorrência**: Um template de recorrência gera múltiplas tarefas. A tarefa original referencia o template. Tarefas geradas referenciam a tarefa pai (parentTodoId)

---

## Rotas da Aplicação

### Autenticação

- `POST /auth/signin` - Login do usuário
- `POST /auth/signup` - Registro de novo usuário
- `GET /auth/google/callback` - Callback OAuth Google

### Todo (Tarefas)

- `GET /todo/dashboard` - Dashboard principal com estatísticas
- `GET /todo/inbox` - Lista de tarefas sem projeto
- `GET /todo/today` - Tarefas do dia atual
- `GET /todo/upcoming` - Tarefas futuras (não implementado ainda)
- `GET /todo/completed` - Tarefas concluídas (não implementado ainda)
- `GET /todo/projects/:id` - Detalhes de um projeto com tarefas por seção
- `POST /todo` - Criar nova tarefa
- `PUT /todo/:id` - Atualizar tarefa
- `DELETE /todo/:id` - Deletar tarefa (soft delete)
- `POST /todo/:id/restore` - Restaurar tarefa deletada
- `DELETE /todo/:id/permanent` - Deletar tarefa permanentemente (hard delete)
- `PATCH /todo/:id/complete` - Marcar tarefa como completa/incompleta

### Projects (Projetos)

- `GET /projects` - Listar todos os projetos do usuário
- `GET /projects/:id` - Obter detalhes de um projeto
- `POST /projects` - Criar novo projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Deletar projeto (soft delete)
- `POST /projects/:id/restore` - Restaurar projeto deletado
- `DELETE /projects/:id/permanent` - Deletar projeto permanentemente (hard delete)

### Sections (Seções)

- `GET /projects/:projectId/sections` - Listar seções de um projeto
- `POST /projects/:projectId/sections` - Criar nova seção
- `PUT /sections/:id` - Atualizar seção
- `DELETE /sections/:id` - Deletar seção (soft delete)
- `POST /sections/:id/restore` - Restaurar seção deletada
- `DELETE /sections/:id/permanent` - Deletar seção permanentemente (hard delete)
- `PATCH /sections/:id/reorder` - Reordenar seções

### Goals (Metas)

- `GET /goals/dashboard` - Dashboard de metas
- `GET /goals` - Listar todas as metas do usuário
- `GET /goals/:id` - Obter detalhes de uma meta
- `POST /goals` - Criar nova meta
- `PUT /goals/:id` - Atualizar meta
- `DELETE /goals/:id` - Deletar meta (soft delete)
- `POST /goals/:id/restore` - Restaurar meta deletada
- `DELETE /goals/:id/permanent` - Deletar meta permanentemente (hard delete)

### Tags

- `GET /tags` - Listar todas as tags do usuário
- `POST /tags` - Criar nova tag
- `PUT /tags/:id` - Atualizar tag
- `DELETE /tags/:id` - Deletar tag (soft delete)
- `POST /tags/:id/restore` - Restaurar tag deletada
- `DELETE /tags/:id/permanent` - Deletar tag permanentemente (hard delete)

### Comments

- `GET /todo/:todoId/comments` - Listar comentários de uma tarefa
- `POST /todo/:todoId/comments` - Criar comentário
- `PUT /comments/:id` - Atualizar comentário
- `DELETE /comments/:id` - Deletar comentário (soft delete)
- `POST /comments/:id/restore` - Restaurar comentário deletado
- `DELETE /comments/:id/permanent` - Deletar comentário permanentemente (hard delete)

### Trash (Lixeira)

- `GET /trash` - Listar todos os itens deletados do usuário
- `GET /trash/projects` - Listar projetos deletados
- `GET /trash/todos` - Listar tarefas deletadas
- `GET /trash/goals` - Listar metas deletadas
- `POST /trash/empty` - Limpar lixeira (hard delete de todos os itens deletados)

### Recurrence (Recorrência)

- `GET /todo/:todoId/recurrence` - Obter template de recorrência de uma tarefa
- `POST /todo/:todoId/recurrence` - Criar/atualizar template de recorrência
- `DELETE /todo/:todoId/recurrence` - Remover recorrência de uma tarefa
- `POST /recurrence/:id/pause` - Pausar recorrência
- `POST /recurrence/:id/resume` - Retomar recorrência
- `GET /todo/:todoId/recurrence/history` - Listar histórico de tarefas geradas

---

## Métodos de Busca Necessários

### 1. Buscar Projetos do Usuário

**Descrição**: Listar todos os projetos de um usuário, possivelmente ordenados por nome ou data de criação.

**Query**:

- KeyCondition: `PK = USER#userId AND SK begins_with PROJECT#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir**
- Ordenação: Por `name` (alfabética) ou `createdAt` (mais recente primeiro)

**Nota**: Esta query **automaticamente exclui** projetos deletados. Para listar deletados, usar endpoint `/trash/projects`.

---

### 2. Buscar Projeto com Tarefas por Seção

**Descrição**: Obter um projeto específico com todas as suas tarefas agrupadas por seção. Usado na página de detalhes do projeto.

**Query**:

- Projeto: `PK = USER#userId AND SK = PROJECT#projectId` (GetItem - pode retornar deletado para permitir restauração)
- Seções: `PK = USER#userId#PROJECT#projectId AND SK begins_with SECTION#` + `FilterExpression: attribute_not_exists(deletedAt)`
- Tarefas: `GSI3PK = USER#userId#PROJECT#projectId#SECTION#sectionId` + `FilterExpression: attribute_not_exists(deletedAt)` (ordenadas por `order`)

**Nota**: Seções e tarefas são **automaticamente filtradas** para excluir deletados. O projeto pode ser retornado mesmo se deletado (para mostrar opção de restaurar).

---

### 3. Buscar Tarefas do Dia (Today)

**Descrição**: Listar todas as tarefas com `dueDate` igual à data atual, agrupadas por projeto.

**Query**:

- GSI1: `GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD AND GSI1SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt) AND completed = false` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `priority` (high > medium > low) e depois por `dueDate`

**Nota**: Tarefas deletadas são **automaticamente excluídas** desta lista.

---

### 4. Buscar Tarefas da Inbox

**Descrição**: Listar tarefas sem projeto (`projectId IS NULL`).

**Query**:

- KeyCondition: `PK = USER#userId AND SK begins_with TODO#INBOX#`
- FilterExpression: `attribute_not_exists(deletedAt) AND completed = false` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `createdAt` (mais recente primeiro) ou `priority`

**Nota**: Tarefas deletadas são **automaticamente excluídas** da inbox.

---

### 5. Buscar Tarefas Futuras (Upcoming)

**Descrição**: Listar tarefas com `dueDate` maior que hoje.

**Query**:

- No DynamoDB, a **partition key exige igualdade** — não é possível usar `begins_with` em PK. O GSI1 está definido com `GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD` (uma partição por data).
- **Opções**:
  1. **Múltiplas queries**: Para cada data futura (hoje+1, hoje+2, … até um horizonte), executar `GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD` e `GSI1SK begins_with TODO#PENDING#`. Agrupar resultados e ordenar por `dueDate`.
  2. **GSI alternativo** (se Upcoming for muito usado): Criar um índice com `GSI1PK = USER#userId` e `GSI1SK = DUE_DATE#YYYY-MM-DD#TODO#...` para permitir uma única query com `SK > DUE_DATE#hoje`.
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir**
- Ordenação: Por `dueDate` (ascendente)

**Nota**: Tarefas deletadas são **automaticamente excluídas**.

---

### 6. Buscar Tarefas Concluídas

**Descrição**: Listar tarefas marcadas como concluídas.

**Query**:

- GSI4: `GSI4PK = USER#userId#COMPLETED#COMPLETED`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `completedAt` (mais recente primeiro)

**Nota**: Tarefas deletadas são **automaticamente excluídas**, mesmo que estejam concluídas.

---

### 7. Buscar Tarefas por Projeto

**Descrição**: Listar todas as tarefas de um projeto específico.

**Query**:

- KeyCondition: `PK = USER#userId#PROJECT#projectId AND SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `sectionId` (ordem da seção) e depois por `order` dentro da seção

**Nota**: Tarefas deletadas são **automaticamente excluídas**.

---

### 8. Buscar Tarefas por Meta

**Descrição**: Listar todas as tarefas associadas a uma meta.

**Query**:

- GSI2: `GSI2PK = USER#userId#GOAL#goalId AND GSI2SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `dueDate` ou `priority`

**Nota**: Tarefas deletadas são **automaticamente excluídas**.

---

### 9. Buscar Tarefas por Prioridade

**Descrição**: Filtrar tarefas por nível de prioridade.

**Query**:

- GSI4: `GSI4PK = USER#userId#COMPLETED#PENDING`
- FilterExpression: `attribute_not_exists(deletedAt) AND priority = :priority` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `dueDate` (ascendente)

**Nota**: Tarefas deletadas são **automaticamente excluídas**.

---

### 10. Buscar Tarefas por Tag

**Descrição**: Listar tarefas que possuem uma tag específica.

**Query**:

- GSI5: `GSI5PK = USER#userId#TAG#tagId AND GSI5SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `dueDate`

**Nota**: Tarefas deletadas são **automaticamente excluídas**, mesmo que tenham a tag.

---

### 11. Buscar Metas do Usuário

**Descrição**: Listar todas as metas de um usuário.

**Query**:

- KeyCondition: `PK = USER#userId AND SK begins_with GOAL#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `deadline` (ascendente) ou `createdAt` (mais recente primeiro)

**Nota**: Metas deletadas são **automaticamente excluídas**.

---

### 12. Buscar Meta com Tarefas

**Descrição**: Obter uma meta específica com todas as suas tarefas associadas.

**Query**:

- Meta: `PK = USER#userId AND SK = GOAL#goalId` (GetItem - pode retornar deletado)
- Tarefas: `GSI2PK = USER#userId#GOAL#goalId` + `FilterExpression: attribute_not_exists(deletedAt)`

**Nota**: A meta pode ser retornada mesmo se deletada (para permitir restauração), mas as tarefas são **automaticamente filtradas**.

---

### 13. Buscar Seções de um Projeto

**Descrição**: Listar todas as seções de um projeto ordenadas.

**Query**:

- KeyCondition: `PK = USER#userId#PROJECT#projectId AND SK begins_with SECTION#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `order` (ascendente)

**Nota**: Seções deletadas são **automaticamente excluídas**.

---

### 14. Buscar Tags do Usuário

**Descrição**: Listar todas as tags criadas por um usuário.

**Query**:

- KeyCondition: `PK = USER#userId AND SK begins_with TAG#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `name` (alfabética)

**Nota**: Tags deletadas são **automaticamente excluídas**.

---

### 15. Buscar Comentários de uma Tarefa

**Descrição**: Listar comentários de uma tarefa específica.

**Query**:

- KeyCondition: `PK = USER#userId#TODO#todoId AND SK begins_with COMMENT#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `createdAt` (mais antigo primeiro)

**Nota**: Comentários deletados são **automaticamente excluídos**.

---

### 16. Buscar Estatísticas do Dashboard

**Descrição**: Agregar dados para o dashboard (total de tarefas completas, em progresso, hoje, etc.).

**Queries** (todas com `FilterExpression: attribute_not_exists(deletedAt)`):

- Total completas: GSI4 `GSI4PK = USER#userId#COMPLETED#COMPLETED` + filtro deletedAt
- Total em progresso: GSI4 `GSI4PK = USER#userId#COMPLETED#PENDING` + filtro deletedAt
- Total hoje: GSI1 `GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD` + filtro deletedAt
- Total de projetos: `PK = USER#userId AND SK begins_with PROJECT#` + filtro deletedAt

**Nota**: Todas as estatísticas **automaticamente excluem** itens deletados.

---

### 17. Buscar Tarefas com Filtros Múltiplos

**Descrição**: Buscar tarefas com múltiplos filtros (projeto, seção, prioridade, data, tags).

**Query**: Combinar filtros conforme necessário, **sempre incluindo** `attribute_not_exists(deletedAt)`

**Exemplos**:

- Projeto + Seção: GSI3 `GSI3PK = USER#userId#PROJECT#projectId#SECTION#sectionId` + `FilterExpression: attribute_not_exists(deletedAt)`
- Projeto + Prioridade: `PK = USER#userId#PROJECT#projectId` + `FilterExpression: attribute_not_exists(deletedAt) AND priority = :priority`
- Data + Prioridade: GSI1 `GSI1PK = USER#userId#DUE_DATE#date` + `FilterExpression: attribute_not_exists(deletedAt) AND priority = :priority`

**Nota**: **SEMPRE** incluir `attribute_not_exists(deletedAt)` em todos os filtros múltiplos.

---

### 18. Buscar Template de Recorrência de uma Tarefa

**Descrição**: Obter o template de recorrência associado a uma tarefa.

**Query**:

- KeyCondition: `PK = USER#userId AND SK = RECURRENCE#recurrenceTemplateId`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**

**Nota**: Usar quando uma tarefa tem `isRecurring: true` e `recurrenceTemplateId` definido.

---

### 19. Buscar Todas as Instâncias de uma Recorrência

**Descrição**: Listar todas as tarefas geradas por um template de recorrência.

**Query**:

- GSI7: `GSI7PK = USER#userId#RECURRENCE#recurrenceTemplateId AND GSI7SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `dueDate` (ascendente)

**Nota**: Útil para mostrar histórico de uma tarefa recorrente.

---

### 20. Buscar Tarefas Filhas de uma Tarefa Pai

**Descrição**: Listar todas as tarefas geradas a partir de uma tarefa recorrente original.

**Query**:

- GSI8: `GSI8PK = USER#userId#PARENT#parentTodoId AND GSI8SK begins_with TODO#`
- FilterExpression: `attribute_not_exists(deletedAt)` ← **SEMPRE incluir deletedAt**
- Ordenação: Por `recurrenceSequence` (ascendente)

**Nota**: Mostra a sequência completa de tarefas geradas.

---

### 21. Buscar Todas as Tarefas Recorrentes do Usuário

**Descrição**: Listar todas as tarefas que são recorrentes (originais ou geradas).

**Query**:

- **Limitação**: Tarefas em projeto têm `PK = USER#userId#PROJECT#projectId`, não `USER#userId`. Uma query `PK = USER#userId AND SK begins_with TODO#` **só retorna tarefas da Inbox** (que usam `USER#userId`).
- **Opções**:
  1. **Inbox apenas**: `PK = USER#userId AND SK begins_with TODO#INBOX#` + FilterExpression `attribute_not_exists(deletedAt) AND isRecurring = true`.
  2. **Todas (inbox + projetos)**: Usar **GSI7** (por template) — listar todos os `RECURRENCE#` do usuário e, para cada template, query GSI7 `GSI7PK = USER#userId#RECURRENCE#recurrenceTemplateId`; depois, para tarefas filhas, usar **GSI8** por `parentTodoId`. Ou criar um **GSI** com PK = `USER#userId` e SK contendo tipo/status para agregar todas as tarefas do usuário (se esse acesso for frequente).

**Nota**: Útil para dashboard ou configurações de recorrência.

---

### 22. Buscar Templates de Recorrência Ativos

**Descrição**: Listar todos os templates de recorrência ativos do usuário.

**Query**:

- KeyCondition: `PK = USER#userId AND SK begins_with RECURRENCE#`
- FilterExpression: `attribute_not_exists(deletedAt) AND isActive = :true` ← **SEMPRE incluir deletedAt**

**Nota**: Útil para gerenciar recorrências ativas.

---

## Estrutura DynamoDB

### Estratégia de Modelagem

O DynamoDB é um banco NoSQL que requer um design cuidadoso das chaves primárias (PK) e de classificação (SK), além de Global Secondary Indexes (GSI) para suportar diferentes padrões de acesso.

**Princípios**:

1. **Isolamento por usuário**: Todas as entidades terão `userId` como parte da chave primária. **Todas as tasks são sempre buscadas pelo usuário** — a PK inclui `USER#userId` (inbox) ou `USER#userId#PROJECT#projectId` (tarefa em projeto), nunca apenas o id da tarefa.
2. **Single Table Design**: Considerar usar uma única tabela com diferentes tipos de entidade
3. **GSIs para queries complexas**: Criar GSIs para padrões de acesso frequentes
4. **Ordenação**: Usar SK ou campos de ordenação para manter ordem
5. **Status na SK**: Incluir status (`PENDING`/`COMPLETED`) na SK para melhor filtragem e performance
6. **Tarefas concluídas não são deletadas**: Mantidas com status `COMPLETED` para histórico e estatísticas

---

### Tratamento de Tarefas Concluídas

**Decisão de Design**: Tarefas concluídas **NÃO são deletadas**, mas sim marcadas com status `completed = true`. Isso permite:

- ✅ Manter histórico completo de tarefas realizadas
- ✅ Mostrar estatísticas e análises
- ✅ Permitir "desfazer" conclusão
- ✅ Filtrar facilmente entre pendentes e concluídas

**Estratégia de Armazenamento**: Incluir o status `completed` na **SK (Sort Key)** para permitir queries eficientes sem FilterExpression:

- **SK para tarefas pendentes**: `TODO#PENDING#todoId` ou `TODO#ACTIVE#todoId`
- **SK para tarefas concluídas**: `TODO#COMPLETED#completedAt#todoId`

**Vantagens**:

- ✅ Não precisa ler itens concluídos quando busca apenas pendentes
- ✅ Reduz custos de leitura (não lê dados desnecessários)
- ✅ Melhor performance (filtro na chave, não em memória)
- ✅ Ordenação natural por data de conclusão

**Alternativa (mais simples)**: Manter `TODO#todoId` na SK e usar FilterExpression. Use esta abordagem se preferir simplicidade sobre otimização.

**Recomendação**: Usar status na SK para melhor performance, especialmente se você tem muitas tarefas concluídas.

---

### Opção 1: Single Table Design (Recomendado)

#### Tabela Principal: `artemis-data`

**Estrutura de Chaves**:

- **PK (Partition Key)**: `userId#entityType` ou `userId#entityType#entityId`
- **SK (Sort Key)**: Varia conforme o tipo de entidade, incluindo status quando relevante

#### 📊 Tabela Master: Todas as Entidades com PK e SK

| Entidade                   | PK (Partition Key)              | SK (Sort Key)                             | Descrição                    | Status na SK? |
| -------------------------- | ------------------------------- | ----------------------------------------- | ---------------------------- | ------------- |
| **User**                   | `USER#userId`                   | `METADATA`                                | Dados do usuário             | ❌            |
| **Project**                | `USER#userId`                   | `PROJECT#projectId`                       | Dados do projeto             | ❌            |
| **Section**                | `USER#userId#PROJECT#projectId` | `SECTION#sectionId`                       | Dados da seção               | ❌            |
| **Todo (Pendente)**        | `USER#userId#PROJECT#projectId` | `TODO#PENDING#order#todoId`               | Tarefa pendente em projeto   | ✅            |
| **Todo (Concluída)**       | `USER#userId#PROJECT#projectId` | `TODO#COMPLETED#completedAt#todoId`       | Tarefa concluída em projeto  | ✅            |
| **Todo Inbox (Pendente)**  | `USER#userId`                   | `TODO#INBOX#PENDING#order#todoId`         | Tarefa pendente sem projeto  | ✅            |
| **Todo Inbox (Concluída)** | `USER#userId`                   | `TODO#INBOX#COMPLETED#completedAt#todoId` | Tarefa concluída sem projeto | ✅            |
| **Goal**                   | `USER#userId`                   | `GOAL#goalId`                             | Dados da meta                | ❌            |
| **Tag**                    | `USER#userId`                   | `TAG#tagId`                               | Dados da tag                 | ❌            |
| **TodoTag**                | `USER#userId#TODO#todoId`       | `TAG#tagId`                               | Associação Todo-Tag          | ❌            |
| **Comment**                | `USER#userId#TODO#todoId`       | `COMMENT#commentId`                       | Comentário em tarefa         | ❌            |
| **RecurrenceTemplate**     | `USER#userId`                   | `RECURRENCE#recurrenceTemplateId`         | Template de recorrência      | ❌            |

**Notas sobre a SK**:

- **Status na SK**: `PENDING` ou `COMPLETED` permite filtrar na chave (mais eficiente)
- **Order**: Número para ordenação dentro da seção/projeto (ex: `1`, `2`, `3`)
- **completedAt**: Timestamp ISO8601 para ordenar concluídas por data (ex: `2025-01-15T14:30:00Z`)
- **todoId**: ID único da tarefa

**Exemplos de SK**:

- Tarefa pendente: `TODO#PENDING#1#task-123` (primeira posição)
- Tarefa concluída: `TODO#COMPLETED#2025-01-15T14:30:00Z#task-123`
- Tarefa inbox pendente: `TODO#INBOX#PENDING#1#task-456`

**Atributos Adicionais**:

- `entityType` (string): Tipo da entidade (USER, PROJECT, TODO, GOAL, etc.)
- `GSI1PK`, `GSI1SK`: Para GSI1 (DueDateIndex)
- `GSI2PK`, `GSI2SK`: Para GSI2 (GoalIndex)
- `GSI3PK`, `GSI3SK`: Para GSI3 (SectionIndex)
- `GSI4PK`, `GSI4SK`: Para GSI4 (CompletedIndex)
- `GSI5PK`, `GSI5SK`: Para GSI5 (TagIndex)
- `GSI6PK`, `GSI6SK`: Para GSI6 (ProjectNameIndex)
- `GSI7PK`, `GSI7SK`: Para GSI7 (RecurrenceTemplateIndex)
- `GSI8PK`, `GSI8SK`: Para GSI8 (ParentTodoIndex)
- `TTL` (number, opcional): Time To Live para dados temporários

---

#### Global Secondary Indexes (GSI)

##### GSI1: DueDateIndex - Busca por Data de Vencimento

**Uso**: Buscar tarefas por data (Today, Upcoming)

- **GSI1PK**: `USER#userId#DUE_DATE#YYYY-MM-DD` (para Today) ou `USER#userId#DUE_DATE#FUTURE` (para Upcoming)
- **GSI1SK**: `TODO#PENDING#priority#todoId` (para pendentes) ou `TODO#COMPLETED#completedAt#todoId` (para concluídas)

**Exemplo**:

- Tarefa pendente com dueDate = 2025-01-15: `GSI1PK = USER#123#DUE_DATE#2025-01-15`, `GSI1SK = TODO#PENDING#1#task-456`
- Tarefa concluída: `GSI1PK = USER#123#DUE_DATE#2025-01-15`, `GSI1SK = TODO#COMPLETED#2025-01-15T14:30:00Z#task-456`

**Vantagem**: Permite buscar apenas pendentes usando `begins_with TODO#PENDING#`

---

##### GSI2: GoalIndex - Busca por Meta

**Uso**: Buscar tarefas associadas a uma meta

- **GSI2PK**: `USER#userId#GOAL#goalId`
- **GSI2SK**: `TODO#PENDING#priority#dueDate#todoId` (pendentes) ou `TODO#COMPLETED#completedAt#todoId` (concluídas)

**Exemplo**:

- Tarefa pendente associada à meta: `GSI2PK = USER#123#GOAL#goal-789`, `GSI2SK = TODO#PENDING#2#2025-01-20#task-456`
- Tarefa concluída: `GSI2PK = USER#123#GOAL#goal-789`, `GSI2SK = TODO#COMPLETED#2025-01-20T10:00:00Z#task-456`

---

##### GSI3: SectionIndex - Busca por Seção

**Uso**: Buscar tarefas por seção dentro de um projeto

- **GSI3PK**: `USER#userId#PROJECT#projectId#SECTION#sectionId`
- **GSI3SK**: `TODO#PENDING#order#todoId` (pendentes) ou `TODO#COMPLETED#completedAt#todoId` (concluídas)

**Exemplo**:

- Tarefa pendente na seção "In Progress": `GSI3PK = USER#123#PROJECT#proj-1#SECTION#section-2`, `GSI3SK = TODO#PENDING#1#task-456`
- Tarefa concluída: `GSI3PK = USER#123#PROJECT#proj-1#SECTION#section-2`, `GSI3SK = TODO#COMPLETED#2025-01-15T14:30:00Z#task-456`

**Vantagem**: Permite buscar apenas pendentes de uma seção usando `begins_with TODO#PENDING#`

---

##### GSI4: CompletedIndex - Busca por Status (Completas/Pendentes)

**Uso**: Buscar tarefas por status de conclusão

- **GSI4PK**: `USER#userId#COMPLETED#PENDING` ou `USER#userId#COMPLETED#COMPLETED`
- **GSI4SK**: `TODO#dueDate#priority#todoId` (para pendentes) ou `TODO#completedAt#todoId` (para concluídas)

**Exemplo**:

- Tarefa pendente: `GSI4PK = USER#123#COMPLETED#PENDING`, `GSI4SK = TODO#2025-01-20#1#task-456`
- Tarefa concluída: `GSI4PK = USER#123#COMPLETED#COMPLETED`, `GSI4SK = TODO#2025-01-15T14:30:00Z#task-456`

**Vantagem**: Permite buscar todas as pendentes ou todas as concluídas do usuário de forma eficiente

---

##### GSI5: TagIndex - Busca por Tag

**Uso**: Buscar tarefas por tag

- **GSI5PK**: `USER#userId#TAG#tagId`
- **GSI5SK**: `TODO#PENDING#dueDate#todoId` (pendentes) ou `TODO#COMPLETED#completedAt#todoId` (concluídas)

**Exemplo**:

- Tarefa pendente com tag: `GSI5PK = USER#123#TAG#tag-789`, `GSI5SK = TODO#PENDING#2025-01-20#task-456`

---

##### GSI6: ProjectNameIndex - Busca de Projetos

**Uso**: Listar projetos ordenados por nome

- **GSI6PK**: `USER#userId`
- **GSI6SK**: `PROJECT#name#projectId` (para ordenação alfabética)

**Exemplo**:

- Projeto: `GSI6PK = USER#123`, `GSI6SK = PROJECT#Python Study Plan#proj-456`

---

### Opção 2: Multi-Table Design (Alternativa)

Se preferir múltiplas tabelas, a estrutura seria:

1. **users** - Tabela de usuários
2. **projects** - Tabela de projetos
3. **sections** - Tabela de seções
4. **todos** - Tabela de tarefas
5. **goals** - Tabela de metas
6. **tags** - Tabela de tags
7. **todo_tags** - Tabela de associação
8. **comments** - Tabela de comentários

Cada tabela teria suas próprias GSIs conforme necessário.

---

## Padrões de Acesso

### 1. Listar Projetos do Usuário

```
Query na tabela principal:
PK = USER#userId
SK begins_with PROJECT#
FilterExpression: attribute_not_exists(deletedAt)
```

**GSI**: Não necessário (query direta na PK)

**Nota**: Sempre incluir `FilterExpression: attribute_not_exists(deletedAt)` para excluir itens deletados.

---

### 2. Buscar Projeto com Tarefas por Seção - Apenas Pendentes

```
1. Buscar projeto:
   PK = USER#userId
   SK = PROJECT#projectId

2. Buscar seções:
   PK = USER#userId#PROJECT#projectId
   SK begins_with SECTION#
   FilterExpression: attribute_not_exists(deletedAt)
   (ordenar por campo 'order')

3. Para cada seção, buscar tarefas pendentes:
   GSI3:
   GSI3PK = USER#userId#PROJECT#projectId#SECTION#sectionId
   GSI3SK begins_with TODO#PENDING#  ← Filtro na chave (mais eficiente)
   FilterExpression: attribute_not_exists(deletedAt)
   (ordenar por campo 'order' - já está na SK)
```

**Vantagem**: Não lê tarefas concluídas, apenas pendentes de cada seção.

---

### 3. Buscar Tarefas do Dia (Today) - Apenas Pendentes

```
GSI1:
GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD (data de hoje)
GSI1SK begins_with TODO#PENDING#  ← Filtro na chave (mais eficiente)
FilterExpression: attribute_not_exists(deletedAt)
(ordenar por prioridade: high > medium > low)
```

**Vantagem**: Usando `begins_with TODO#PENDING#` na SK, não lê tarefas concluídas, reduzindo custos.

---

### 4. Buscar Tarefas da Inbox - Apenas Pendentes

```
Query na tabela principal:
PK = USER#userId
SK begins_with TODO#INBOX#PENDING#  ← Filtro na chave (mais eficiente)
FilterExpression: attribute_not_exists(deletedAt)
```

**Vantagem**: Usando `begins_with TODO#INBOX#PENDING#` na SK, não lê tarefas concluídas da inbox.

---

### 5. Buscar Tarefas Futuras (Upcoming)

```
GSI1 (estrutura atual: uma partição por data):
- Para cada data futura no horizonte desejado (ex.: próximos 30 dias):
  GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD
  GSI1SK begins_with TODO#PENDING#
  FilterExpression: attribute_not_exists(deletedAt)
- Concatenar resultados e ordenar por dueDate no aplicativo.
```

**Nota**: O DynamoDB exige **igualdade** na partition key; não suporta `begins_with` ou range em PK. Por isso Upcoming exige múltiplas queries (uma por data) com o GSI1 atual. Se for crítico ter uma única query, considerar um GSI com PK = `USER#userId` e SK = `DUE_DATE#YYYY-MM-DD#...` para usar range em SK.

---

### 6. Buscar Tarefas Concluídas

```
GSI4:
GSI4PK = USER#userId#COMPLETED#COMPLETED
GSI4SK begins_with TODO#COMPLETED#  ← Filtro na chave
FilterExpression: attribute_not_exists(deletedAt)
(ordenar por completedAt descendente - já está na SK)
```

**Vantagem**: Usando `COMPLETED#COMPLETED` na PK e `TODO#COMPLETED#` na SK, busca apenas concluídas de forma eficiente.

---

### 7. Buscar Tarefas por Meta

```
GSI2:
GSI2PK = USER#userId#GOAL#goalId
GSI2SK begins_with TODO#
(ordenar por prioridade e dueDate)
```

---

### 8. Buscar Tarefas por Tag

```
GSI5:
GSI5PK = USER#userId#TAG#tagId
GSI5SK begins_with TODO#
(ordenar por dueDate)
```

---

### 9. Buscar Estatísticas do Dashboard

```
1. Total completas:
   GSI4: GSI4PK = USER#userId#COMPLETED#COMPLETED
   (contar itens)

2. Total em progresso:
   GSI4: GSI4PK = USER#userId#COMPLETED#PENDING
   (contar itens)

3. Total hoje:
   GSI1: GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD
   (contar itens)

4. Total de projetos:
   Query: PK = USER#userId, SK begins_with PROJECT#
   (contar itens)
```

---

### 10. Criar Nova Tarefa

```
PutItem na tabela principal:
PK = USER#userId#PROJECT#projectId (ou USER#userId se inbox)
SK = TODO#PENDING#order#todoId  ← Status na SK

Também atualizar todos os GSIs:
- GSI1: GSI1PK = USER#userId#DUE_DATE#date, GSI1SK = TODO#PENDING#priority#todoId
- GSI2: GSI2PK = USER#userId#GOAL#goalId, GSI2SK = TODO#PENDING#priority#dueDate#todoId (se tiver goalId)
- GSI3: GSI3PK = USER#userId#PROJECT#projectId#SECTION#sectionId, GSI3SK = TODO#PENDING#order#todoId (se tiver sectionId)
- GSI4: GSI4PK = USER#userId#COMPLETED#PENDING, GSI4SK = TODO#dueDate#priority#todoId
- GSI5: GSI5PK = USER#userId#TAG#tagId, GSI5SK = TODO#PENDING#dueDate#todoId (para cada tag)
- GSI7: GSI7PK = USER#userId#RECURRENCE#recurrenceTemplateId, GSI7SK = TODO#PENDING#dueDate#todoId (se recorrente)
- GSI8: GSI8PK = USER#userId#PARENT#parentTodoId, GSI8SK = TODO#PENDING#recurrenceSequence#todoId (se tiver parent)
```

---

### 11. Marcar Tarefa como Concluída (Mudança de Status na SK)

```
IMPORTANTE: Quando uma tarefa é concluída, a SK muda de PENDING para COMPLETED.

1. Buscar tarefa atual:
   GetItem: PK = USER#userId#PROJECT#projectId, SK = TODO#PENDING#order#todoId

2. Criar novo item com SK de COMPLETED:
   PutItem: PK = USER#userId#PROJECT#projectId, SK = TODO#COMPLETED#completedAt#todoId
   - Copiar todos os dados da tarefa
   - Adicionar completedAt = timestamp atual
   - completed = true

3. Deletar item antigo (PENDING):
   DeleteItem: PK = USER#userId#PROJECT#projectId, SK = TODO#PENDING#order#todoId

4. Atualizar todos os GSIs:
   - Remover entradas antigas (PENDING) de todos os GSIs
   - Adicionar entradas novas (COMPLETED) em todos os GSIs relevantes
   - GSI1: GSI1SK = TODO#COMPLETED#completedAt#todoId
   - GSI2: GSI2SK = TODO#COMPLETED#completedAt#todoId
   - GSI3: GSI3SK = TODO#COMPLETED#completedAt#todoId
   - GSI4: GSI4PK = USER#userId#COMPLETED#COMPLETED, GSI4SK = TODO#completedAt#todoId
   - GSI5: GSI5SK = TODO#COMPLETED#completedAt#todoId
   - GSI7: GSI7SK = TODO#COMPLETED#completedAt#todoId (se recorrente)
   - GSI8: GSI8SK = TODO#COMPLETED#completedAt#todoId (se tiver parent)

5. Se for tarefa recorrente, gerar próxima instância (ver seção de Recorrência)
```

**Alternativa (mais simples)**: Usar UpdateItem para atualizar apenas o campo `completed` e `completedAt`, mantendo a mesma SK. Use esta abordagem se preferir simplicidade sobre otimização de performance.

---

### Revisão de consistência (PK/SK e queries)

**O que foi verificado**:

- Alinhamento entre a **Tabela Master** (PK/SK e GSIs) e as queries em **Métodos de Busca Necessários** e **Padrões de Acesso**.
- Uso correto do DynamoDB: partition key sempre com **igualdade** (não `begins_with` em PK).
- Queries que dependem de `USER#userId` como PK: só retornam itens cuja PK é exatamente `USER#userId` (ex.: projetos, metas, tags, inbox, recurrence); tarefas em projeto ficam em `USER#userId#PROJECT#projectId`.

**Ajustes realizados**:

1. **GSI4 (CompletedIndex)**: O índice usa `PENDING` e `COMPLETED` na PK. Todas as referências foram unificadas para `GSI4PK = USER#userId#COMPLETED#PENDING` e `USER#userId#COMPLETED#COMPLETED` (removido uso de `true`/`false` em Métodos de Busca, Padrões de Acesso e Dashboard).
2. **Upcoming (Tarefas futuras)**: Em DynamoDB a partition key exige igualdade. Com GSI1 por data (`GSI1PK = USER#userId#DUE_DATE#YYYY-MM-DD`), não é possível uma única query “todas as datas futuras”. Documentado que é necessário múltiplas queries (uma por data) ou um GSI alternativo com PK = `USER#userId` e SK por data para range em SK.
3. **Query 21 (Todas as tarefas recorrentes)**: `PK = USER#userId AND SK begins_with TODO#` só atinge tarefas da Inbox (PK do usuário). Tarefas em projeto têm PK `USER#userId#PROJECT#projectId`. Documentadas as opções: filtrar só inbox ou usar GSI7/GSI8 (por template/parent) para agregar todas as recorrentes.

**Resumo**: As PKs e SKs da Tabela Master e dos GSIs estão coerentes entre si. As queries passam a seguir essa convenção (PENDING/COMPLETED no GSI4) e as limitações de Upcoming e “todas as tarefas recorrentes” ficam explícitas no texto.

---

### 12. Atualizar Tarefa (mover entre seções, mudar prioridade, etc.)

```
1. Buscar tarefa atual (GetItem)
2. Atualizar campos necessários
3. Se sectionId mudou:
   - Remover do GSI3 antigo
   - Adicionar no GSI3 novo
4. Se prioridade mudou, atualizar GSI1 e GSI2
5. Atualizar outros GSIs conforme necessário
```

---

### 12. Completar Tarefa Recorrente e Gerar Próxima Instância

```
1. Marcar tarefa como completa (mudar SK de PENDING para COMPLETED):
   - Buscar tarefa: GetItem com SK = TODO#PENDING#order#todoId
   - Criar novo item: PutItem com SK = TODO#COMPLETED#completedAt#todoId
   - Deletar item antigo: DeleteItem com SK = TODO#PENDING#order#todoId
   - Atualizar todos os GSIs (remover PENDING, adicionar COMPLETED)

2. Buscar template de recorrência:
   GetItem: PK = USER#userId, SK = RECURRENCE#recurrenceTemplateId

3. Verificar se deve gerar próxima instância:
   - Template está ativo? (isActive = true)
   - Data final não passou? (recurrenceEndDate > hoje)
   - Limite de ocorrências não atingido? (count < recurrenceCount)

4. Calcular próxima data baseado no template

5. Criar nova tarefa (PENDING):
   PutItem: PK = USER#userId#PROJECT#projectId, SK = TODO#PENDING#order#newTodoId
   - Copiar campos da tarefa original
   - Definir parentTodoId = todoId original
   - Definir recurrenceSequence = última sequência + 1
   - Definir dueDate = próxima data calculada
   - completed = false
   - Atualizar todos os GSIs com status PENDING (GSI1, GSI3, GSI4, GSI7, GSI8)

6. Atualizar template:
   UpdateItem: PK = USER#userId, SK = RECURRENCE#recurrenceTemplateId
   SET lastGeneratedDate = :now
```

---

## Considerações de Ordenação

### Ordenação por Prioridade

Usar valores numéricos no SK:

- `high` → `1`
- `medium` → `2`
- `low` → `3`

Exemplo: `GSI1SK = TODO#1#task-456` (prioridade alta)

### Ordenação por Data

Usar formato ISO8601 no SK: `YYYY-MM-DD` ou timestamp

Exemplo: `GSI1SK = TODO#2025-01-15#task-456`

### Ordenação por Ordem Customizada

Usar campo numérico `order` no SK

Exemplo: `GSI3SK = TODO#1#task-456` (primeira posição)

---

## Exemplos de Itens no DynamoDB

### Exemplo 1: Projeto

```json
{
  "PK": "USER#user-123",
  "SK": "PROJECT#proj-456",
  "entityType": "PROJECT",
  "id": "proj-456",
  "userId": "user-123",
  "name": "Python Study Plan",
  "description": "Detailed plan to learn Python",
  "emoji": "🐍",
  "deletedAt": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "GSI6PK": "USER#user-123",
  "GSI6SK": "PROJECT#Python Study Plan#proj-456"
}
```

### Exemplo 2: Seção

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "SECTION#section-789",
  "entityType": "SECTION",
  "id": "section-789",
  "userId": "user-123",
  "projectId": "proj-456",
  "name": "In Progress",
  "order": 2,
  "deletedAt": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Exemplo 3: Tarefa Pendente

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#PENDING#1#task-101",
  "entityType": "TODO",
  "id": "task-101",
  "userId": "user-123",
  "projectId": "proj-456",
  "sectionId": "section-789",
  "goalId": "goal-202",
  "title": "Lists and Dictionaries",
  "description": "Learn about Python data structures",
  "completed": false,
  "priority": "high",
  "dueDate": "2025-01-25",
  "order": 1,
  "deletedAt": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "GSI1PK": "USER#user-123#DUE_DATE#2025-01-25",
  "GSI1SK": "TODO#PENDING#1#task-101",
  "GSI2PK": "USER#user-123#GOAL#goal-202",
  "GSI2SK": "TODO#PENDING#1#2025-01-25#task-101",
  "GSI3PK": "USER#user-123#PROJECT#proj-456#SECTION#section-789",
  "GSI3SK": "TODO#PENDING#1#task-101",
  "GSI4PK": "USER#user-123#COMPLETED#PENDING",
  "GSI4SK": "TODO#2025-01-25#1#task-101"
}
```

**Nota**: A SK inclui `PENDING` e o `order` (1) para ordenação dentro da seção.

### Exemplo 3b: Tarefa Concluída (mesma tarefa após conclusão)

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#COMPLETED#2025-01-25T14:30:00Z#task-101",
  "entityType": "TODO",
  "id": "task-101",
  "userId": "user-123",
  "projectId": "proj-456",
  "sectionId": "section-789",
  "goalId": "goal-202",
  "title": "Lists and Dictionaries",
  "description": "Learn about Python data structures",
  "completed": true,
  "completedAt": "2025-01-25T14:30:00Z",
  "priority": "high",
  "dueDate": "2025-01-25",
  "order": 1,
  "deletedAt": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2025-01-25T14:30:00Z",
  "GSI1PK": "USER#user-123#DUE_DATE#2025-01-25",
  "GSI1SK": "TODO#COMPLETED#2025-01-25T14:30:00Z#task-101",
  "GSI2PK": "USER#user-123#GOAL#goal-202",
  "GSI2SK": "TODO#COMPLETED#2025-01-25T14:30:00Z#task-101",
  "GSI3PK": "USER#user-123#PROJECT#proj-456#SECTION#section-789",
  "GSI3SK": "TODO#COMPLETED#2025-01-25T14:30:00Z#task-101",
  "GSI4PK": "USER#user-123#COMPLETED#COMPLETED",
  "GSI4SK": "TODO#2025-01-25T14:30:00Z#task-101"
}
```

**Nota**: Quando concluída, a SK muda para `COMPLETED#completedAt`. O item antigo (PENDING) é deletado e este novo item é criado.

### Exemplo 4: Tarefa na Inbox Pendente (sem projeto)

```json
{
  "PK": "USER#user-123",
  "SK": "TODO#INBOX#PENDING#1#task-102",
  "entityType": "TODO",
  "id": "task-102",
  "userId": "user-123",
  "projectId": null,
  "sectionId": null,
  "title": "Review Python documentation",
  "completed": false,
  "priority": "low",
  "dueDate": null,
  "order": 1,
  "deletedAt": null,
  "createdAt": "2024-01-16T14:00:00Z",
  "updatedAt": "2024-01-16T14:00:00Z",
  "GSI4PK": "USER#user-123#COMPLETED#PENDING",
  "GSI4SK": "TODO#task-102"
}
```

**Nota**: Tarefas da inbox também incluem status na SK: `INBOX#PENDING#order#todoId`

### Exemplo 5: Meta

```json
{
  "PK": "USER#user-123",
  "SK": "GOAL#goal-202",
  "entityType": "GOAL",
  "id": "goal-202",
  "userId": "user-123",
  "name": "Python Study Plan",
  "description": "Detailed plan to learn Python step by step",
  "targetValue": 100,
  "deadline": "2025-12-31",
  "progress": 20,
  "tasks": 10,
  "pending": 8,
  "deletedAt": null,
  "createdAt": "2024-01-10T09:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Exemplo 6: Tarefa Deletada (Soft Delete)

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#task-103",
  "entityType": "TODO",
  "id": "task-103",
  "userId": "user-123",
  "projectId": "proj-456",
  "sectionId": "section-789",
  "title": "Old Task",
  "description": "This task was deleted",
  "completed": false,
  "priority": "medium",
  "dueDate": "2025-01-20",
  "deletedAt": "2025-01-10T15:30:00Z",
  "ttl": 1739125800,
  "createdAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2025-01-10T15:30:00Z",
  "GSI1PK": "USER#user-123#DUE_DATE#2025-01-20",
  "GSI1SK": "TODO#2#task-103",
  "GSI3PK": "USER#user-123#PROJECT#proj-456#SECTION#section-789",
  "GSI3SK": "TODO#3#task-103",
  "GSI4PK": "USER#user-123#COMPLETED#false",
  "GSI4SK": "TODO#2025-01-20#task-103"
}
```

**Nota**: O campo `ttl` (Time To Live) está definido para que o DynamoDB delete automaticamente este item após 90 dias da data de exclusão.

### Exemplo 7: Template de Recorrência

```json
{
  "PK": "USER#user-123",
  "SK": "RECURRENCE#recurrence-001",
  "entityType": "RECURRENCE_TEMPLATE",
  "id": "recurrence-001",
  "userId": "user-123",
  "todoId": "task-101",
  "recurrenceType": "custom",
  "recurrenceInterval": 15,
  "recurrenceUnit": "days",
  "recurrenceEndDate": null,
  "recurrenceCount": null,
  "recurrenceDaysOfWeek": null,
  "recurrenceDayOfMonth": null,
  "lastGeneratedDate": "2025-01-15T14:30:00Z",
  "isActive": true,
  "deletedAt": null,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-15T14:30:00Z"
}
```

**Nota**: Este template define uma recorrência "a cada 15 dias" para a tarefa `task-101`.

### Exemplo 8: Tarefa Recorrente (Original) - Pendente

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#PENDING#1#task-101",
  "entityType": "TODO",
  "id": "task-101",
  "userId": "user-123",
  "projectId": "proj-456",
  "sectionId": "section-789",
  "title": "Ração do bob",
  "description": "10 semanas",
  "dueDate": "2025-01-15",
  "completed": false,
  "priority": "medium",
  "isRecurring": true,
  "recurrenceTemplateId": "recurrence-001",
  "parentTodoId": null,
  "recurrenceSequence": null,
  "order": 1,
  "deletedAt": null,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z",
  "GSI1PK": "USER#user-123#DUE_DATE#2025-01-15",
  "GSI1SK": "TODO#PENDING#2#task-101",
  "GSI3PK": "USER#user-123#PROJECT#proj-456#SECTION#section-789",
  "GSI3SK": "TODO#PENDING#1#task-101",
  "GSI4PK": "USER#user-123#COMPLETED#PENDING",
  "GSI4SK": "TODO#2025-01-15#2#task-101",
  "GSI7PK": "USER#user-123#RECURRENCE#recurrence-001",
  "GSI7SK": "TODO#PENDING#2025-01-15#task-101"
}
```

**Nota**: Esta é a tarefa original que criou o template de recorrência. `parentTodoId` é `null` porque é a tarefa pai. Status `PENDING` na SK.

### Exemplo 9: Tarefa Recorrente (Instância Gerada) - Pendente

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#PENDING#2#task-102",
  "entityType": "TODO",
  "id": "task-102",
  "userId": "user-123",
  "projectId": "proj-456",
  "sectionId": "section-789",
  "title": "Ração do bob",
  "description": "10 semanas",
  "dueDate": "2025-01-30",
  "completed": false,
  "priority": "medium",
  "isRecurring": true,
  "recurrenceTemplateId": "recurrence-001",
  "parentTodoId": "task-101",
  "recurrenceSequence": 1,
  "order": 2,
  "deletedAt": null,
  "createdAt": "2025-01-15T14:30:00Z",
  "updatedAt": "2025-01-15T14:30:00Z",
  "GSI1PK": "USER#user-123#DUE_DATE#2025-01-30",
  "GSI1SK": "TODO#PENDING#2#task-102",
  "GSI3PK": "USER#user-123#PROJECT#proj-456#SECTION#section-789",
  "GSI3SK": "TODO#PENDING#2#task-102",
  "GSI4PK": "USER#user-123#COMPLETED#PENDING",
  "GSI4SK": "TODO#2025-01-30#2#task-102",
  "GSI7PK": "USER#user-123#RECURRENCE#recurrence-001",
  "GSI7SK": "TODO#PENDING#2025-01-30#task-102",
  "GSI8PK": "USER#user-123#PARENT#task-101",
  "GSI8SK": "TODO#PENDING#1#task-102"
}
```

**Nota**: Esta tarefa foi gerada automaticamente quando `task-101` foi completada. `parentTodoId` aponta para a tarefa original e `recurrenceSequence` indica que é a primeira instância gerada. Status `PENDING` na SK.

---

## Resumo das GSIs

| GSI  | Nome                    | PK                                                                   | SK                                                                                   | Uso Principal                             | Status na SK? |
| ---- | ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- | ------------- |
| GSI1 | DueDateIndex            | `USER#userId#DUE_DATE#YYYY-MM-DD`                                    | `TODO#PENDING#priority#todoId` ou `TODO#COMPLETED#completedAt#todoId`                | Buscar tarefas por data (Today, Upcoming) | ✅            |
| GSI2 | GoalIndex               | `USER#userId#GOAL#goalId`                                            | `TODO#PENDING#priority#dueDate#todoId` ou `TODO#COMPLETED#completedAt#todoId`        | Buscar tarefas por meta                   | ✅            |
| GSI3 | SectionIndex            | `USER#userId#PROJECT#projectId#SECTION#sectionId`                    | `TODO#PENDING#order#todoId` ou `TODO#COMPLETED#completedAt#todoId`                   | Buscar tarefas por seção                  | ✅            |
| GSI4 | CompletedIndex          | `USER#userId#COMPLETED#PENDING` ou `USER#userId#COMPLETED#COMPLETED` | `TODO#dueDate#priority#todoId` (pendentes) ou `TODO#completedAt#todoId` (concluídas) | Buscar tarefas por status                 | ✅            |
| GSI5 | TagIndex                | `USER#userId#TAG#tagId`                                              | `TODO#PENDING#dueDate#todoId` ou `TODO#COMPLETED#completedAt#todoId`                 | Buscar tarefas por tag                    | ✅            |
| GSI6 | ProjectNameIndex        | `USER#userId`                                                        | `PROJECT#name#projectId`                                                             | Listar projetos ordenados                 | ❌            |
| GSI7 | RecurrenceTemplateIndex | `USER#userId#RECURRENCE#recurrenceTemplateId`                        | `TODO#PENDING#dueDate#todoId` ou `TODO#COMPLETED#completedAt#todoId`                 | Buscar instâncias de recorrência          | ✅            |
| GSI8 | ParentTodoIndex         | `USER#userId#PARENT#parentTodoId`                                    | `TODO#PENDING#recurrenceSequence#todoId` ou `TODO#COMPLETED#completedAt#todoId`      | Buscar tarefas filhas                     | ✅            |

---

## Soft Delete

### ⚡ Resumo Rápido (TL;DR)

**Como funciona**:

1. ✅ Campo `deletedAt` (timestamp) em todas as entidades
2. ✅ **TODAS** as queries de listagem/busca **automaticamente** excluem itens com `deletedAt` definido
3. ✅ Usar `FilterExpression: 'attribute_not_exists(deletedAt)'` em **todas** as queries normais
4. ✅ Apenas queries de lixeira ou busca por ID específico podem retornar itens deletados

**Padrão de implementação**:

```javascript
// ✅ CORRETO: Sempre incluir este filtro
FilterExpression: "attribute_not_exists(deletedAt)";

// ❌ ERRADO: Esquecer o filtro (retornará itens deletados)
// Sem FilterExpression
```

**Isso é padrão da indústria?** Sim! Empresas como GitHub, Stripe, Notion usam exatamente este padrão.

---

### Visão Geral

O sistema implementa **Soft Delete** para todas as entidades principais, permitindo que registros sejam marcados como deletados sem serem fisicamente removidos do banco de dados. Isso oferece:

- **Recuperação de dados**: Possibilidade de restaurar itens deletados acidentalmente
- **Auditoria**: Manutenção de histórico completo de ações
- **Integridade referencial**: Preservação de relacionamentos mesmo após "exclusão"
- **Análise de dados**: Possibilidade de analisar padrões de uso e exclusão

### Como Empresas Trabalham com Soft Delete

**Sim, é assim que a maioria das empresas trabalha!** O padrão mais comum é:

1. **Campo `deletedAt`**: Um único campo timestamp que indica quando o item foi deletado
   - `null` ou ausente = item ativo
   - Timestamp presente = item deletado

2. **Filtro Padrão**: **TODAS** as queries de listagem/busca automaticamente excluem itens com `deletedAt` definido
   - Não é necessário passar um parâmetro especial
   - É o comportamento padrão esperado pela aplicação
   - Apenas queries específicas de "lixeira" incluem itens deletados

3. **Camada de Abstração**: Criar funções/helpers que sempre aplicam o filtro automaticamente
   - Evita esquecer de adicionar o filtro
   - Garante consistência em toda a aplicação

**Alternativas menos comuns**:

- Campo booleano `isDeleted` (menos preciso, não guarda quando foi deletado)
- Tabela separada para itens deletados (mais complexo, raramente usado)
- Incluir status na chave primária (mais eficiente no DynamoDB, mas mais complexo)

### Estrutura do Campo `deletedAt`

Todas as entidades (exceto User, que pode ter regras especiais) possuem o campo `deletedAt`:

- **Tipo**: ISO8601 timestamp (string)
- **Valor quando ativo**: `null` ou ausente (não existe o atributo)
- **Valor quando deletado**: Timestamp ISO8601 da data/hora da exclusão (ex: `"2025-01-15T14:30:00Z"`)

**Importante**: No DynamoDB, quando um atributo não existe, ele é `undefined`. Usamos `attribute_not_exists(deletedAt)` para verificar se o item está ativo.

### Padrão de Implementação: Filtro Automático

**REGRA FUNDAMENTAL**: Todas as queries de listagem/busca devem **automaticamente** filtrar itens deletados. Isso significa:

1. **Queries normais** (99% dos casos): Sempre incluir `FilterExpression: 'attribute_not_exists(deletedAt)'`
2. **Queries de lixeira**: Explicitamente buscar itens com `FilterExpression: 'attribute_exists(deletedAt)'`
3. **Queries por ID específico**: Podem retornar o item mesmo se deletado (para permitir restauração)

**Implementação Recomendada**: Criar funções helper que aplicam o filtro automaticamente:

```javascript
// Helper para queries que excluem deletados (padrão)
async function queryActiveItems(params) {
  return await dynamodb.query({
    ...params,
    FilterExpression: params.FilterExpression
      ? `${params.FilterExpression} AND attribute_not_exists(deletedAt)`
      : "attribute_not_exists(deletedAt)",
  });
}

// Helper para queries que incluem deletados (lixeira)
async function queryIncludingDeleted(params) {
  return await dynamodb.query(params); // Sem filtro de deletedAt
}

// Helper para queries de lixeira (apenas deletados)
async function queryDeletedItems(params) {
  return await dynamodb.query({
    ...params,
    FilterExpression: params.FilterExpression
      ? `${params.FilterExpression} AND attribute_exists(deletedAt)`
      : "attribute_exists(deletedAt)",
  });
}
```

### Operações de Soft Delete

#### 1. Deletar um Item

Ao invés de usar `DeleteItem`, usar `UpdateItem` para definir `deletedAt`:

```javascript
// Exemplo: Deletar uma tarefa
await dynamodb.update({
  TableName: "artemis-data",
  Key: {
    PK: "USER#user-123#PROJECT#proj-456",
    SK: "TODO#task-101",
  },
  UpdateExpression: "SET deletedAt = :deletedAt, updatedAt = :updatedAt",
  ExpressionAttributeValues: {
    ":deletedAt": new Date().toISOString(),
    ":updatedAt": new Date().toISOString(),
  },
});
```

#### 2. Restaurar um Item

Para restaurar um item deletado, definir `deletedAt` como `null`:

```javascript
await dynamodb.update({
  TableName: "artemis-data",
  Key: {
    PK: "USER#user-123#PROJECT#proj-456",
    SK: "TODO#task-101",
  },
  UpdateExpression: "REMOVE deletedAt SET updatedAt = :updatedAt",
  ExpressionAttributeValues: {
    ":updatedAt": new Date().toISOString(),
  },
});
```

#### 3. Deletar Permanentemente

Para deletar fisicamente (hard delete), usar `DeleteItem` normalmente:

```javascript
await dynamodb.delete({
  TableName: "artemis-data",
  Key: {
    PK: "USER#user-123#PROJECT#proj-456",
    SK: "TODO#task-101",
  },
});
```

**Nota**: Hard delete deve ser usado apenas em processos de limpeza automática ou quando o usuário explicitamente solicita exclusão permanente.

### Filtragem em Queries e Keys do DynamoDB

**IMPORTANTE**: No DynamoDB, o `FilterExpression` é aplicado **APÓS** a leitura dos itens que correspondem às condições de chave (PK/SK). Isso significa:

1. **As keys (PK/SK) não mudam** quando um item é deletado
   - Um projeto deletado continua com `PK = USER#userId` e `SK = PROJECT#projectId`
   - O DynamoDB ainda lê o item da partição
   - O `FilterExpression` remove o item do resultado antes de retornar

2. **Custo**: Itens deletados ainda são lidos (consumem Read Capacity Units)
   - Se você tem muitos itens deletados, isso pode aumentar custos
   - Para volumes muito grandes, considere a estratégia de incluir status na SK

3. **Performance**: O filtro é aplicado em memória após a leitura
   - Não afeta a velocidade da query de chave
   - Pode reduzir o número de itens retornados (útil para paginação)

**Estratégias de Filtragem**:

#### Opção 1: Filter Expression (Recomendado para a maioria dos casos)

Usar `FilterExpression` para excluir itens deletados. **Esta é a abordagem padrão** usada pela maioria das empresas:

```javascript
// Padrão: Sempre incluir este filtro em queries de listagem
const result = await dynamodb.query({
  TableName: "artemis-data",
  KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
  FilterExpression: "attribute_not_exists(deletedAt)", // ← SEMPRE incluir
  ExpressionAttributeValues: {
    ":pk": "USER#user-123",
    ":sk": "PROJECT#",
  },
});
```

**Vantagens**:

- ✅ Simples de implementar
- ✅ Funciona com todas as queries e GSIs
- ✅ Não requer mudanças na estrutura de chaves existentes
- ✅ Padrão da indústria (usado por empresas como GitHub, Stripe, etc.)
- ✅ Fácil de manter e entender

**Desvantagens**:

- ⚠️ O DynamoDB ainda lê os itens deletados (custo de leitura)
- ⚠️ Itens deletados ainda contam para o limite de 1MB por query
- ⚠️ Se você tem muitos itens deletados (ex: 80% deletados), pode ser ineficiente

**Quando usar**: Use esta abordagem se:

- Você tem uma proporção razoável de itens ativos vs deletados (< 50% deletados)
- Simplicidade é mais importante que otimização de custos
- Você está começando o projeto (pode migrar depois se necessário)

#### Opção 2: Incluir Status na Chave (Alternativa para alta escala)

Incluir o status de deleção na SK ou GSI. **Use apenas se tiver muitos itens deletados**:

```
SK = PROJECT#ACTIVE#projectId  (não deletado)
SK = PROJECT#DELETED#projectId  (deletado)

// Ou em GSIs:
GSI1PK = USER#userId#DUE_DATE#2025-01-15#ACTIVE
GSI1PK = USER#userId#DUE_DATE#2025-01-15#DELETED
```

**Vantagens**:

- ✅ Não lê itens deletados (mais eficiente)
- ✅ Reduz custos de leitura significativamente
- ✅ Melhor performance em queries grandes

**Desvantagens**:

- ❌ Requer migração de dados existentes
- ❌ Queries precisam sempre especificar o status (ACTIVE)
- ❌ Mais complexo de gerenciar
- ❌ Ao deletar, precisa mover o item (atualizar PK/SK)
- ❌ Mais propenso a erros (esquecer de incluir ACTIVE)

**Quando usar**: Use esta abordagem apenas se:

- Você tem uma proporção muito alta de itens deletados (> 50%)
- Custos de leitura são uma preocupação crítica
- Você tem volume muito alto de queries
- Está disposto a lidar com a complexidade adicional

**Recomendação**: **Comece com Opção 1 (FilterExpression)**. Migre para Opção 2 apenas se realmente necessário após análise de custos e performance.

---

### Resumo: Decisão sobre Status na SK

**Decisão Final**: ✅ **SIM, incluir status (`PENDING`/`COMPLETED`) na SK**

**Por quê?**

1. **Performance**: Queries que buscam apenas pendentes não precisam ler concluídas (reduz custos)
2. **Filtragem eficiente**: Usar `begins_with TODO#PENDING#` na SK é mais rápido que FilterExpression
3. **Escalabilidade**: Com muitas tarefas concluídas, a diferença de performance é significativa
4. **Padrão comum**: Empresas como GitHub, Linear usam abordagens similares

**Como funciona**:

- Tarefa pendente: `SK = TODO#PENDING#order#todoId`
- Tarefa concluída: `SK = TODO#COMPLETED#completedAt#todoId`
- Ao completar: Deletar item com SK `PENDING`, criar novo item com SK `COMPLETED`

**Trade-offs**:

- ✅ Vantagem: Melhor performance e menor custo
- ⚠️ Desvantagem: Requer operação de "mover" item ao completar (DeleteItem + PutItem)

**Alternativa Simples**: Se preferir simplicidade, mantenha `SK = TODO#todoId` e use `FilterExpression: completed = false`. Use esta abordagem se tiver poucas tarefas concluídas.

### Atualização dos Padrões de Acesso

**REGRA**: Todos os padrões de acesso de **listagem/busca** devem incluir o filtro `attribute_not_exists(deletedAt)` por padrão. Apenas queries específicas de lixeira ou busca por ID único podem retornar itens deletados.

#### Exemplo: Listar Projetos do Usuário (Padrão - Exclui Deletados)

```javascript
// ✅ CORRETO: Filtro automático de itens deletados
const result = await dynamodb.query({
  TableName: "artemis-data",
  KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
  FilterExpression: "attribute_not_exists(deletedAt)", // ← SEMPRE incluir
  ExpressionAttributeValues: {
    ":pk": "USER#user-123",
    ":sk": "PROJECT#",
  },
});
```

#### Exemplo: Buscar Tarefas do Dia (Today) - Com GSI

```javascript
// ✅ CORRETO: Filtro automático mesmo em GSIs
const result = await dynamodb.query({
  TableName: "artemis-data",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1sk)",
  FilterExpression: "attribute_not_exists(deletedAt)", // ← SEMPRE incluir
  ExpressionAttributeValues: {
    ":gsi1pk": "USER#user-123#DUE_DATE#2025-01-15",
    ":gsi1sk": "TODO#",
  },
});
```

#### Exemplo: Buscar Item por ID (Pode Retornar Deletado)

```javascript
// ✅ CORRETO: GetItem não precisa de filtro (permite restaurar)
const result = await dynamodb.get({
  TableName: "artemis-data",
  Key: {
    PK: "USER#user-123",
    SK: "PROJECT#proj-456",
  },
});

// Verificar se está deletado na aplicação
if (result.Item?.deletedAt) {
  // Item deletado - pode mostrar opção de restaurar
}
```

#### Exemplo: Listar Itens Deletados (Lixeira)

```javascript
// ✅ CORRETO: Query específica para lixeira
const result = await dynamodb.query({
  TableName: "artemis-data",
  KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
  FilterExpression: "attribute_exists(deletedAt)", // ← Apenas deletados
  ExpressionAttributeValues: {
    ":pk": "USER#user-123",
    ":sk": "PROJECT#",
  },
});
```

#### Exemplo: Query com Filtros Adicionais

```javascript
// ✅ CORRETO: Combinar filtros (sempre incluir deletedAt)
const result = await dynamodb.query({
  TableName: "artemis-data",
  IndexName: "GSI4",
  KeyConditionExpression: "GSI4PK = :gsi4pk",
  FilterExpression: "attribute_not_exists(deletedAt) AND priority = :priority", // ← Combinar filtros
  ExpressionAttributeValues: {
    ":gsi4pk": "USER#user-123#COMPLETED#false",
    ":priority": "high",
  },
});
```

### Cascata de Soft Delete

Quando um item pai é deletado, os itens filhos podem ser tratados de diferentes formas:

#### 1. Deletar em Cascata (Recomendado para Projetos)

Quando um projeto é deletado, deletar também suas seções e tarefas:

```javascript
// 1. Deletar projeto
await softDeleteProject(projectId);

// 2. Buscar todas as seções do projeto
const sections = await getSectionsByProject(projectId);

// 3. Deletar todas as seções
for (const section of sections) {
  await softDeleteSection(section.id);
}

// 4. Buscar todas as tarefas do projeto
const todos = await getTodosByProject(projectId);

// 5. Deletar todas as tarefas
for (const todo of todos) {
  await softDeleteTodo(todo.id);
}
```

#### 2. Manter Órfãos (Recomendado para Metas)

Quando uma meta é deletada, manter as tarefas associadas mas remover a referência:

```javascript
// 1. Deletar meta
await softDeleteGoal(goalId);

// 2. Remover referência da meta nas tarefas
await dynamodb.update({
  UpdateExpression: "REMOVE goalId SET updatedAt = :updatedAt",
  // ... outras condições
});
```

#### 3. Prevenir Deleção (Recomendado para Seções com Tarefas)

Se uma seção tem tarefas ativas, impedir a deleção ou mover as tarefas:

```javascript
// Verificar se há tarefas ativas
const activeTodos = await getTodosBySection(sectionId, {
  excludeDeleted: true,
});

if (activeTodos.length > 0) {
  throw new Error("Cannot delete section with active tasks");
}

// Ou mover tarefas para outra seção antes de deletar
await moveTodosToSection(sectionId, targetSectionId);
await softDeleteSection(sectionId);
```

### GSI e Soft Delete

Os Global Secondary Indexes (GSIs) também devem considerar soft delete:

#### Estratégia 1: Incluir `deletedAt` no Item (Recomendado)

Manter `deletedAt` no item principal. O FilterExpression funcionará tanto na tabela principal quanto nos GSIs:

```javascript
// Query no GSI com filtro
const result = await dynamodb.query({
  TableName: "artemis-data",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :gsi1pk",
  FilterExpression: "attribute_not_exists(deletedAt)",
  // ...
});
```

#### Estratégia 2: Remover do GSI ao Deletar

Ao deletar um item, também remover suas entradas dos GSIs. Isso requer:

1. Identificar todos os GSIs que o item participa
2. Deletar as entradas correspondentes em cada GSI

**Nota**: Esta estratégia é mais complexa e pode ser desnecessária se o FilterExpression for suficiente.

**Recomendação**: Usar **Estratégia 1** para simplicidade.

### Limpeza Automática (TTL)

Para gerenciar o crescimento da tabela, pode-se usar o recurso TTL (Time To Live) do DynamoDB para deletar permanentemente itens após um período:

#### Configuração de TTL

1. Habilitar TTL na tabela com o atributo `ttl`
2. Definir `ttl` como timestamp Unix (número) quando um item é deletado
3. O DynamoDB deletará automaticamente itens com `ttl < current_time`

```javascript
// Ao fazer soft delete, definir TTL para 90 dias no futuro
const ttlDate = new Date();
ttlDate.setDate(ttlDate.getDate() + 90); // 90 dias
const ttlTimestamp = Math.floor(ttlDate.getTime() / 1000);

await dynamodb.update({
  UpdateExpression:
    "SET deletedAt = :deletedAt, ttl = :ttl, updatedAt = :updatedAt",
  ExpressionAttributeValues: {
    ":deletedAt": new Date().toISOString(),
    ":ttl": ttlTimestamp,
    ":updatedAt": new Date().toISOString(),
  },
});
```

#### Períodos Recomendados de Retenção

| Entidade | Período de Retenção | Justificativa                                 |
| -------- | ------------------- | --------------------------------------------- |
| Todo     | 90 dias             | Tarefas podem ser recuperadas rapidamente     |
| Project  | 180 dias            | Projetos podem ser restaurados por mais tempo |
| Goal     | 180 dias            | Metas são importantes para histórico          |
| Section  | 30 dias             | Seções são menos críticas                     |
| Tag      | 90 dias             | Tags podem ser reutilizadas                   |
| Comment  | 30 dias             | Comentários são menos críticos                |

### Queries para Itens Deletados

Para permitir que usuários vejam e restaurem itens deletados, criar queries específicas:

#### Listar Itens Deletados

```javascript
// Listar projetos deletados
const result = await dynamodb.query({
  TableName: "artemis-data",
  KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
  FilterExpression: "attribute_exists(deletedAt)",
  ExpressionAttributeValues: {
    ":pk": "USER#user-123",
    ":sk": "PROJECT#",
  },
});
```

#### Buscar Item Específico (Incluindo Deletados)

Para buscar um item específico independente do status de deleção, não usar FilterExpression:

```javascript
const result = await dynamodb.get({
  TableName: "artemis-data",
  Key: {
    PK: "USER#user-123#PROJECT#proj-456",
    SK: "TODO#task-101",
  },
});

// Verificar se está deletado
if (result.Item?.deletedAt) {
  // Item está deletado
}
```

### Exemplo Completo: Soft Delete de Projeto

```javascript
async function softDeleteProject(userId, projectId) {
  const timestamp = new Date().toISOString();
  const ttlDate = new Date();
  ttlDate.setDate(ttlDate.getDate() + 180); // 180 dias
  const ttlTimestamp = Math.floor(ttlDate.getTime() / 1000);

  // 1. Deletar projeto
  await dynamodb.update({
    TableName: "artemis-data",
    Key: {
      PK: `USER#${userId}`,
      SK: `PROJECT#${projectId}`,
    },
    UpdateExpression:
      "SET deletedAt = :deletedAt, ttl = :ttl, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":deletedAt": timestamp,
      ":ttl": ttlTimestamp,
      ":updatedAt": timestamp,
    },
  });

  // 2. Buscar e deletar seções
  const sections = await dynamodb.query({
    TableName: "artemis-data",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    FilterExpression: "attribute_not_exists(deletedAt)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}#PROJECT#${projectId}`,
      ":sk": "SECTION#",
    },
  });

  for (const section of sections.Items) {
    await dynamodb.update({
      TableName: "artemis-data",
      Key: {
        PK: section.PK,
        SK: section.SK,
      },
      UpdateExpression:
        "SET deletedAt = :deletedAt, ttl = :ttl, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":deletedAt": timestamp,
        ":ttl": ttlTimestamp,
        ":updatedAt": timestamp,
      },
    });
  }

  // 3. Buscar e deletar tarefas
  const todos = await dynamodb.query({
    TableName: "artemis-data",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    FilterExpression: "attribute_not_exists(deletedAt)",
    ExpressionAttributeValues: {
      ":pk": `USER#${userId}#PROJECT#${projectId}`,
      ":sk": "TODO#",
    },
  });

  for (const todo of todos.Items) {
    await dynamodb.update({
      TableName: "artemis-data",
      Key: {
        PK: todo.PK,
        SK: todo.SK,
      },
      UpdateExpression:
        "SET deletedAt = :deletedAt, ttl = :ttl, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":deletedAt": timestamp,
        ":ttl": ttlTimestamp,
        ":updatedAt": timestamp,
      },
    });

    // 4. Atualizar GSIs (remover ou marcar como deletado)
    // Isso depende da estratégia escolhida para GSIs
  }
}
```

### Resumo de Implementação

1. ✅ Adicionar campo `deletedAt` em todas as entidades
2. ✅ Usar `UpdateItem` ao invés de `DeleteItem` para exclusões
3. ✅ Adicionar `FilterExpression: 'attribute_not_exists(deletedAt)'` em todas as queries
4. ✅ Implementar cascata de soft delete conforme regras de negócio
5. ✅ Configurar TTL para limpeza automática após período de retenção
6. ✅ Criar endpoints para listar e restaurar itens deletados
7. ✅ Documentar comportamento de soft delete na API

---

## Tarefas Recorrentes (Recurring Tasks)

### Visão Geral

O sistema suporta **tarefas recorrentes** que se repetem automaticamente em intervalos definidos. A abordagem é **lazy generation** (geração sob demanda): ao invés de criar todas as instâncias futuras de uma vez, criamos apenas a próxima instância quando a tarefa atual é completada.

**Princípios**:

- ✅ Criar apenas quando necessário (quando completar a tarefa atual)
- ✅ Não criar milhões de tarefas futuras
- ✅ Manter histórico de tarefas geradas
- ✅ Permitir pausar/retomar recorrência
- ✅ Suportar diferentes tipos de recorrência (diária, semanal, mensal, customizada)

### Como Funciona

#### 1. Criação de Tarefa Recorrente

Quando o usuário cria uma tarefa recorrente (ex: "Ração do bob - a cada 15 dias"):

```javascript
// 1. Criar a tarefa inicial
const todo = {
  id: "todo-001",
  title: "Ração do bob",
  dueDate: "2025-01-15",
  isRecurring: true,
  // ... outros campos
};

// 2. Criar o template de recorrência
const recurrenceTemplate = {
  id: "recurrence-001",
  todoId: "todo-001", // Tarefa original
  recurrenceType: "custom",
  recurrenceInterval: 15,
  recurrenceUnit: "days",
  recurrenceEndDate: null, // Sem fim
  isActive: true,
};
```

**No DynamoDB**:

- A tarefa é armazenada normalmente na tabela principal
- O template de recorrência é armazenado separadamente
- A tarefa referencia o template via `recurrenceTemplateId`

#### 2. Conclusão e Geração da Próxima Instância

Quando o usuário completa uma tarefa recorrente:

```javascript
async function completeRecurringTodo(todoId) {
  // 1. Marcar tarefa como completa
  await markTodoAsCompleted(todoId);

  // 2. Buscar template de recorrência
  const template = await getRecurrenceTemplateByTodoId(todoId);

  if (!template || !template.isActive) {
    return; // Não é recorrente ou está pausado
  }

  // 3. Verificar se deve gerar próxima instância
  if (shouldGenerateNextInstance(template)) {
    // 4. Calcular próxima data
    const nextDueDate = calculateNextDueDate(
      template,
      todo.dueDate, // Data da tarefa completada
    );

    // 5. Criar nova tarefa
    const nextTodo = await createNextRecurringTodo(
      template,
      todo, // Tarefa original como referência
      nextDueDate,
    );

    // 6. Atualizar template
    await updateRecurrenceTemplate(template.id, {
      lastGeneratedDate: new Date().toISOString(),
    });
  }
}
```

#### 3. Criação da Próxima Tarefa

```javascript
async function createNextRecurringTodo(template, parentTodo, nextDueDate) {
  // Buscar última sequência
  const lastSequence = await getLastRecurrenceSequence(template.id);
  const nextSequence = (lastSequence || 0) + 1;

  // Criar nova tarefa baseada na original
  const newTodo = {
    id: generateTodoId(),
    userId: parentTodo.userId,
    title: parentTodo.title,
    description: parentTodo.description,
    projectId: parentTodo.projectId,
    sectionId: parentTodo.sectionId, // Ou voltar para seção inicial
    goalId: parentTodo.goalId,
    priority: parentTodo.priority,
    dueDate: nextDueDate,
    isRecurring: true,
    recurrenceTemplateId: template.id,
    parentTodoId: parentTodo.id, // Referência à tarefa pai
    recurrenceSequence: nextSequence,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Copiar tags se necessário
  if (parentTodo.tags) {
    newTodo.tags = [...parentTodo.tags];
  }

  return await createTodo(newTodo);
}
```

### Tipos de Recorrência Suportados

#### 1. Diária (Daily)

```javascript
{
  recurrenceType: "daily",
  recurrenceInterval: 1,
  recurrenceUnit: "days"
}
```

**Exemplo**: Tarefa que se repete todo dia.

#### 2. Semanal (Weekly)

```javascript
{
  recurrenceType: "weekly",
  recurrenceDaysOfWeek: [1, 3, 5] // Segunda, quarta, sexta
}
```

**Exemplo**: Tarefa que se repete toda segunda, quarta e sexta.

#### 3. Quinzenal (Biweekly)

```javascript
{
  recurrenceType: "biweekly",
  recurrenceInterval: 2,
  recurrenceUnit: "weeks"
}
```

**Exemplo**: Tarefa que se repete a cada 2 semanas.

#### 4. Mensal (Monthly)

```javascript
{
  recurrenceType: "monthly",
  recurrenceDayOfMonth: 1 // Todo dia 1º do mês
}
```

**Exemplo**: Tarefa que se repete todo dia 1º de cada mês.

#### 5. Customizada (Custom)

```javascript
{
  recurrenceType: "custom",
  recurrenceInterval: 15,
  recurrenceUnit: "days"
}
```

**Exemplo**: Tarefa que se repete a cada 15 dias (como no seu caso).

### Cálculo da Próxima Data

```javascript
function calculateNextDueDate(template, currentDueDate) {
  const current = new Date(currentDueDate);
  let next = new Date(current);

  switch (template.recurrenceType) {
    case "daily":
      next.setDate(next.getDate() + template.recurrenceInterval);
      break;

    case "weekly":
      // Encontrar próximo dia da semana válido
      const daysOfWeek = template.recurrenceDaysOfWeek || [current.getDay()];
      let daysToAdd = 1;
      while (!daysOfWeek.includes((current.getDay() + daysToAdd) % 7)) {
        daysToAdd++;
      }
      next.setDate(next.getDate() + daysToAdd);
      break;

    case "biweekly":
      next.setDate(next.getDate() + template.recurrenceInterval * 7);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + 1);
      if (template.recurrenceDayOfMonth) {
        next.setDate(template.recurrenceDayOfMonth);
      }
      break;

    case "custom":
      if (template.recurrenceUnit === "days") {
        next.setDate(next.getDate() + template.recurrenceInterval);
      } else if (template.recurrenceUnit === "weeks") {
        next.setDate(next.getDate() + template.recurrenceInterval * 7);
      } else if (template.recurrenceUnit === "months") {
        next.setMonth(next.getMonth() + template.recurrenceInterval);
      }
      break;
  }

  return next.toISOString().split("T")[0]; // Retornar apenas a data (YYYY-MM-DD)
}
```

### Verificação de Limites

```javascript
function shouldGenerateNextInstance(template) {
  // Verificar se está ativo
  if (!template.isActive) {
    return false;
  }

  // Verificar data final
  if (template.recurrenceEndDate) {
    const endDate = new Date(template.recurrenceEndDate);
    const today = new Date();
    if (today > endDate) {
      return false;
    }
  }

  // Verificar número máximo de ocorrências
  if (template.recurrenceCount) {
    const generatedCount = await countGeneratedTodos(template.id);
    if (generatedCount >= template.recurrenceCount) {
      return false;
    }
  }

  return true;
}
```

### Estrutura no DynamoDB

#### Tarefa Original (Recorrente)

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#todo-001",
  "entityType": "TODO",
  "id": "todo-001",
  "userId": "user-123",
  "title": "Ração do bob",
  "dueDate": "2025-01-15",
  "isRecurring": true,
  "recurrenceTemplateId": "recurrence-001",
  "parentTodoId": null,
  "recurrenceSequence": null,
  "completed": false,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-01T10:00:00Z"
}
```

#### Template de Recorrência

```json
{
  "PK": "USER#user-123",
  "SK": "RECURRENCE#recurrence-001",
  "entityType": "RECURRENCE_TEMPLATE",
  "id": "recurrence-001",
  "userId": "user-123",
  "todoId": "todo-001",
  "recurrenceType": "custom",
  "recurrenceInterval": 15,
  "recurrenceUnit": "days",
  "recurrenceEndDate": null,
  "recurrenceCount": null,
  "lastGeneratedDate": "2025-01-15T14:30:00Z",
  "isActive": true,
  "deletedAt": null,
  "createdAt": "2025-01-01T10:00:00Z",
  "updatedAt": "2025-01-15T14:30:00Z"
}
```

#### Tarefa Gerada (Instância)

```json
{
  "PK": "USER#user-123#PROJECT#proj-456",
  "SK": "TODO#todo-002",
  "entityType": "TODO",
  "id": "todo-002",
  "userId": "user-123",
  "title": "Ração do bob",
  "dueDate": "2025-01-30",
  "isRecurring": true,
  "recurrenceTemplateId": "recurrence-001",
  "parentTodoId": "todo-001",
  "recurrenceSequence": 1,
  "completed": false,
  "createdAt": "2025-01-15T14:30:00Z",
  "updatedAt": "2025-01-15T14:30:00Z"
}
```

### Queries Relacionadas

#### Buscar Template por Tarefa

```javascript
// Buscar template de recorrência de uma tarefa
const template = await dynamodb.query({
  TableName: "artemis-data",
  KeyConditionExpression: "PK = :pk AND SK = :sk",
  ExpressionAttributeValues: {
    ":pk": "USER#user-123",
    ":sk": "RECURRENCE#recurrence-001",
  },
});
```

#### Buscar Todas as Instâncias de uma Recorrência

```javascript
// Buscar todas as tarefas geradas por um template
const instances = await dynamodb.query({
  TableName: "artemis-data",
  IndexName: "GSI7", // Novo GSI para recorrência
  KeyConditionExpression: "GSI7PK = :gsi7pk",
  FilterExpression: "attribute_not_exists(deletedAt)",
  ExpressionAttributeValues: {
    ":gsi7PK": "USER#user-123#RECURRENCE#recurrence-001",
  },
});
```

#### Buscar Histórico de Tarefas (Pai → Filhas)

```javascript
// Buscar todas as tarefas filhas de uma tarefa pai
const children = await dynamodb.query({
  TableName: "artemis-data",
  IndexName: "GSI8", // Novo GSI para parentTodoId
  KeyConditionExpression: "GSI8PK = :gsi8pk",
  FilterExpression: "attribute_not_exists(deletedAt)",
  ExpressionAttributeValues: {
    ":gsi8PK": "USER#user-123#PARENT#todo-001",
  },
});
```

### Novos GSIs Necessários

#### GSI7: RecurrenceTemplateIndex - Busca por Template de Recorrência

**Uso**: Buscar todas as instâncias geradas por um template

- **GSI7PK**: `USER#userId#RECURRENCE#recurrenceTemplateId`
- **GSI7SK**: `TODO#PENDING#dueDate#todoId` (pendentes) ou `TODO#COMPLETED#completedAt#todoId` (concluídas)

**Exemplo**:

- Instância pendente: `GSI7PK = USER#user-123#RECURRENCE#recurrence-001`, `GSI7SK = TODO#PENDING#2025-01-30#todo-002`
- Instância concluída: `GSI7PK = USER#user-123#RECURRENCE#recurrence-001`, `GSI7SK = TODO#COMPLETED#2025-01-30T14:30:00Z#todo-002`

#### GSI8: ParentTodoIndex - Busca por Tarefa Pai

**Uso**: Buscar todas as tarefas filhas de uma tarefa pai (histórico de recorrência)

- **GSI8PK**: `USER#userId#PARENT#parentTodoId`
- **GSI8SK**: `TODO#PENDING#recurrenceSequence#todoId` (pendentes) ou `TODO#COMPLETED#completedAt#todoId` (concluídas)

**Exemplo**:

- Tarefa filha pendente: `GSI8PK = USER#user-123#PARENT#todo-001`, `GSI8SK = TODO#PENDING#1#todo-002`
- Tarefa filha concluída: `GSI8PK = USER#user-123#PARENT#todo-001`, `GSI8SK = TODO#COMPLETED#2025-01-30T14:30:00Z#todo-002`

### Fluxo Completo: Exemplo Prático

**Cenário**: Usuário cria tarefa "Ração do bob" que se repete a cada 15 dias.

1. **Criação Inicial** (2025-01-01):
   - Usuário cria tarefa com `dueDate: "2025-01-15"`
   - Sistema cria template de recorrência: `interval: 15, unit: "days"`
   - Tarefa é salva com `isRecurring: true` e `recurrenceTemplateId`

2. **Primeira Conclusão** (2025-01-15):
   - Usuário completa a tarefa
   - Sistema detecta que é recorrente
   - Calcula próxima data: `2025-01-30` (15 dias depois)
   - Cria nova tarefa com `parentTodoId: "todo-001"` e `recurrenceSequence: 1`
   - Atualiza template: `lastGeneratedDate: "2025-01-15"`

3. **Segunda Conclusão** (2025-01-30):
   - Usuário completa a segunda tarefa
   - Sistema calcula próxima data: `2025-02-14` (15 dias depois)
   - Cria nova tarefa com `recurrenceSequence: 2`
   - E assim por diante...

### Casos Especiais

#### 1. Editar Tarefa Recorrente

- **Editar instância única**: Editar apenas a tarefa atual (não afeta template)
- **Editar todas as futuras**: Atualizar template e aplicar mudanças nas próximas instâncias
- **Editar todas (passadas e futuras)**: Atualizar template e todas as instâncias existentes

#### 2. Deletar Tarefa Recorrente

- **Deletar instância única**: Deletar apenas a tarefa atual (próxima será gerada normalmente)
- **Deletar todas as futuras**: Marcar template como `isActive: false` ou deletar template
- **Deletar todas**: Deletar template e todas as instâncias (soft delete)

#### 3. Pausar/Retomar Recorrência

```javascript
// Pausar
await updateRecurrenceTemplate(templateId, {
  isActive: false,
});

// Retomar
await updateRecurrenceTemplate(templateId, {
  isActive: true,
});
```

#### 4. Tarefa Atrasada

Se uma tarefa recorrente está atrasada e o usuário completa:

- Calcular próxima data a partir da data de vencimento original (não da data de conclusão)
- Ou calcular a partir da data de conclusão (configurável)

**Recomendação**: Calcular a partir da data de vencimento original para manter o intervalo consistente.

### Resumo de Implementação

1. ✅ Adicionar campos `isRecurring`, `recurrenceTemplateId`, `parentTodoId`, `recurrenceSequence` na entidade Todo
2. ✅ Criar entidade `RecurrenceTemplate` com configurações de recorrência
3. ✅ Implementar lógica de geração da próxima instância ao completar tarefa
4. ✅ Criar funções de cálculo de próxima data para cada tipo de recorrência
5. ✅ Adicionar GSIs (GSI7 e GSI8) para queries de recorrência
6. ✅ Implementar endpoints de gerenciamento de recorrência
7. ✅ Tratar casos especiais (editar, deletar, pausar)

---

## Notas Finais

1. **Isolamento Multi-tenant**: Todos os padrões de acesso incluem `userId` na PK, garantindo isolamento completo entre usuários.

2. **Performance**: O Single Table Design reduz o número de queries necessárias, mas requer cuidado na modelagem das chaves.

3. **Escalabilidade**: O DynamoDB escala automaticamente, mas é importante distribuir bem as chaves de partição (evitar hot partitions).

4. **Custos**: GSIs têm custos adicionais de armazenamento e escrita. Avaliar se todos são necessários.

5. **Atualizações**: Quando uma tarefa muda de seção ou projeto, é necessário atualizar múltiplos GSIs. Considerar transações DynamoDB para garantir consistência.

6. **Ordenação**: A ordenação no DynamoDB é feita pela SK. Para ordenações complexas, pode ser necessário usar campos adicionais ou fazer ordenação na aplicação.

7. **Busca de Tarefas Futuras**: Para buscar tarefas futuras, pode ser necessário fazer múltiplas queries (uma por data) ou usar um GSI com range query. Alternativamente, usar um campo `dueDateTimestamp` numérico para facilitar range queries.

8. **Soft Delete**: Todas as queries devem incluir `FilterExpression: attribute_not_exists(deletedAt)` para excluir itens deletados. Itens deletados são mantidos por um período (TTL) antes de serem removidos permanentemente.

---

## Próximos Passos

1. Implementar a estrutura de tabelas no DynamoDB
2. Criar funções Lambda para cada operação
3. Implementar cache (opcional) para queries frequentes
4. Configurar backups automáticos
5. Implementar versionamento de schema (se necessário)
6. Criar testes de carga para validar performance
