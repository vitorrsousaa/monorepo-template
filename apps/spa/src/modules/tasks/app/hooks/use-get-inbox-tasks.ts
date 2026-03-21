import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getInboxTasks } from "../services/get-inbox";

type InboxTaskItem = WithOptimisticState<Partial<Task>>;

type InboxTasksResult = {
	tasks: InboxTaskItem[];
	total: number;
};

const EMPTY_INBOX_TASKS: InboxTasksResult = { tasks: [], total: 0 };

export function useGetInboxTasks() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.TASKS.INBOX,
			queryFn: getInboxTasks,
		},
	);

	const inboxTasks: InboxTasksResult = useMemo(() => {
		if (!data) return EMPTY_INBOX_TASKS;
		return {
			tasks: data.tasks.map((t) => ({
				...t,
				optimisticState:
					(t as InboxTaskItem).optimisticState ?? OptimisticState.SYNCED,
			})),
			total: data.total,
		};
	}, [data]);

	return {
		inboxTasks,
		isErrorInboxTasks: isError,
		isFetchingTasks: isFetching || isPending || isLoading,
		refetchTasks: refetch,
	};
}
