import { QUERY_KEYS } from "@/config/query-keys";
import type { Project } from "@/modules/projects/app/entitites/project";
import { createProject as createProjectService } from "@/modules/projects/app/services/create-project";
import type { WithOptimisticState } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ProjectWithOptimisticState = WithOptimisticState<Partial<Project>>;

export function useCreateProject() {
	const queryClient = useQueryClient();

	const { mutate: createProject } = useMutation({
		mutationFn: createProjectService,
		onMutate: (variables) => {
			const { name, description } = variables;
			const tempId = Math.random().toString(36).substr(2, 9);

			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.concat({
						id: tempId,
						optimisticState: "pending",
						name,
						description,
					}),
			);

			return { tempId };
		},
		onError: async (_error, _variables, context) => {
			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.map((project) =>
						project.id === context?.tempId
							? { ...project, optimisticState: "error" }
							: project,
					),
			);

			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.ALL,
			});
		},
		onSuccess: async (data, _variables, context) => {
			const { project: projectResponse } = data;

			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.ALL,
			});

			queryClient.setQueryData<ProjectWithOptimisticState[]>(
				QUERY_KEYS.PROJECTS.ALL,
				(oldData) =>
					oldData?.map((project) =>
						project.id === context?.tempId
							? { ...projectResponse, optimisticState: "synced" }
							: project,
					),
			);
		},
	});

	return { createProject };
}
