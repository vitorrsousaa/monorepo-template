import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import { useUpdateTaskCompletion } from "@/modules/tasks/app/hooks/use-update-task-completion";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { OptimisticState } from "@/utils/types";
import { Plus } from "lucide-react";
import { useReducer } from "react";
import { TaskRow } from "../task-row";

export interface TaskListCardProps {
	sectionId?: string;
	projectId: string;
	tasks: TaskWithOptimisticState[];
	onRetry?: (taskId: string) => void;
	projectName?: string;
}

export function TaskListCard(props: TaskListCardProps) {
	const { sectionId, projectId, tasks, onRetry, projectName } =
		props;

	const { toggleTaskCompletion } = useUpdateTaskCompletion();

	const handleInboxTaskCheck = (
		task: TaskWithOptimisticState,
		checked: boolean,
	) => {
		if (!task.id || task.optimisticState !== OptimisticState.SYNCED) return;
		toggleTaskCompletion({
			taskId: task.id,
			projectId: task.projectId ?? null,
			nextCompleted: checked,
			task,
		});
	};


	const [isNewTaskModalOpen, toggleIsNewTaskModalOpen] = useReducer(
		(state) => !state,
		false,
	);

	return (
		<>
			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={toggleIsNewTaskModalOpen}
				projectId={projectId}
				sectionId={sectionId}
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
							onCheck={handleInboxTaskCheck}
							onRetry={onRetry}
							projectName={projectName}
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
