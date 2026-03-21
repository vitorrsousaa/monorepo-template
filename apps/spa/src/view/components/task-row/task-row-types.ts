import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";

export type TaskRowProps = {
	task: TaskWithOptimisticState;
	onCheck?: (task: TaskWithOptimisticState, checked: boolean) => void;
	/** Shown when `task.optimisticState === ERROR`; calls with task id. */
	onRetry?: (taskId: string) => void;
	/** Project name shown in the edit modal header meta. */
	projectName?: string;
	showDescription?: boolean;
	showDueDate?: boolean;
	showPriority?: boolean;
	children?: React.ReactNode;
	className?: string;
};
