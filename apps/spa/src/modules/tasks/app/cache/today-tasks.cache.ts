import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { Task } from "@repo/contracts/tasks/entities";
import type { QueryClient } from "@tanstack/react-query";
import type { TodayTasksResponseWithOptimisticState } from "../hooks/use-get-today-tasks";
import type { TaskWithOptimisticState } from "./types";

/**
 * Typed cache helper for the inbox tasks query.
 *
 * Centralizes {@link QueryClient.setQueryData} / `getQueryData` for `QUERY_KEYS.TASKS.INBOX`
 * so mutations can apply optimistic updates without duplicating key or shape logic.
 *
 * @param queryClient - TanStack Query client instance.
 * @returns Methods to read and mutate cached inbox task list + total.
 */
export function todayTasksCache(queryClient: QueryClient) {
	const queryKey = QUERY_KEYS.TASKS.TODAY;

	return {
		/**
		 * Reads the current inbox list from the cache and normalizes items with {@link OptimisticState.SYNCED}.
		 *
		 * @returns Cached tasks (empty list if unset) and total count.
		 */
		getSnapshot(): TodayTasksResponseWithOptimisticState {
			const data =
				queryClient.getQueryData<TodayTasksResponseWithOptimisticState>(
					queryKey,
				);
			return {
				projects: (data?.projects ?? []).map((p) => ({
					...p,
					tasks: p.tasks.map((t) => ({
						...t,
						optimisticState: OptimisticState.SYNCED,
					})),
				})),
			};
		},
		restoreSnapshot(snapshot: TodayTasksResponseWithOptimisticState) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				snapshot,
			);
		},
		/**
		 * Optimistically toggles completion for an existing inbox task; updates `completedAt` to now when completing.
		 *
		 * @param taskId - Server id of the task.
		 * @param nextCompleted - Target checkbox state after the user action.
		 */
		patchTaskCompletionOptimistic(taskId: string) {
			const nowIso = new Date().toISOString();
			const completedAt = nowIso;
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						projects: old.projects.map((p) => ({
							...p,
							tasks: p.tasks.map((t) =>
								t.id === taskId ? { ...t, completed: true, completedAt } : t,
							),
						})),
					};
				},
			);
		},

		patchTaskOptimistic(
			taskId: string,
			patch: Partial<TaskWithOptimisticState>,
		) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						projects: old.projects.map((p) => ({
							...p,
							tasks: p.tasks.map((t) =>
								t.id === taskId ? { ...t, ...patch } : t,
							),
						})),
					};
				},
			);
		},

		/**
		 * Replaces a row whose id equals `task.id` with the payload from the API (authoritative snapshot).
		 *
		 * Use after create replace ({@link replaceWithReal}) or any mutation that returns the full {@link Task}.
		 *
		 * @param task - Task from the server response.
		 */
		replaceTaskFromServer(task: Task) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						projects: old.projects.map((p) => ({
							...p,
							tasks: p.tasks.map((t) =>
								t.id === task.id
									? { ...task, optimisticState: OptimisticState.SYNCED }
									: t,
							),
						})),
					};
				},
			);
		},

		addOptimistic(task: Task) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;

					const projectId = task.projectId ?? PROJECTS_DEFAULT_IDS.INBOX;

					return {
						...old,
						projects: old.projects.map((p) =>
							p.id === projectId
								? {
										...p,
										tasks: [
											...p.tasks,
											{ ...task, optimisticState: OptimisticState.PENDING },
										],
									}
								: p,
						),
					};
				},
			);
		},

		markError(taskId: string) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						projects: old.projects.map((p) => ({
							...p,
							tasks: p.tasks.map((t) =>
								t.id === taskId
									? { ...t, optimisticState: OptimisticState.ERROR }
									: t,
							),
						})),
					};
				},
			);
		},

		replaceWithReal(tempId: string, realTask: Task) {
			queryClient.setQueryData<TodayTasksResponseWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						projects: old.projects.map((p) => ({
							...p,
							tasks: p.tasks.map((t) =>
								t.id === tempId
									? { ...realTask, optimisticState: OptimisticState.SYNCED }
									: t,
							),
						})),
					};
				},
			);
		},
	};
}
