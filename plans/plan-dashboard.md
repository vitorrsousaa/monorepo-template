# Plano: Dashboard Analytics — Cards de Métricas

## Objetivo

Implementar o endpoint `GET /tasks/dashboard` que retorna os dados dos 4 cards de métricas do dashboard:
1. **Concluídas** — quantidade de tasks concluídas hoje
2. **Atrasadas** — tasks com `dueDate < hoje` e ainda pendentes
3. **Previstas para hoje** — tasks com `dueDate = hoje` + quantidade de concluídas hoje
4. **Eficiência** — `tasksConcluídasHoje / (tasksConcluídasHoje + tasksPendentesHoje)`

---

## Arquitetura atual (o que já existe)

Já existe um esqueleto do endpoint com a estrutura completa de arquivos:

| Camada | Arquivo | Status |
|--------|---------|--------|
| Domain Entity | `core/domain/task/dashboard/dashboard-analytics.ts` | Existe (só `efficiency`) |
| Service DTO | `app/modules/tasks/services/get-dashboard-analytics/dto.ts` | Existe (usa DashboardAnalytics) |
| Service | `app/modules/tasks/services/get-dashboard-analytics/service.ts` | Existe (retorna mock `efficiency: 40`) |
| Controller | `app/modules/tasks/controllers/get-dashboard-analytics/controller.ts` | Existe (retorna `result` direto) |
| Schema | `app/modules/tasks/controllers/get-dashboard-analytics/schema.ts` | Existe |
| Factory Service | `factories/services/tasks/get-dashboard-analytics.ts` | Existe (instancia repos mas não injeta) |
| Factory Controller | `factories/controllers/tasks/get-dashboard-analytics.ts` | Existe |
| Lambda Handler | `server/functions/tasks/get-dashboard-analytics/handler.ts` | Existe |
| serverless.yml | `GET /tasks/dashboard` | Já registrado |

**Não existe:**
- Contract no pacote `packages/contracts` para o dashboard
- Métodos no `ITodoRepository` para buscar tasks concluídas hoje e atrasadas
- Implementação real no `TodoDynamoRepository`
- Service e hook no SPA para consumir esse endpoint
- Query key para dashboard no SPA

---

## Etapas de Implementação

### Etapa 1 — Domain Entity (expandir `DashboardAnalytics`)

**Arquivo:** `apps/api/src/core/domain/task/dashboard/dashboard-analytics.ts`

Expandir a interface para refletir os 4 cards:

```ts
export interface DashboardAnalytics {
  /** Quantidade de tasks concluídas hoje (card "Concluídas") */
  completedToday: number

  /** Quantidade de tasks atrasadas: dueDate < hoje AND completed = false (card "Atrasadas") */
  overdue: number

  /** Quantidade de tasks previstas para hoje: dueDate = hoje (card "Previstas") */
  scheduledToday: number

  /** Quantidade de tasks concluídas hoje — usado no card "Previstas" como info complementar */
  completedOfScheduledToday: number

  /**
   * Eficiência do dia (card "Eficiência")
   * Cálculo: completedToday / (completedToday + pendingToday)
   * Onde pendingToday = tasks com dueDate = hoje AND completed = false
   * Valor de 0 a 100 (percentual inteiro)
   */
  efficiency: number
}
```

**Por quê separar `completedOfScheduledToday`?**
- `completedToday` = todas tasks concluídas hoje (independente do dueDate)
- `completedOfScheduledToday` = tasks que tinham dueDate = hoje e foram concluídas — usado como info complementar no card "Previstas para hoje"

> **Decisão importante:** O card "Concluídas" mostra tasks que foram completadas hoje (`completedAt` no dia de hoje), independente do dueDate. Já o `completedOfScheduledToday` mostra quantas tasks do dia de hoje (dueDate = hoje) já foram concluídas. São métricas diferentes.

---

### Etapa 2 — Contracts (pacote compartilhado)

**Criar arquivo:** `packages/contracts/src/tasks/dashboard/index.ts`

```ts
export interface GetDashboardAnalyticsResponse {
  /** Tasks concluídas hoje */
  completedToday: number

  /** Tasks atrasadas (dueDate < hoje, pendentes) */
  overdue: number

  /** Tasks previstas para hoje (dueDate = hoje) */
  scheduledToday: number

  /** Quantas das previstas para hoje já foram concluídas */
  completedOfScheduledToday: number

  /** Eficiência do dia (0-100) */
  efficiency: number
}
```

**Atualizar barrel export** em `packages/contracts/src/tasks/` se houver um `index.ts`, ou adicionar a referência onde necessário.

> **Convenção do projeto:** O pacote `@repo/contracts` define as interfaces de wire format (request/response). O SPA e a API importam deste pacote para manter o contrato tipado.

