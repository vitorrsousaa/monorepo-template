import { QUERY_KEYS } from "@/config/query-keys";
import { projectDetailCache } from "@/modules/projects/app/cache/project-detail.cache";
import { projectsSummaryCache } from "@/modules/projects/app/cache/projects-summary.cache";
import {
	cancelRelatedQueries,
	generateTempId,
	restoreSnapshot,
} from "@/utils/optimistic";
import { OptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { Task } from "@repo/contracts/tasks/entities";
import { calculateNextDueDate } from "@repo/contracts/tasks/recurrence";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { nextRecurrenceForOptimistic } from "../helpers/recurrence";
import type { TodayTasksResponseWithOptimisticState } from "../hooks/use-get-today-tasks";
import { tasksInboxCache } from "./tasks-inbox.cache";
import { todayTasksCache } from "./today-tasks.cache";
import type { TaskWithOptimisticState } from "./types";

export type TaskCacheOrchestratorVariables = {
	projectId: string | null | undefined;
	nextCompleted: boolean;
	task: Task;
};

export type TaskCacheOrchestratorSnapshot = {
	inboxSnapshot: unknown;
	projectDetailSnapshot: unknown;
	projectsSummarySnapshot: unknown;
	todayTasksSnapshot: TodayTasksResponseWithOptimisticState | undefined;
};

export type TaskCacheOrchestrator = {
	cancel: () => Promise<void>;
	patchTaskCompletionOptimistic: () => void;
	addOptimisticNextTask: (task: Task) => string;
	getSnapshot: () => TaskCacheOrchestratorSnapshot;
	replaceTaskFromServer: (task: Task, tempId?: string) => void;
	removeOptimisticTask: (tempId: string, sectionId?: string) => void;
	restoreSnapshot: (snapshot: TaskCacheOrchestratorSnapshot) => void;
};

export function taskCacheOrchestrator(
	queryClient: QueryClient,
	variables: TaskCacheOrchestratorVariables,
): TaskCacheOrchestrator {
	const { projectId, task, nextCompleted } = variables;
	const taskId = task.id;

	const isInbox = Boolean(!projectId);

	const isTodayTask = task.dueDate && task.dueDate <= new Date().toISOString();

	const relatedKeys: QueryKey[] = isInbox
		? [QUERY_KEYS.TASKS.INBOX]
		: [
				QUERY_KEYS.PROJECTS.DETAIL(projectId as string),
				QUERY_KEYS.PROJECTS.SUMMARY,
			];

	if (isTodayTask) {
		relatedKeys.push(QUERY_KEYS.TASKS.TODAY);
	}

	function patchTaskCompletionOptimistic() {
		if (isInbox) {
			tasksInboxCache(queryClient).patchTaskCompletionOptimistic(
				taskId,
				nextCompleted,
			);
		}

		if (!isInbox && projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);
			const summaryCache = projectsSummaryCache(queryClient);

			if (detailCache.exists()) {
				detailCache.patchTaskCompletionOptimistic(taskId, nextCompleted);
			}

			if (nextCompleted) {
				detailCache.incrementCompletedCount();
				summaryCache.incrementCompletedCount(projectId);
			} else {
				detailCache.decrementCompletedCount();
				summaryCache.decrementCompletedCount(projectId);
			}
		}

		if (isTodayTask) {
			todayTasksCache(queryClient).patchTaskCompletionOptimistic(taskId);
		}
	}

	function addOptimisticNextTask(task: Task) {
		const tempNextTaskId = generateTempId();
		const nextDue = calculateNextDueDate(task);
		const optimisticNextTask: TaskWithOptimisticState = {
			...task,
			id: tempNextTaskId,
			completed: false,
			completedAt: null,
			nextTaskId: null,
			dueDate: nextDue ?? task.dueDate,
			recurrence: nextRecurrenceForOptimistic(task.recurrence),
			optimisticState: OptimisticState.PENDING,
		};

		const sectionKey = task.sectionId ?? PROJECTS_DEFAULT_IDS.INBOX;

		if (isInbox) {
			tasksInboxCache(queryClient).addOptimistic(
				tempNextTaskId,
				optimisticNextTask,
			);
		} else if (projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);

			if (detailCache.exists()) {
				detailCache.addFullTaskToSection(sectionKey, optimisticNextTask);
			}
		}

		return tempNextTaskId;
	}

	function getSnapshot() {
		const inboxSnapshot = isInbox
			? queryClient.getQueryData(QUERY_KEYS.TASKS.INBOX)
			: undefined;
		const projectDetailSnapshot =
			!isInbox && projectId
				? queryClient.getQueryData(QUERY_KEYS.PROJECTS.DETAIL(projectId))
				: undefined;
		const projectsSummarySnapshot =
			!isInbox && projectId
				? queryClient.getQueryData(QUERY_KEYS.PROJECTS.SUMMARY)
				: undefined;
		const todayTasksSnapshot = isTodayTask
			? todayTasksCache(queryClient).getSnapshot()
			: undefined;

		return {
			inboxSnapshot,
			projectDetailSnapshot,
			projectsSummarySnapshot,
			todayTasksSnapshot,
		};
	}

	function replaceTaskFromServer(task: Task, tempId?: string) {
		if (isInbox) {
			if (tempId) {
				tasksInboxCache(queryClient).replaceWithReal(tempId, task);
			} else {
				tasksInboxCache(queryClient).replaceTaskFromServer(task);
			}
			return;
		}

		if (isTodayTask) {
			todayTasksCache(queryClient).replaceTaskFromServer(task);
			return;
		}

		if (projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);
			if (detailCache.exists()) {
				if (tempId) {
					const sectionKey = task.sectionId ?? PROJECTS_DEFAULT_IDS.INBOX;
					detailCache.replaceTaskInSection(sectionKey, tempId, task);
				} else {
					detailCache.replaceTaskFromServer(task);
				}
			}
		}
	}

	function removeOptimisticTask(tempId: string, sectionId?: string) {
		if (isInbox) {
			tasksInboxCache(queryClient).remove(tempId);
			return;
		}

		if (projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);
			if (detailCache.exists()) {
				detailCache.removeTaskFromSection(
					sectionId ?? PROJECTS_DEFAULT_IDS.INBOX,
					tempId,
				);
			}
		}
	}

	function restoreSnapshotOrchestrator(
		snapshot: TaskCacheOrchestratorSnapshot,
	) {
		if (isInbox) {
			restoreSnapshot(
				queryClient,
				QUERY_KEYS.TASKS.INBOX,
				snapshot.inboxSnapshot,
			);
		}

		if (isTodayTask && snapshot.todayTasksSnapshot) {
			todayTasksCache(queryClient).restoreSnapshot(snapshot.todayTasksSnapshot);
		}

		if (!isInbox && projectId) {
			restoreSnapshot(
				queryClient,
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				snapshot.projectDetailSnapshot,
			);
			restoreSnapshot(
				queryClient,
				QUERY_KEYS.PROJECTS.SUMMARY,
				snapshot.projectsSummarySnapshot,
			);
		}
	}

	return {
		cancel: async () => {
			await cancelRelatedQueries(queryClient, relatedKeys);
		},
		patchTaskCompletionOptimistic,
		addOptimisticNextTask,
		getSnapshot,
		replaceTaskFromServer,
		removeOptimisticTask,
		restoreSnapshot: restoreSnapshotOrchestrator,
	};
}
