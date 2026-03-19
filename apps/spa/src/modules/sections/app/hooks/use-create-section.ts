import { QUERY_KEYS } from "@/config/query-keys";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import { createSection as createSectionService } from "@/modules/sections/app/services/create-section";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Section } from "@repo/contracts/sections/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type SectionWithOptimisticState = WithOptimisticState<
	Partial<Section>
>;

export function useCreateSection() {
	const queryClient = useQueryClient();

	const { mutate: createSection } = useMutation({
		mutationFn: createSectionService,
		onMutate: async (variables) => {
			const { projectId, name, order } = variables;
			const tempId = Math.random().toString(36).substr(2, 9);

			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					
					const now = new Date();
					const isoNow = now.toISOString();
					
					const newSection: WithOptimisticState<Section> = {
						createdAt: isoNow,
						id: tempId,
						name,
						order: order ?? (oldData.sections?.length ?? 0) + 1,
						projectId,
						updatedAt: isoNow,
						userId: "temp-user-id",
						optimisticState: OptimisticState.PENDING,
					}
					
					const sections: ProjectDetailWithOptimisticState["sections"] = oldData.sections ?? [];
					sections.push({...newSection, tasks: []})
					
					const project: ProjectDetailWithOptimisticState = {
						...oldData, sections
					}
					
					return project
				 }
			)

			return { tempId, projectId: variables.projectId };
		},
		onError: async (_error, variables, context) => {
			const projectId = context?.projectId ?? variables.projectId;
			
			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			});
			
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					
					
					
					const sections = oldData.sections
					
					const sectionsWithOptimisticState = sections.map((section) => {
						if (section.id === context?.tempId) {
							const sectionWithOptimisticState: ProjectDetailWithOptimisticState['sections'][number]= {
								...section,
								optimisticState: OptimisticState.ERROR,
							}
							
							return {
								...sectionWithOptimisticState, tasks: []
							};
						}
						return {...section};
					})
					
					const project: ProjectDetailWithOptimisticState = {
						...oldData, sections: sectionsWithOptimisticState
					}
					
					return project
				},
			);
			
		},
		onSuccess: async (data, variables, context) => {
			const projectId = context?.projectId ?? variables.projectId;
			const { section: sectionResponse } = data;

			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			});

		queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						sections: oldData.sections.map(
							(section): ProjectDetailWithOptimisticState["sections"][number] =>
								section.id === context?.tempId
									? {
											...sectionResponse,
											tasks: section.tasks ?? [],
											optimisticState: OptimisticState.SYNCED,
										}
									: section,
						),
					};
				},
			);
		},
	});

	return { createSection };
}
