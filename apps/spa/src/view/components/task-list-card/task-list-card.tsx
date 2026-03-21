import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import { Plus } from "lucide-react";
import { useReducer } from "react";
import { TaskRow } from "../task-row";

export interface TaskListCardProps {
	sectionId: string;
	projectId: string;
	tasks: TaskWithOptimisticState[];
	onTaskClick: ((task: TaskWithOptimisticState) => void) | undefined;
	onTaskCheck:
		| ((task: TaskWithOptimisticState, checked: boolean) => void)
		| undefined;
	onRetry?: (taskId: string) => void;
}

export function TaskListCard(props: TaskListCardProps) {
	const { sectionId, projectId, tasks, onTaskClick, onTaskCheck, onRetry } =
		props;

	const [isNewTaskModalOpen, toggleIsNewTaskModalOpen] = useReducer(
		(state) => !state,
		false,
	);

	const realSectionId =
		sectionId === PROJECTS_DEFAULT_IDS.INBOX ? undefined : sectionId;

	return (
		<>
			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={toggleIsNewTaskModalOpen}
				projectId={projectId}
				sectionId={realSectionId}
			/>

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
							onRetry={onRetry}
						/>
					))
				)}
				<button
					type="button"
					className="flex w-full items-center gap-2 border-t border-dashed border-border py-2 pl-[18px] pr-3.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
					onClick={toggleIsNewTaskModalOpen}
				>
					<Plus className="h-3 w-3" />
					Add task
				</button>
			</div>
		</>
	);
}
