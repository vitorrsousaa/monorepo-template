/**
 * Minimal task shape for the reusable TaskRow component.
 * Compatible with TaskDto, Todo, and other task-like entities across modules.
 */
export type TaskRowTask = {
	id: string;
	title: string;
	description?: string | null;
	completed: boolean;
	dueDate?: string | Date | null;
	priority?: "low" | "medium" | "high" | null;
};

export type TaskRowProps = {
	task: TaskRowTask;
	/** Called when the row (or checkbox) is activated. */
	onClick?: (task: TaskRowTask) => void;
	/** Called when completion state should toggle. If not provided, row still shows checkbox but no action. */
	onCheck?: (task: TaskRowTask, checked: boolean) => void;
	/** Show description/subtitle line. Default true. */
	showDescription?: boolean;
	/** Show due date chip. Default true when task has dueDate. */
	showDueDate?: boolean;
	/** Show priority badge. Default true when task has priority. */
	showPriority?: boolean;
	/** Optional extra content to render after date/priority (e.g. menu). */
	children?: React.ReactNode;
	className?: string;
};
