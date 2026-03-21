import type { OptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";

export type TaskRowTask = Task & {
	optimisticState?: OptimisticState;
};

export type TaskRowProps = {
	task: TaskRowTask;
	onClick?: (task: TaskRowTask) => void;
	onCheck?: (task: TaskRowTask, checked: boolean) => void;
	showDescription?: boolean;
	showDueDate?: boolean;
	showPriority?: boolean;
	children?: React.ReactNode;
	className?: string;
};
