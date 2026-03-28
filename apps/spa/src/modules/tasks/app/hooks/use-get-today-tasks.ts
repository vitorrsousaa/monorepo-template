import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState } from "@/utils/types";
import type {
	GetTodayTasksResponse,
	TodayProjectDto,
} from "@repo/contracts/tasks/today";
import { useQuery } from "@tanstack/react-query";
import type { TaskWithOptimisticState } from "../cache/types";
import { getTodayTasks } from "../services/get-today-tasks";

export type TodayTasksResponseWithOptimisticState = Omit<
	GetTodayTasksResponse,
	"projects"
> & {
	projects: Array<
		Omit<TodayProjectDto, "tasks"> & { tasks: TaskWithOptimisticState[] }
	>;
};

const EMPTY_TODAY: TodayTasksResponseWithOptimisticState = { projects: [] };

export function useGetTodayTasks() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.TASKS.TODAY,
			queryFn: async () => {
				const todayTasks = await getTodayTasks();

				const projects = todayTasks.projects.map((project) => ({
					...project,
					tasks: project.tasks.map((task) => ({
						...task,
						optimisticState:
							(task as TaskWithOptimisticState)?.optimisticState ??
							OptimisticState.SYNCED,
					})),
				}));

				const response: TodayTasksResponseWithOptimisticState = {
					...todayTasks,
					projects,
				};
				return response;
			},
		},
	);

	return {
		todayData: data ?? EMPTY_TODAY,
		isErrorTodayTasks: isError,
		isFetchingTodayTasks: isFetching || isPending || isLoading,
		refetchTodayTasks: refetch,
	};
}
