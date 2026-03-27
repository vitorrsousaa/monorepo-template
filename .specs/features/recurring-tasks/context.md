# Recurring Tasks — Context

**Gathered:** 2026-03-26
**Spec:** `.specs/features/recurring-tasks/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Tasks can have a recurrence rule (daily/weekly/monthly/yearly with end conditions). When completed, the backend creates the next occurrence automatically. Users can set and edit recurrence on create and update.

---

## Implementation Decisions

### Completion + Next Occurrence

- **Optimistic update:** ao completar task recorrente, a próxima ocorrência aparece imediatamente no cache (tempId + `OptimisticState.PENDING`), substituída pelo dado real da API no `onSuccess` — mesmo padrão do `useCreateTasks`
- **Resposta da API:** endpoint de completion retorna `{ task, nextTask? }` para que o SPA atualize o cache com dado real
- **`nextTaskId`:** a task completada armazena o ID da próxima ocorrência criada. Ao completar novamente (após uncomplete), o backend verifica via `repo.getByUserId(nextTaskId)` se já existe task pendente — se sim, não cria outra

### Uncomplete (Desfazer)

- Uncomplete **não deleta** a próxima ocorrência — ela permanece independente
- A proteção contra duplicatas é feita pelo campo `nextTaskId` (verifica antes de criar)

### Cálculo da Próxima Data

- **Com dueDate:** próxima data calculada a partir do `dueDate` original, mesmo que a task tenha sido completada depois (ex: dueDate=10, completou dia 12 → calcula a partir do dia 10)
- **Sem dueDate:** usa `completedAt` como base
- Nota: recurrence sem dueDate pode não fazer muito sentido — decisão de manter por agora, mas pode ser revisitada

### Weekly Days

- **Próximo dia válido a partir de hoje**, independente de quando completou ou se houve atraso
- Exemplo: task Seg+Ter+Qui, completou a de Segunda na Terça → próxima criada para Quinta
- Exemplo: task Seg+Qua+Sex, completou na Quinta (dia não-agendado) → próxima criada para Sexta
- **Uma task por completion** — sempre cria para o próximo dia agendado imediatamente

### Update Endpoint

- **Update geral** de todos os campos da task (título, descrição, prioridade, dueDate, project, section, recurrence) — resolve dívida técnica de não ter endpoint de edição
- Editar recurrence **só afeta a task editada** — a próxima ocorrência gerada usará a regra atualizada, sem cascata

### Indicador Visual

- **Ícone de recorrência visível no card** da task em todas as listas (inbox, today, project detail, upcoming) — sem precisar abrir a task para ver
- **Tooltip com a regra descritiva** ao passar o mouse (ex: "Repeats weekly on Mon, Wed, Fri", "Repeats daily", "Repeats monthly, ends after 5 occurrences")
- Posicionamento: em local que faça sentido no design do card, sem poluir visualmente

---

## Specific References

- Padrão de optimistic update: seguir exatamente o que já existe em `useCreateTasks` e `useUpdateTaskCompletion` (cancelQueries → snapshot → setQueryData → onSuccess replace)
- `nextTaskId` como campo de vínculo: aproveitando `repo.getByUserId()` que já existe para verificar duplicatas

---

## Deferred Ideas

- Recurrence sem dueDate: avaliar se faz sentido forçar dueDate obrigatória para tasks recorrentes (decisão adiada)
- Custom intervals (ex: "a cada 3 dias", "a cada 2 semanas") — fora do escopo atual
- Histórico/cadeia de recorrências (linking entre ocorrências) — fora do escopo atual
