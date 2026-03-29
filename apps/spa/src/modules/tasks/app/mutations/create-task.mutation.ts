import { generateTempId } from "@/utils/optimistic";
import type { Task } from "@repo/contracts/tasks/entities";
import type { QueryClient } from "@tanstack/react-query";
import {
	type TaskCacheOrchestrator,
	type TaskCacheOrchestratorVariables,
	taskCacheOrchestrator,
} from "../cache/tasks-cache-orchestrator";
import type { CreateTaskVariables } from "../hooks/use-create-tasks";

type CreateTaskMutationContext = {
	coordinator: TaskCacheOrchestrator;
	task: Task;
};

export function useCreateTaskMutation(queryClient: QueryClient) {
	async function runOnMutate(
		variables: CreateTaskVariables,
	): Promise<CreateTaskMutationContext> {
		const tempId = generateTempId();

		const userId = generateTempId();
		const nowIso = new Date().toISOString();

		const task: Task = {
			id: tempId,
			title: variables.title,
			description: variables.description ?? null,
			priority: variables.priority ?? null,
			dueDate: variables.dueDate ?? null,
			projectId: variables.projectId ?? null,
			sectionId: variables.sectionId ?? null,
			userId,
			completed: false,
			completedAt: null,
			createdAt: nowIso,
			updatedAt: nowIso,
			recurrence: null,
			nextTaskId: null,
		};

		const coordVariables: TaskCacheOrchestratorVariables = {
			projectId: variables.projectId ?? null,
			nextCompleted: false,
			task,
		};

		const coordinator = taskCacheOrchestrator(queryClient, coordVariables);

		await coordinator.cancel();

		coordinator.createTaskOptimistic(task);

		return {
			coordinator,
			task,
		};
	}

	async function runOnSuccess(
		data: Task,
		_variables: CreateTaskVariables,
		context: CreateTaskMutationContext,
	) {
		const { coordinator, task } = context;

		await coordinator.cancel();

		coordinator.replaceTaskFromServer(data, task.id);
	}

	async function runOnError(
		_error: Error,
		_variables: CreateTaskVariables,
		context?: CreateTaskMutationContext,
	) {
		if (!context) return;
		const { coordinator, task } = context;

		await coordinator.cancel();

		coordinator.markTaskWithError(task);
	}

	return {
		onMutate: runOnMutate,
		onSuccess: runOnSuccess,
		onError: runOnError,
	};
}
