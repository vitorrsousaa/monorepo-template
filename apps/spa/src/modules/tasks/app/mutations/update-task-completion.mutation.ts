import type { UpdateTaskCompletionOutput } from "@repo/contracts/tasks/completion";
import { toast } from "@repo/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";
import {
	type TaskCacheOrchestrator,
	type TaskCacheOrchestratorSnapshot,
	type TaskCacheOrchestratorVariables,
	taskCacheOrchestrator,
} from "../cache/tasks-cache-orchestrator";
import type { UpdateTaskCompletionVariables } from "../hooks/use-update-task-completion";

type UpdateTaskCompletionMutationContext = {
	coordinator: TaskCacheOrchestrator;
	snapshot: TaskCacheOrchestratorSnapshot;
	tempNextTaskId: string | null;
};

export function useUpdateTaskCompletionMutation(queryClient: QueryClient) {
	async function runOnMutate(variables: UpdateTaskCompletionVariables) {
		const coordVariables: TaskCacheOrchestratorVariables = {
			projectId: variables.projectId ?? null,
			taskId: variables.taskId,
			nextCompleted: variables.nextCompleted,
		};
		const coordinator = taskCacheOrchestrator(queryClient, coordVariables);

		await coordinator.cancel();

		coordinator.patchTaskCompletionOptimistic();

		const isCompletingRecurring =
			variables?.nextCompleted && variables?.task?.recurrence?.enabled === true;

		let tempNextTaskId: string | null = null;
		if (isCompletingRecurring) {
			tempNextTaskId = coordinator.addOptimisticNextTask(variables.task);
		}

		const snapshot = coordinator.getSnapshot();

		return {
			coordinator,
			snapshot,
			tempNextTaskId,
		};
	}

	async function runOnSuccess(
		data: UpdateTaskCompletionOutput,
		variables: UpdateTaskCompletionVariables,
		context: UpdateTaskCompletionMutationContext,
	) {
		const { coordinator, tempNextTaskId } = context;

		await coordinator.cancel();

		coordinator.replaceTaskFromServer(data.task);

		if (tempNextTaskId !== null) {
			if (data.nextTask) {
				coordinator.replaceTaskFromServer(data.nextTask, tempNextTaskId);
			} else {
				const sectionId = variables.task.sectionId ?? undefined;
				coordinator.removeOptimisticTask(tempNextTaskId, sectionId);
			}
		}
	}

	async function runOnError(
		_error: Error,
		_variables: UpdateTaskCompletionVariables,
		context?: UpdateTaskCompletionMutationContext,
	) {
		if (!context) return;
		const { coordinator, snapshot } = context;

		await coordinator.cancel();

		coordinator.restoreSnapshot(snapshot);

		toast.error("Could not update task");
	}

	return {
		onMutate: runOnMutate,
		onSuccess: runOnSuccess,
		onError: runOnError,
	};
}
