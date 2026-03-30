import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import { useUpdateTaskCompletion } from "@/modules/tasks/app/hooks/use-update-task-completion";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { OptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import { RenderIf } from "@repo/ui/render-if";
import { Plus } from "lucide-react";
import { useReducer } from "react";
import { TaskRow } from "../task-row";

export interface TaskListCardProps {
	sectionId?: string;
	projectId?: string;
	tasks: TaskWithOptimisticState[];
	onRetry?: (taskId: string) => void;
	projectName?: string;
	shouldAllowAddTask?: boolean;
}

export function TaskListCard(props: TaskListCardProps) {
	const {
		sectionId,
		projectId,
		tasks,
		onRetry,
		projectName,
		shouldAllowAddTask = true,
	} = props;

	const { toggleTaskCompletion } = useUpdateTaskCompletion();

	const handleInboxTaskCheck = (
		task: TaskWithOptimisticState,
		checked: boolean,
	) => {
		if (!task.id) return;
		const os = task?.optimisticState;
		if (os === OptimisticState.PENDING || os === OptimisticState.ERROR) {
			return;
		}

		const projectIdToUse = projectId ?? task.projectId;
		toggleTaskCompletion({
			taskId: task.id,
			projectId: projectIdToUse ?? null,
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
				projectId={projectId ?? PROJECTS_DEFAULT_IDS.INBOX}
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
				<RenderIf
					condition={shouldAllowAddTask}
					render={
						<button
							type="button"
							className="flex w-full items-center gap-2 border-t border-dashed border-border py-2 pl-[18px] pr-3.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
							onClick={toggleIsNewTaskModalOpen}
						>
							<Plus className="h-3 w-3" />
							Add task
						</button>
					}
				/>
			</div>
		</>
	);
}
