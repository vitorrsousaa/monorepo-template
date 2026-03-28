import { QUERY_KEYS } from "@/config/query-keys";
import { sectionsByProjectCache } from "@/modules/sections/app/cache";
import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import type { WithOptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectDetail } from "../services/get-project-detail";

type SectionWithOptimisticTasks = Omit<
	WithOptimisticState<GetProjectDetailResponse["sections"][number]>,
	"tasks"
> & {
	tasks: TaskWithOptimisticState[];
};

export type ProjectDetailWithOptimisticState = Omit<
	WithOptimisticState<GetProjectDetailResponse>,
	"sections"
> & {
	sections: SectionWithOptimisticTasks[];
};

interface UseGetProjectDetailParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetProjectDetail(params: UseGetProjectDetailParams) {
	const { projectId, enabled = true } = params;
	const queryClient = useQueryClient();
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			queryFn: async () => {
				const projectDetail = await getProjectDetail({ projectId });

				const sectionsCache = sectionsByProjectCache(queryClient, projectId);
				const sectionsWithoutInbox = projectDetail.sections.filter(
					(section) => section.id !== PROJECTS_DEFAULT_IDS.INBOX,
				);
				sectionsCache.set(sectionsWithoutInbox);

				return projectDetail as ProjectDetailWithOptimisticState;
			},
			enabled: enabled && !!projectId,
		},
	);

	return {
		projectDetail: data as ProjectDetailWithOptimisticState | undefined,
		isErrorProjectDetail: isError,
		isFetchingProjectDetail: isFetching || isPending || isLoading,
		refetchProjectDetail: refetch,
	};
}