---

### Etapa 3 — Repository Layer (novos métodos)

#### 3.1 — Interface `ITodoRepository`

**Arquivo:** `apps/api/src/data/protocols/todo/todo-repository.ts`

Adicionar 3 novos métodos:

```ts
/**
 * Busca tasks concluídas hoje (completedAt no dia de hoje).
 * Usado para o card "Concluídas" do dashboard.
 */
findCompletedToday(userId: string): Promise<Todo[]>;

/**
 * Busca tasks atrasadas: dueDate < hoje AND completed = false.
 * Usado para o card "Atrasadas" do dashboard.
 */
findOverdue(userId: string): Promise<Todo[]>;

/**
 * Busca tasks previstas para hoje: dueDate = hoje (incluindo concluídas e pendentes).
 * Usado para os cards "Previstas" e "Eficiência" do dashboard.
 */
findScheduledToday(userId: string): Promise<Todo[]>;
```

**Por que 3 queries separadas ao invés de 1 query genérica?**
- Cada query mapeia um padrão de acesso do DynamoDB (GSI diferente no futuro)
- `findCompletedToday` usará um índice por `completedAt`
- `findOverdue` usará o índice por `dueDate` com filtro de `completed = false`
- `findScheduledToday` usará o índice por `dueDate` com data exata
- Manter queries separadas facilita otimização individual quando migrar para DynamoDB real

#### 3.2 — Implementação `TodoDynamoRepository`

**Arquivo:** `apps/api/src/infra/db/dynamodb/repositories/todo/todo-dynamo-repository.ts`

Implementar os 3 novos métodos usando o array in-memory (seguindo o padrão existente):

```ts
async findCompletedToday(userId: string): Promise<Todo[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return this.dbTodos
    .filter((t) => t.user_id === userId && t.completed === true)
    .filter((t) => {
      if (!t.completed_at) return false;
      const completedMs = new Date(t.completed_at).getTime();
      return completedMs >= todayStart.getTime() && completedMs <= todayEnd.getTime();
    })
    .map((dbTodo) => this.mapper.toDomain(dbTodo));
}

async findOverdue(userId: string): Promise<Todo[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return this.dbTodos
    .filter((t) => t.user_id === userId && t.completed === false)
    .filter((t) => {
      if (!t.due_date) return false;
      return new Date(t.due_date).getTime() < todayStart.getTime();
    })
    .map((dbTodo) => this.mapper.toDomain(dbTodo));
}

async findScheduledToday(userId: string): Promise<Todo[]> {
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  return this.dbTodos
    .filter((t) => t.user_id === userId)
    .filter((t) => {
      if (!t.due_date) return false;
      return t.due_date.startsWith(todayStr);
    })
    .map((dbTodo) => this.mapper.toDomain(dbTodo));
}
```

> **Nota:** Os métodos retornam `Todo[]` (domain) e não contagens. O service faz os cálculos. Isso mantém o repository como camada de acesso a dados pura, sem lógica de negócio.

---

### Etapa 4 — Service (lógica de negócio)

**Arquivo:** `apps/api/src/app/modules/tasks/services/get-dashboard-analytics/service.ts`

Reescrever o service para injetar `ITodoRepository` e implementar os cálculos:

```ts
import type { IService } from "@application/interfaces/service";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import type { GetDashboardAnalyticsInput, GetDashboardAnalyticsOutput } from "./dto";

export interface IGetDashboardAnalyticsService
  extends IService<GetDashboardAnalyticsInput, GetDashboardAnalyticsOutput> {}

export class GetDashboardAnalyticsService implements IGetDashboardAnalyticsService {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(input: GetDashboardAnalyticsInput): Promise<GetDashboardAnalyticsOutput> {
    // 1. Buscar dados do repository (3 queries em paralelo)
    const [completedTodayTasks, overdueTasks, scheduledTodayTasks] = await Promise.all([
      this.todoRepository.findCompletedToday(input.userId),
      this.todoRepository.findOverdue(input.userId),
      this.todoRepository.findScheduledToday(input.userId),
    ]);

    // 2. Calcular métricas
    const completedToday = completedTodayTasks.length;
    const overdue = overdueTasks.length;
    const scheduledToday = scheduledTodayTasks.length;

    // Tasks previstas para hoje que já foram concluídas
    const completedOfScheduledToday = scheduledTodayTasks.filter((t) => t.completed).length;

    // Tasks previstas para hoje que ainda estão pendentes
    const pendingToday = scheduledTodayTasks.filter((t) => !t.completed).length;

    // 3. Calcular eficiência do dia
    // Fórmula: completedToday / (completedToday + pendingToday)
    // Se denominador = 0, eficiência = 0 (sem tasks para medir)
    const denominator = completedToday + pendingToday;
    const efficiency = denominator > 0 ? Math.round((completedToday / denominator) * 100) : 0;

    return {
      completedToday,
      overdue,
      scheduledToday,
      completedOfScheduledToday,
      efficiency,
    };
  }
}
```

