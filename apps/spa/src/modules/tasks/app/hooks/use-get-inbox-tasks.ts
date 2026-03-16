import { QUERY_KEYS } from "@/config/query-keys";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";
import { useQuery } from "@tanstack/react-query";
import { getInboxTasks } from "../services/get-inbox";

const EMPTY_INBOX_TASKS: GetInboxTasksResponse = { tasks: [], total: 0 };

export function useGetInboxTasks() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.TASKS.INBOX,
			queryFn: getInboxTasks,
		},
	);

	return {
		inboxTasks: data ?? EMPTY_INBOX_TASKS,
		isErrorInboxTasks: isError,
		isFetchingTasks: isFetching || isPending || isLoading,
		refetchTasks: refetch,
	};
}
