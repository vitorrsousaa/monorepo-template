import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";
import type { QueryClient } from "@tanstack/react-query";
import type { TaskWithOptimisticState } from "./types";

type TasksInboxItem = WithOptimisticState<Partial<Task>>;

type TasksInboxData = {
	tasks: TasksInboxItem[];
	total: number;
};

/**
 * Typed cache helper for the inbox tasks query.
 *
 * Centralizes {@link QueryClient.setQueryData} / `getQueryData` for `QUERY_KEYS.TASKS.INBOX`
 * so mutations can apply optimistic updates without duplicating key or shape logic.
 *
 * @param queryClient - TanStack Query client instance.
 * @returns Methods to read and mutate cached inbox task list + total.
 */
export function tasksInboxCache(queryClient: QueryClient) {
	const queryKey = QUERY_KEYS.TASKS.INBOX;

	return {
		/**
		 * Reads the current inbox list from the cache and normalizes items with {@link OptimisticState.SYNCED}.
		 *
		 * @returns Cached tasks (empty list if unset) and total count.
		 */
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

		/**
		 * Appends a new row for an in-flight **create** (optimistic UI).
		 *
		 * The row uses `tempId` until {@link replaceWithReal} runs; `total` increments by 1.
		 *
		 * @param tempId - Client-generated id for the pending row (see optimistic create flow).
		 * @param data - Partial task fields to show while the request is pending.
		 */
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

		/**
		 * Flags an optimistic row (matched by `tempId`) as failed after the create request errors.
		 *
		 * @param tempId - Same id passed to {@link addOptimistic}.
		 */
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

		/**
		 * Replaces the pending row identified by `tempId` with the **server** task (real id + fields).
		 *
		 * Call on successful create; clears optimistic state to {@link OptimisticState.SYNCED}.
		 *
		 * @param tempId - Temporary id from {@link addOptimistic}.
		 * @param realTask - Task returned by the API.
		 */
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

		/**
		 * Removes a task row from the inbox cache and decrements `total` (floor at 0).
		 *
		 * @param id - Task id to remove (temp or server id, depending on flow).
		 */
		remove(id: string) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					tasks: old.tasks.filter((t) => t.id !== id),
					total: Math.max(0, (old.total ?? 0) - 1),
				};
			});
		},

		/**
		 * Optimistically toggles completion for an existing inbox task; updates `completedAt` to now when completing.
		 *
		 * @param taskId - Server id of the task.
		 * @param nextCompleted - Target checkbox state after the user action.
		 */
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

		/**
		 * Updates an optimistic task in the inbox tasks data.
		 * @param taskId - The ID of the task to update.
		 * @param patch - The patch to apply to the task.
		 */
		patchTaskOptimistic(taskId: string, patch: Partial<TaskWithOptimisticState>) {
			queryClient.setQueryData<TasksInboxData>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					tasks: old.tasks.map((t) =>
						t.id === taskId ? { ...t, ...patch } : t,
					),
				};
			});
		},

		/**
		 * Replaces a row whose id equals `task.id` with the payload from the API (authoritative snapshot).
		 *
		 * Use after create replace ({@link replaceWithReal}) or any mutation that returns the full {@link Task}.
		 *
		 * @param task - Task from the server response.
		 */
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
