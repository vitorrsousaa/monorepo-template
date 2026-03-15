import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import type { SectionWithOptimisticState } from "@/modules/sections/app/hooks/use-create-section";
import type { Todo } from "@/modules/todo/app/entities/todo";
import type { TaskRowTask } from "@/components/task-row";
import { OptimisticState } from "@/utils/types";
import { cn } from "@repo/ui/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { ProjectSectionBlock } from "@/components/project-section-block";

function todoToTaskRowTask(t: Todo): TaskRowTask {
	return {
		id: t.id,
		title: t.title,
		description: t.description ?? null,
		completed: t.completed,
		dueDate: t.dueDate ?? null,
		priority: t.priority ?? null,
	};
}

export type ProjectSectionProps = {
	section: SectionWithTodos | SectionWithOptimisticState;
	projectId: string;
	projectName: string;
	onTaskClick: (task: TaskRowTask) => void;
	onAddTask: () => void;
};

export const ProjectSection = (props: ProjectSectionProps) => {
	const { section, onTaskClick, onAddTask } = props;
	const sectionTodos = section.todos;
	const optimisticState =
		"optimisticState" in section ? section.optimisticState : undefined;
	const isPending = optimisticState === OptimisticState.PENDING;
	const isError = optimisticState === OptimisticState.ERROR;

	const tasks = sectionTodos.map(todoToTaskRowTask);

	return (
		<div
			className={cn(
				"transition-opacity",
				isPending && "opacity-60 pointer-events-none",
				isError &&
					"rounded-lg border-2 border-destructive bg-destructive/5 p-3",
			)}
		>
			{isError && (
				<div className="mb-3 flex items-center gap-2 text-sm text-destructive">
					<AlertCircle className="h-4 w-4 shrink-0" />
					<span>Something went wrong while creating this section.</span>
				</div>
			)}
			{isPending && (
				<div className="mb-2 flex justify-end">
					<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
				</div>
			)}
			<ProjectSectionBlock
				name={section.name}
				uppercase
				dimmed={false}
				showDragHandle={true}
				tasks={tasks}
				onTaskClick={onTaskClick}
				onAddTask={onAddTask}
			/>
		</div>
	);
};
