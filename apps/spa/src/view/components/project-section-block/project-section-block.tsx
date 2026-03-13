import { TaskRow } from "@/components/task-row";
import type { TaskRowTask } from "@/components/task-row";
import { cn } from "@repo/ui/utils";
import { ChevronDown, GripVertical, Plus } from "lucide-react";
import { useState } from "react";

export type ProjectSectionBlockProps = {
	/** Section name, e.g. "Unsectioned" or "Backlog". */
	name: string;
	/** Uppercase style for name. Default true. */
	uppercase?: boolean;
	/** Dimmed header (e.g. for Unsectioned). */
	dimmed?: boolean;
	/** Show drag handle. Default true for normal sections. */
	showDragHandle?: boolean;
	tasks: TaskRowTask[];
	onTaskClick?: (task: TaskRowTask) => void;
	onTaskCheck?: (task: TaskRowTask, checked: boolean) => void;
	onAddTask: () => void;
};

export function ProjectSectionBlock({
	name,
	uppercase = true,
	dimmed = false,
	showDragHandle = true,
	tasks,
	onTaskClick,
	onTaskCheck,
	onAddTask,
}: ProjectSectionBlockProps) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<section className="group mb-6">
			<button
				type="button"
				onClick={() => setCollapsed((c) => !c)}
				className={cn(
					"flex w-full items-center gap-2 py-1.5 text-left",
					dimmed && "opacity-50",
				)}
			>
				{showDragHandle && (
					<span
						className="cursor-grab text-muted-foreground/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={(e) => e.stopPropagation()}
						aria-hidden
					>
						<GripVertical className="h-3 w-3" />
					</span>
				)}
				<ChevronDown
					className={cn(
						"h-3 w-3 shrink-0 text-muted-foreground/80 transition-transform",
						collapsed && "-rotate-90",
					)}
					aria-hidden
				/>
				<span
					className={cn(
						"flex-1 text-xs font-semibold tracking-wide text-foreground/80",
						uppercase && "uppercase",
					)}
				>
					{name}
				</span>
				<span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
					{tasks.length}
				</span>
				<button
					type="button"
					className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/80 opacity-0 transition-opacity hover:bg-muted hover:text-foreground [.group:hover]:opacity-100"
					onClick={(e) => {
						e.stopPropagation();
						onAddTask();
					}}
					aria-label={`Add task to ${name}`}
				>
					<Plus className="h-3 w-3" />
				</button>
			</button>

			{!collapsed && (
				<>
					<div className="overflow-hidden rounded-xl border border-border bg-card">
						{tasks.length === 0 ? (
							<div className="py-6 text-center text-sm text-muted-foreground">
								No tasks
							</div>
						) : (
							tasks.map((task) => (
								<TaskRow
									key={task.id}
									task={task}
									onClick={onTaskClick}
									onCheck={onTaskCheck}
								/>
							))
						)}
						<button
							type="button"
							className="flex w-full items-center gap-2 border-t border-dashed border-border py-2 pl-[18px] pr-3.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
							onClick={onAddTask}
						>
							<Plus className="h-3 w-3" />
							Add task
						</button>
					</div>
				</>
			)}
		</section>
	);
}
