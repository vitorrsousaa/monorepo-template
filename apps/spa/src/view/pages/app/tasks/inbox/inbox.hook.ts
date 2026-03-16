import { useGetInboxTasks } from "@/modules/tasks/app/hooks/use-get-inbox-tasks";
import { useMemo } from "react";

export function useInboxHook() {
	const { inboxTasks, isErrorInboxTasks, isFetchingTasks, refetchTasks } =
		useGetInboxTasks();

	const shouldRenderInboxTasks = useMemo(
		() =>
			Boolean(!isFetchingTasks && !isErrorInboxTasks && inboxTasks.total > 0),
		[isFetchingTasks, isErrorInboxTasks, inboxTasks.total],
	);

	return {
		shouldRenderInboxTasks,
		inboxTasks: inboxTasks.tasks ?? [],
		isFetchingTasks,
		isErrorInboxTasks,
		refetchInboxTasks: refetchTasks,
	};
}
