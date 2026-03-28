import { QUERY_KEYS } from "@/config/query-keys";
import { projectDetailCache } from "@/modules/projects/app/cache";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { updateTaskCompletion } from "@/modules/tasks/app/services/update-task-completion";
import {
	cancelRelatedQueries,
	generateTempId,
	restoreSnapshot,
} from "@/utils/optimistic";
import { OptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { UpdateTaskCompletionInput } from "@repo/contracts/tasks/completion";
import type { Task } from "@repo/contracts/tasks/entities";
import { calculateNextDueDate } from "@repo/contracts/tasks/recurrence";
import { toast } from "@repo/ui/sonner";
import {
	type QueryClient,
	type QueryKey,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { TaskWithOptimisticState } from "../cache/types";

type UpdateTaskCompletionVariables = UpdateTaskCompletionInput & {
	taskId: string;
	nextCompleted: boolean;
	/** Full task object — required to handle recurring task next-task insertion */
	task: Task;
};

type UpdateTaskCompletionMutationContext = {
	inboxSnapshot: unknown;
	projectDetailSnapshot: unknown;
	touchedInbox: boolean;
	touchedProject: boolean;
	projectIdForDetail: string | null;
	/** Temp ID of the optimistically inserted next task, if any */
	tempNextTaskId: string | null;
};

function projectTaskSectionCacheId(task: Pick<Task, "sectionId">): string {
	return task.sectionId ?? PROJECTS_DEFAULT_IDS.INBOX;
}

function nextRecurrenceForOptimistic(
	recurrence: Task["recurrence"],
): Task["recurrence"] {
	if (!recurrence) return null;
	const next = { ...recurrence };
	if (next.endType === "after_count" && next.endCount !== undefined) {
		next.endCount = next.endCount - 1;
	}
	return next;
}

async function runUpdateTaskCompletionOnMutate(
	queryClient: QueryClient,
	variables: UpdateTaskCompletionVariables,
): Promise<UpdateTaskCompletionMutationContext> {
	const { taskId, projectId, nextCompleted, task } = variables;
	const isInbox = projectId == null;

	const relatedKeys: QueryKey[] = isInbox
		? [QUERY_KEYS.TASKS.INBOX]
		: [QUERY_KEYS.PROJECTS.DETAIL(projectId as string)];

	await cancelRelatedQueries(queryClient, relatedKeys);

	const inboxSnapshot = isInbox
		? queryClient.getQueryData(QUERY_KEYS.TASKS.INBOX)
		: undefined;
	const projectDetailSnapshot =
		!isInbox && projectId
			? queryClient.getQueryData(QUERY_KEYS.PROJECTS.DETAIL(projectId))
			: undefined;

	if (isInbox) {
		tasksInboxCache(queryClient).patchTaskCompletionOptimistic(
			taskId,
			nextCompleted,
		);
	}

	if (!isInbox && projectId) {
		const detailCache = projectDetailCache(queryClient, projectId);
		if (detailCache.exists()) {
			detailCache.patchTaskCompletionOptimistic(taskId, nextCompleted);
		}
	}

	const isCompletingRecurring =
		nextCompleted && task.recurrence?.enabled === true;
	let tempNextTaskId: string | null = null;

	if (isCompletingRecurring) {
		tempNextTaskId = generateTempId();
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

		if (isInbox) {
			tasksInboxCache(queryClient).addOptimistic(
				tempNextTaskId,
				optimisticNextTask,
			);
		} else if (projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);
			const sectionKey = projectTaskSectionCacheId(task);
			if (detailCache.exists()) {
				detailCache.addFullTaskToSection(sectionKey, optimisticNextTask);
			}
		}
	}

	return {
		inboxSnapshot,
		projectDetailSnapshot,
		touchedInbox: isInbox,
		touchedProject: !isInbox,
		projectIdForDetail: projectId ?? null,
		tempNextTaskId,
	};
}

export function useUpdateTaskCompletion() {
	const queryClient = useQueryClient();

	const { mutate: toggleTaskCompletion } = useMutation({
		mutationFn: async ({
			taskId,
			nextCompleted: _nextCompleted,
			task: _task,
			...input
		}: UpdateTaskCompletionVariables) => {
			return updateTaskCompletion({ taskId, ...input });
		},
		onMutate: (variables) =>
			runUpdateTaskCompletionOnMutate(queryClient, variables),
		onSuccess: (data, variables, context) => {
			const { projectId } = variables;
			const { tempNextTaskId } = context;

			if (projectId) {
				const detailCache = projectDetailCache(queryClient, projectId);
				if (detailCache.exists()) {
					detailCache.replaceTaskFromServer(data.task);
				}
			} else {
				tasksInboxCache(queryClient).replaceTaskFromServer(data.task);
			}

			// Handle the optimistic next task for recurring completions
			if (tempNextTaskId !== null) {
				if (data.nextTask) {
					// Replace the temp task with the real server task
					if (projectId) {
						const detailCache = projectDetailCache(queryClient, projectId);
						if (detailCache.exists()) {
							detailCache.replaceTaskInSection(
								projectTaskSectionCacheId(data.nextTask),
								tempNextTaskId,
								data.nextTask,
							);
						}
					} else {
						tasksInboxCache(queryClient).replaceWithReal(
							tempNextTaskId,
							data.nextTask,
						);
					}
				} else {
					// End condition reached — no next task; remove the optimistic placeholder
					if (projectId) {
						const detailCache = projectDetailCache(queryClient, projectId);
						if (detailCache.exists()) {
							detailCache.removeTaskFromSection(
								projectTaskSectionCacheId(variables.task),
								tempNextTaskId,
							);
						}
					} else {
						tasksInboxCache(queryClient).remove(tempNextTaskId);
					}
				}
			}
		},
		onError: (_error, _variables, context) => {
			if (!context) return;

			if (context.touchedInbox) {
				restoreSnapshot(
					queryClient,
					QUERY_KEYS.TASKS.INBOX,
					context.inboxSnapshot,
				);
			}
			if (context.touchedProject && context.projectIdForDetail) {
				restoreSnapshot(
					queryClient,
					QUERY_KEYS.PROJECTS.DETAIL(context.projectIdForDetail),
					context.projectDetailSnapshot,
				);
			}

			toast.error("Could not update task");
		},
	});

	return { toggleTaskCompletion };
}
