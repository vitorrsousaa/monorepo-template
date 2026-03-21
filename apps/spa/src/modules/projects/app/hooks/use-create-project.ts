import { QUERY_KEYS } from "@/config/query-keys";
import { projectsAllCache } from "@/modules/projects/app/cache/projects-all.cache";
import { projectsSummaryCache } from "@/modules/projects/app/cache/projects-summary.cache";
import { createProject as createProjectService } from "@/modules/projects/app/services/create-project";
import { cancelRelatedQueries, generateTempId } from "@/utils/optimistic";
import type { CreateProjectInput } from "@repo/contracts/projects/create";
import { PROJECT_COLORS } from "@repo/contracts/projects/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const RELATED_KEYS = [QUERY_KEYS.PROJECTS.ALL, QUERY_KEYS.PROJECTS.SUMMARY];

export function useCreateProject() {
	const queryClient = useQueryClient();

	const { mutate: createProject, isPending } = useMutation({
		mutationFn: createProjectService,
		onMutate: async (variables) => {
			const { name, description, color } = variables;
			const tempId = generateTempId();

			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const allCache = projectsAllCache(queryClient);
			const summaryCache = projectsSummaryCache(queryClient);

			allCache.addOptimistic(tempId, { name, description, color });
			summaryCache.addOptimistic(tempId, { name, description, color });

			return { tempId };
		},
		onError: async (_error, _variables, context) => {
			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const allCache = projectsAllCache(queryClient);
			const summaryCache = projectsSummaryCache(queryClient);

			allCache.markError(context!.tempId);
			summaryCache.markError(context!.tempId);
		},
		onSuccess: async (data, _variables, context) => {
			const { project: projectResponse } = data;

			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const allCache = projectsAllCache(queryClient);
			const summaryCache = projectsSummaryCache(queryClient);

			allCache.replaceWithReal(context!.tempId, projectResponse);
			summaryCache.replaceWithReal(context!.tempId, projectResponse);
		},
	});

	const retryProject = useCallback(
		(projectId: string) => {
			const allCache = projectsAllCache(queryClient);
			const summaryCache = projectsSummaryCache(queryClient);

			const projects = allCache.get();
			const failedProject = projects.find((p) => p.id === projectId);

			allCache.remove(projectId);
			summaryCache.remove(projectId);

			if (failedProject) {
				const projectToCreate: CreateProjectInput = {
					name: failedProject.name || "Untitled Project",
					description: failedProject?.description || null,
					color:
						(failedProject?.color as unknown as (typeof PROJECT_COLORS)[0]) ||
						PROJECT_COLORS[0],
				};
				createProject(projectToCreate);
			}
		},
		[queryClient, createProject],
	);

	return { createProject, retryProject, isPending };
}
