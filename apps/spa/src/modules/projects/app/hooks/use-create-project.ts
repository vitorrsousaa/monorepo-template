import { QUERY_KEYS } from "@/config/query-keys";
import { createProject as createProjectService } from "@/modules/projects/app/services/create-project";
import { cancelRelatedQueries, generateTempId } from "@/utils/optimistic";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { CreateProjectInput } from "@repo/contracts/projects/create";
import { PROJECT_COLORS } from "@repo/contracts/projects/create";
import type { Project } from "@repo/contracts/projects/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";


type ProjectWithOptimisticState = WithOptimisticState<
	Partial<Project> 
>;

export function useCreateProject() {
	const queryClient = useQueryClient();

	const { mutate: createProject, isPending} = useMutation({
		mutationFn: createProjectService,
		onMutate: (variables) => {
			const { name, description, color } = variables;
			const tempId = generateTempId();

			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.concat({
						id: tempId,
						optimisticState: OptimisticState.PENDING,
						name,
						description,
						color,
					}),
			);

			return { tempId };
		},
		onError: async (_error, _variables, context) => {
			await cancelRelatedQueries(queryClient, [
				QUERY_KEYS.PROJECTS.ALL,
			]);
			
			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.map((project) =>
						project.id === context?.tempId
							? { ...project, optimisticState: OptimisticState.ERROR }
							: project,
					),
			);
		},
		onSuccess: async (data, _variables, context) => {
			const { project: projectResponse } = data;

			await cancelRelatedQueries(queryClient, [
				QUERY_KEYS.PROJECTS.ALL,
			]);

			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.map((project) =>
						project.id === context?.tempId
							? { ...projectResponse, optimisticState: OptimisticState.SYNCED }
							: project,
					),
			);
		},
	});


	const retryProject = useCallback((projectId: string) => {
		const projects = queryClient.getQueryData<ProjectWithOptimisticState[]>(
			QUERY_KEYS.PROJECTS.ALL,
		);

		const failedProject = projects?.find((p) => p.id === projectId);
		
		queryClient.setQueryData<ProjectWithOptimisticState[]>(
			QUERY_KEYS.PROJECTS.ALL,
			(oldData) =>
				oldData?.filter((project) => project.id !== projectId),
		);
		if (failedProject) {
			const projectToCreate: CreateProjectInput = {
				name: failedProject.name || "Untitled Project",
				description: failedProject?.description || null,
				color: failedProject?.color as unknown as typeof PROJECT_COLORS[0] || PROJECT_COLORS[0],
			}
			createProject(projectToCreate);
		}
	}, [queryClient, createProject]);

	return { createProject, retryProject, isPending };
}
