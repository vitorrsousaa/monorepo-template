import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getInboxTasks } from "../services/get-inbox";
import type { TaskWithOptimisticState } from "./use-create-tasks";


type InboxTasksResult = {
	tasks: TaskWithOptimisticState[];
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
					(t as TaskWithOptimisticState).optimisticState ?? OptimisticState.SYNCED,
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
