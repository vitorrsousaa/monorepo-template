import { QUERY_KEYS } from "@/config/query-keys";
import type { GetTodayTasksResponse } from "@repo/contracts/tasks/today";
import { useQuery } from "@tanstack/react-query";
import { getTodayTasks } from "../services/get-today-tasks";

const EMPTY_TODAY: GetTodayTasksResponse = { projects: [] };

export function useGetTodayTasks() {
	const { data, isError, isPending, isFetching, isLoading, refetch } =
		useQuery({
			queryKey: QUERY_KEYS.TASKS.TODAY,
			queryFn: getTodayTasks,
		});

	return {
		todayData: data ?? EMPTY_TODAY,
		isErrorTodayTasks: true,
		isFetchingTodayTasks: isFetching || isPending || isLoading,
		refetchTodayTasks: refetch,
	};
}
