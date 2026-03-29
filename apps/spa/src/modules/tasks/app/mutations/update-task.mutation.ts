import { generateTempId } from "@/utils/optimistic";
import { OptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";
import { toast } from "@repo/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";
import {
	type TaskCacheOrchestrator,
	type TaskCacheOrchestratorVariables,
	taskCacheOrchestrator,
} from "../cache/tasks-cache-orchestrator";
import type { TaskWithOptimisticState } from "../cache/types";
import type { UpdateTaskMutationVariables } from "../hooks/use-update-task";

type UpdateTaskMutationContext = {
	coordinator: TaskCacheOrchestrator;
	task: Partial<Task> & { id: string };
};

export function useUpdateTaskMutation(queryClient: QueryClient) {
	async function runOnMutate(
		variables: UpdateTaskMutationVariables,
	): Promise<UpdateTaskMutationContext> {
		const userId = generateTempId();
		const task: Partial<Task> & { id: string } = {
			...variables,
			userId,
			id: variables.taskId,
		};

		const coordVariables: TaskCacheOrchestratorVariables = {
			projectId: variables.projectId ?? null,
			task,
			nextCompleted: false,
		};

		const coordinator = taskCacheOrchestrator(queryClient, coordVariables);

		await coordinator.cancel();

		const taskWithPendingState: Partial<TaskWithOptimisticState> & {
			id: string;
		} = {
			...task,
			id: task.id,
			optimisticState: OptimisticState.PENDING,
		};

		coordinator.patchTaskOptimistic(taskWithPendingState);

		return {
			coordinator,
			task,
		};
	}

	async function runOnSuccess(
		data: Task,
		_variables: UpdateTaskMutationVariables,
		context: UpdateTaskMutationContext,
	) {
		const { coordinator, task } = context;

		await coordinator.cancel();

		coordinator.replaceTaskFromServer(data, task.id);
	}

	async function runOnError(
		_error: Error,
		_variables: UpdateTaskMutationVariables,
		context: UpdateTaskMutationContext | undefined,
	) {
		if (!context) return;
		const { coordinator, task } = context;

		await coordinator.cancel();

		coordinator.markTaskWithError(task);

		toast.error("Could not update task");
	}

	return {
		onMutate: runOnMutate,
		onSuccess: runOnSuccess,
		onError: runOnError,
	};
}
