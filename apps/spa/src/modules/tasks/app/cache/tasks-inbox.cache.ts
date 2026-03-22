import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";
import type { QueryClient } from "@tanstack/react-query";

type TasksInboxItem = WithOptimisticState<Partial<Task>>;

type TasksInboxData = {
	tasks: TasksInboxItem[];
	total: number;
};

export function tasksInboxCache(queryClient: QueryClient) {
	const queryKey = QUERY_KEYS.TASKS.INBOX;

	return {
		get(): TasksInboxData {
			const data = queryClient.getQueryData<GetInboxTasksResponse>(queryKey);
			return {
				tasks: (data?.tasks ?? []).map((t) => ({
					...t,
					optimisticState: OptimisticState.SYNCED,
				})),
				total: data?.total ?? 0,
			};
		},

		addOptimistic(tempId: string, data: Partial<Task>) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				const tasks = old?.tasks ?? [];
				return {
					tasks: [
						...tasks,
						{
							id: tempId,
							optimisticState: OptimisticState.PENDING,
							...data,
						},
					],
					total: (old?.total ?? 0) + 1,
				};
			});
		},

		markError(tempId: string) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					tasks: old.tasks.map((t) =>
						t.id === tempId
							? { ...t, optimisticState: OptimisticState.ERROR }
							: t,
					),
				};
			});
		},

		replaceWithReal(tempId: string, realTask: Task) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					tasks: old.tasks.map((t) =>
						t.id === tempId
							? { ...realTask, optimisticState: OptimisticState.SYNCED }
							: t,
					),
				};
			});
		},

		remove(id: string) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					tasks: old.tasks.filter((t) => t.id !== id),
					total: Math.max(0, (old.total ?? 0) - 1),
				};
			});
		},

		patchTaskCompletionOptimistic(taskId: string, nextCompleted: boolean) {
			const nowIso = new Date().toISOString();
			const completedAt = nextCompleted ? nowIso : null;
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					tasks: old.tasks.map((t) =>
						t.id === taskId
							? { ...t, completed: nextCompleted, completedAt }
							: t,
					),
				};
			});
		},

		replaceTaskFromServer(task: Task) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					tasks: old.tasks.map((t) =>
						t.id === task.id
							? { ...task, optimisticState: OptimisticState.SYNCED }
							: t,
					),
				};
			});
		},
	};
}
