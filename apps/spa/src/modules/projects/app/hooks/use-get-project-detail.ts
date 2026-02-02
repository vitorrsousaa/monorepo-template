import { QUERY_KEYS } from "@/config/query-keys";
import type { SectionWithOptimisticState } from "@/modules/sections/app/hooks/use-create-section";
import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import type { WithOptimisticState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDetail } from "../entitites/project-detail";
import { getProjectDetail } from "../services/get-project-detail";

export type ProjectDetailWithOptimisticState =
	WithOptimisticState<ProjectDetail>;

export type ProjectDetailWithOptimisticSections = Omit<
	ProjectDetailWithOptimisticState,
	"sections"
> & {
	sections: (SectionWithTodos | SectionWithOptimisticState)[];
};

interface UseGetProjectDetailParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetProjectDetail(params: UseGetProjectDetailParams) {
	const { projectId, enabled = true } = params;
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			queryFn: async () => {
				const projectDetail = await getProjectDetail({ projectId });
				return projectDetail as ProjectDetailWithOptimisticState;
			},
			enabled: enabled && !!projectId, // Only fetch if enabled and projectId exists
		},
	);

	return {
		projectDetail: data as ProjectDetailWithOptimisticSections | undefined,
		isErrorProjectDetail: isError,
		isFetchingProjectDetail: isFetching || isPending || isLoading,
		refetchProjectDetail: refetch,
	};
}
