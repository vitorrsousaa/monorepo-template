import { QUERY_KEYS } from "@/config/query-keys";
import { projectDetailCache } from "@/modules/projects/app/cache";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { updateTaskCompletion } from "@/modules/tasks/app/services/update-task-completion";
import { cancelRelatedQueries, generateTempId, restoreSnapshot } from "@/utils/optimistic";
import type { UpdateTaskCompletionInput } from "@repo/contracts/tasks/completion";
import type { Task } from "@repo/contracts/tasks/entities";
import { toast } from "@repo/ui/sonner";
import {
	type QueryClient,
	type QueryKey,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

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

	// Optimistically insert a next task when completing a recurring task
	const isCompletingRecurring =
		nextCompleted && task.recurrence?.enabled === true;
	let tempNextTaskId: string | null = null;

	if (isCompletingRecurring) {
		tempNextTaskId = generateTempId();
		const optimisticNextTask: Task = {
			...task,
			id: tempNextTaskId,
			completed: false,
			completedAt: null,
			nextTaskId: null,
		};

		if (isInbox) {
			tasksInboxCache(queryClient).addOptimistic(
				tempNextTaskId,
				optimisticNextTask,
			);
		} else if (projectId) {
			const detailCache = projectDetailCache(queryClient, projectId);
			if (detailCache.exists()) {
				detailCache.addFullTaskToSection(
					task.sectionId ?? "",
					optimisticNextTask,
				);
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
								data.nextTask.sectionId ?? "",
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
								variables.task.sectionId ?? "",
								tempNextTaskId,
							);
						}
					} else {
						tasksInboxCache(queryClient).remove(tempNextTaskId);
					}
				}
			}
		},
		onError: (error, _variables, context) => {
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
