import { QUERY_KEYS } from "@/config/query-keys";
import { projectDetailCache } from "@/modules/projects/app/cache";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { updateTaskCompletion } from "@/modules/tasks/app/services/update-task-completion";
import { cancelRelatedQueries, restoreSnapshot } from "@/utils/optimistic";
import type { UpdateTaskCompletionInput } from "@repo/contracts/tasks/completion";
import { toast } from "@repo/ui/sonner";
import {
	type QueryClient,
	type QueryKey,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

export type UpdateTaskCompletionVariables = UpdateTaskCompletionInput & {
	taskId: string;
	nextCompleted: boolean;
};

type UpdateTaskCompletionMutationContext = {
	inboxSnapshot: unknown;
	projectDetailSnapshot: unknown;
	touchedInbox: boolean;
	touchedProject: boolean;
	projectIdForDetail: string | null;
};

async function runUpdateTaskCompletionOnMutate(
	queryClient: QueryClient,
	variables: UpdateTaskCompletionVariables,
): Promise<UpdateTaskCompletionMutationContext> {
	const { taskId, projectId, nextCompleted } = variables;
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

	return {
		inboxSnapshot,
		projectDetailSnapshot,
		touchedInbox: isInbox,
		touchedProject: !isInbox,
		projectIdForDetail: projectId ?? null,
	};
}

export function useUpdateTaskCompletion() {
	const queryClient = useQueryClient();

	const { mutate: toggleTaskCompletion } = useMutation({
		mutationFn: async ({
			taskId,
			nextCompleted: _nextCompleted,
			...input
		}: UpdateTaskCompletionVariables) => {
			return updateTaskCompletion({ taskId, ...input });
		},
		onMutate: (variables) =>
			runUpdateTaskCompletionOnMutate(queryClient, variables),
		onSuccess: (data, variables) => {
			const { projectId } = variables;
			if (projectId) {
				const detailCache = projectDetailCache(queryClient, projectId);
				if (detailCache.exists()) {
					detailCache.replaceTaskFromServer(data.task);
				}
			} else {
				tasksInboxCache(queryClient).replaceTaskFromServer(data.task);
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