**Detalhe do cálculo de eficiência:**
- `completedToday` = tasks concluídas hoje (qualquer dueDate)
- `pendingToday` = tasks com dueDate = hoje que ainda não foram concluídas
- `efficiency = completedToday / (completedToday + pendingToday) * 100`
- Se não houver nenhuma task para medir (denominador = 0), retorna 0

---

### Etapa 5 — Factory (injeção de dependência)

**Arquivo:** `apps/api/src/factories/services/tasks/get-dashboard-analytics.ts`

Corrigir para injetar o `todoRepository` no service:

```ts
import { GetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";
import { makeTodoDynamoRepository } from "@infra/db/dynamodb/factories/todo-repository-factory";

export function makeGetDashboardAnalyticsService(): GetDashboardAnalyticsService {
  const todoRepository = makeTodoDynamoRepository();
  return new GetDashboardAnalyticsService(todoRepository);
}
```

> **Nota:** Remover o import de `makeProjectDynamoRepository` que não é mais necessário neste service.

---

### Etapa 6 — Controller (mapear para contrato)

**Arquivo:** `apps/api/src/app/modules/tasks/controllers/get-dashboard-analytics/controller.ts`

Atualizar o controller para usar o contrato do `@repo/contracts`:

```ts
import type { IController } from "@application/interfaces/controller";
import type { IRequest, IResponse } from "@application/interfaces/http";
import { errorHandler } from "@application/utils/error-handler";
import { missingFields } from "@application/utils/missing-fields";
import type { IGetDashboardAnalyticsService } from "@application/modules/tasks/services/get-dashboard-analytics";
import type { GetDashboardAnalyticsResponse } from "@repo/contracts/tasks/dashboard";
import { getDashboardAnalyticsSchema } from "./schema";

export class GetDashboardAnalyticsController implements IController {
  constructor(private readonly getDashboardAnalyticsService: IGetDashboardAnalyticsService) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const [status, parsedBody] = missingFields(getDashboardAnalyticsSchema, {
        ...request.body,
        userId: request.userId || "",
      });

      if (!status) return parsedBody;

      const result = await this.getDashboardAnalyticsService.execute(parsedBody);

      const body: GetDashboardAnalyticsResponse = {
        completedToday: result.completedToday,
        overdue: result.overdue,
        scheduledToday: result.scheduledToday,
        completedOfScheduledToday: result.completedOfScheduledToday,
        efficiency: result.efficiency,
      };

      return {
        statusCode: 200,
        body,
      };
    } catch (error) {
      return errorHandler(error);
    }
  }
}
```

> **Nota:** Neste caso o domain entity (`DashboardAnalytics`) tem a mesma shape do contrato (`GetDashboardAnalyticsResponse`) pois são todos valores primitivos. Mesmo assim, fazemos o mapeamento explícito no controller para manter a separação entre camadas. Se no futuro o domain entity divergir do contrato, o controller já está preparado.

---

### Etapa 7 — SPA: Service HTTP

**Criar arquivo:** `apps/spa/src/modules/todo/app/services/get-dashboard-analytics.ts`

```ts
import { httpClient } from "@/services/http-client";
import type { GetDashboardAnalyticsResponse } from "@repo/contracts/tasks/dashboard";

export async function getDashboardAnalytics() {
  const { data } = await httpClient.get<GetDashboardAnalyticsResponse>("/tasks/dashboard");
  return data;
}
```

---

### Etapa 8 — SPA: Query Key

**Arquivo:** `apps/spa/src/app/config/query-keys.ts`

Adicionar a query key para o dashboard:

```ts
TASKS: {
  TODAY: ["tasks", "today"],
  DASHBOARD: ["tasks", "dashboard"],  // ← novo
},
```

---

### Etapa 9 — SPA: Custom Hook

**Criar arquivo:** `apps/spa/src/modules/todo/app/hooks/use-get-dashboard-analytics.ts`

