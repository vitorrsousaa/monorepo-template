import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { PROJECTS_DEFAULT_IDS } from '@repo/contracts/enums';
import { cn } from "@repo/ui/utils";
import { ChevronDown, GripVertical, Plus } from "lucide-react";
import { useReducer, useState } from "react";
import { TaskListCard } from "../task-list-card";

export type ProjectSectionBlockProps = {
	/** Section name, e.g. "Unsectioned" or "Backlog". */
	name: string;
	/** Uppercase style for name. Default true. */
	uppercase?: boolean;
	/** Dimmed header (e.g. for Unsectioned). */
	dimmed?: boolean;
	/** Show drag handle. Default true for normal sections. */
	showDragHandle?: boolean;
	tasks: TaskWithOptimisticState[];
	projectId: string;
	sectionId: string;
	onTaskClick?: (task: TaskWithOptimisticState) => void;
	onTaskCheck?: (task: TaskWithOptimisticState, checked: boolean) => void;
};

export function ProjectSectionBlock({
	name,
	uppercase = true,
	dimmed = false,
	showDragHandle = true,
	tasks,
	sectionId,
	projectId,
	onTaskClick,
	onTaskCheck,
}: ProjectSectionBlockProps) {
	const [collapsed, setCollapsed] = useState(false);
	const [isNewTaskModalOpen, toggleIsNewTaskModalOpen] = useReducer((state) => !state, false);

	const realSectionId = sectionId === PROJECTS_DEFAULT_IDS.INBOX ? undefined : sectionId;


	return (
		<>
			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={toggleIsNewTaskModalOpen}
				projectId={projectId}
				sectionId={realSectionId}

			/>

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
							toggleIsNewTaskModalOpen();
						}}
						aria-label={`Add task to ${name}`}
					>
						<Plus className="h-3 w-3" />
					</button>
				</button>

				{!collapsed && (
					<>
						<TaskListCard
							sectionId={sectionId}
							projectId={projectId}
							tasks={tasks}
							onTaskClick={onTaskClick}
							onTaskCheck={onTaskCheck}
						/>
					</>
				)}





			</section>
		</>
	);
}
