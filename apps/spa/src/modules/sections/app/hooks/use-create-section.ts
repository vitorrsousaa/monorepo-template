import { QUERY_KEYS } from "@/config/query-keys";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import { createSection as createSectionService } from "@/modules/sections/app/services/create-section";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Section } from "../entities/section";
import type { SectionWithTodos } from "../entities/section-with-todos";

export type SectionWithOptimisticState = WithOptimisticState<
	Partial<Section>
> & {
	todos: SectionWithTodos["todos"];
};

type ProjectDetailCache = Omit<ProjectDetailWithOptimisticState, "sections"> & {
	sections: (SectionWithTodos | SectionWithOptimisticState)[];
};

export function useCreateSection() {
	const queryClient = useQueryClient();

	const { mutate: createSection } = useMutation({
		mutationFn: createSectionService,
		onMutate: async (variables) => {
			const { projectId, name, order } = variables;
			const tempId = Math.random().toString(36).substr(2, 9);

			queryClient.setQueryData<ProjectDetailCache>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					const sections = oldData.sections ?? [];
					return {
						...oldData,
						sections: [
							...sections,
							{
								id: tempId,
								projectId,
								name,
								order: order ?? sections.length + 1,
								optimisticState: OptimisticState.PENDING,
								todos: [],
							},
						],
					};
				},
			);

			return { tempId, projectId: variables.projectId };
		},
		onError: async (_error, variables, context) => {
			const projectId = context?.projectId ?? variables.projectId;
			queryClient.setQueryData<ProjectDetailCache>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						sections: oldData.sections.map((section) =>
							section.id === context?.tempId
								? { ...section, optimisticState: OptimisticState.ERROR }
								: section,
						),
					};
				},
			);
			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			});
		},
		onSuccess: async (data, variables, context) => {
			const projectId = context?.projectId ?? variables.projectId;
			const { section: sectionResponse } = data;

			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			});

			queryClient.setQueryData<ProjectDetailCache>(
				QUERY_KEYS.PROJECTS.DETAIL(projectId),
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						sections: oldData.sections.map((section) =>
							section.id === context?.tempId
								? {
										...sectionResponse,
										todos: [],
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