```ts
import { QUERY_KEYS } from "@/config/query-keys";
import type { GetDashboardAnalyticsResponse } from "@repo/contracts/tasks/dashboard";
import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "../services/get-dashboard-analytics";

const EMPTY_DASHBOARD: GetDashboardAnalyticsResponse = {
  completedToday: 0,
  overdue: 0,
  scheduledToday: 0,
  completedOfScheduledToday: 0,
  efficiency: 0,
};

export function useGetDashboardAnalytics() {
  const { data, isError, isPending, isFetching, isLoading, refetch } =
    useQuery({
      queryKey: QUERY_KEYS.TASKS.DASHBOARD,
      queryFn: getDashboardAnalytics,
    });

  return {
    dashboardData: data ?? EMPTY_DASHBOARD,
    isErrorDashboard: isError,
    isFetchingDashboard: isFetching || isPending || isLoading,
    refetchDashboard: refetch,
  };
}
```

---

### Etapa 10 — SPA: Integrar no Dashboard

**Arquivo:** `apps/spa/src/view/pages/app/todo/dashboard/dashboard.tsx`

Substituir os dados mock pelos dados reais da API:

1. Importar o hook `useGetDashboardAnalytics`
2. Remover os `useState` com mocks de tasks/projects para os cards (manter para a lista de tasks de hoje e projetos se necessário)
3. Remover os cálculos locais (`completed`, `overdueTasks`, `todayDone`, `efficiency`)
4. Usar os valores de `dashboardData` diretamente nos cards:

```ts
const { dashboardData, isFetchingDashboard } = useGetDashboardAnalytics();

const stats = [
  {
    label: "Concluídas",
    value: dashboardData.completedToday,
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    trend: "Hoje",
  },
  {
    label: "Atrasadas",
    value: dashboardData.overdue,
    icon: AlertCircle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    trend: dashboardData.overdue === 0 ? "em dia" : "requer atenção",
  },
  {
    label: "Para hoje",
    value: dashboardData.scheduledToday,
    icon: Calendar,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    trend: `${dashboardData.completedOfScheduledToday} concluídas`,
  },
  {
    label: "Eficiência",
    value: `${dashboardData.efficiency}%`,
    icon: TrendingUp,
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    trend: "geral",
  },
];
```

---

## Resumo dos arquivos a modificar/criar

### Modificar (7 arquivos)
| # | Arquivo | O que mudar |
|---|---------|-------------|
| 1 | `core/domain/task/dashboard/dashboard-analytics.ts` | Expandir interface com 5 campos |
| 2 | `data/protocols/todo/todo-repository.ts` | Adicionar 3 métodos |
| 3 | `infra/db/dynamodb/repositories/todo/todo-dynamo-repository.ts` | Implementar 3 métodos |
| 4 | `app/modules/tasks/services/get-dashboard-analytics/service.ts` | Implementar lógica real |
| 5 | `factories/services/tasks/get-dashboard-analytics.ts` | Injetar `todoRepository` |
| 6 | `app/modules/tasks/controllers/get-dashboard-analytics/controller.ts` | Mapear para contrato |
| 7 | `apps/spa/src/app/config/query-keys.ts` | Adicionar `DASHBOARD` key |

### Criar (3 arquivos)
| # | Arquivo | O que criar |
|---|---------|-------------|
| 1 | `packages/contracts/src/tasks/dashboard/index.ts` | Interface `GetDashboardAnalyticsResponse` |
| 2 | `apps/spa/src/modules/todo/app/services/get-dashboard-analytics.ts` | HTTP service |
| 3 | `apps/spa/src/modules/todo/app/hooks/use-get-dashboard-analytics.ts` | React Query hook |

### Integrar (1 arquivo)
| # | Arquivo | O que mudar |
|---|---------|-------------|
| 1 | `apps/spa/src/view/pages/app/todo/dashboard/dashboard.tsx` | Substituir mocks pelo hook |

---

## Ordem de execução recomendada

1. Domain Entity (`DashboardAnalytics`) — base de tudo
2. Contracts (`GetDashboardAnalyticsResponse`) — contrato compartilhado
3. Repository Interface (`ITodoRepository`) — definir métodos
4. Repository Implementation (`TodoDynamoRepository`) — implementar queries
5. Service (`GetDashboardAnalyticsService`) — lógica de negócio
6. Factory Service — injetar dependências
7. Controller — mapear para contrato
8. SPA: Service HTTP
9. SPA: Query Key
10. SPA: Hook
11. SPA: Integrar no Dashboard

---

## Definição dos cálculos (referência rápida)

| Card | Fonte de dados | Cálculo |
|------|---------------|---------|
| Concluídas | `findCompletedToday(userId)` | `completedTodayTasks.length` |
| Atrasadas | `findOverdue(userId)` | `overdueTasks.length` |
| Previstas | `findScheduledToday(userId)` | `scheduledTodayTasks.length` + `completedOfScheduledToday` como info extra |
| Eficiência | Composição dos anteriores | `completedToday / (completedToday + pendingToday) * 100` |

Onde `pendingToday` = tasks de `findScheduledToday` com `completed = false`.
