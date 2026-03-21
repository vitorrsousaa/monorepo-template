import { ProjectSectionBlock } from "@/components/project-section-block";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import type { TTaskFormSchema } from "@/modules/tasks/view/forms/task/task-form.schema";
import { EditTaskModal, type EditTaskModalProps } from "@/modules/tasks/view/modals/edit-task-modal";
import { OptimisticState } from "@/utils/types";
import { cn } from "@repo/ui/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { useReducer, useState } from "react";

type EditModalValuesState = Partial<TTaskFormSchema> & { headerMeta: EditTaskModalProps['headerMeta'] }

export type ProjectSectionProps = {
	section: ProjectDetailWithOptimisticState["sections"][number];
	projectId: string;
	projectName: string;
};

export const ProjectSection = (props: ProjectSectionProps) => {
	const { section, projectId, projectName } = props;
	const sectionsTasks = section.tasks;
	const optimisticState = section?.optimisticState
	const isPending = optimisticState === OptimisticState.PENDING;
	const isError = optimisticState === OptimisticState.ERROR;

	const [isEditModalOpen, toggleIsEditModalOpen] = useReducer((state) => !state, false);
	const [editModalInitialValues, setEditModalInitialValues] = useState<EditModalValuesState>({} as EditModalValuesState);

	const handleTaskClick = (task: TaskWithOptimisticState) => {
		setEditModalInitialValues({
			title: task.title,
			description: task.description ?? undefined,
			dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
			completed: task.completed,
			section: task.sectionId ?? "none",
			headerMeta: {
				updatedAt: task.updatedAt, createdAt: task.createdAt,
				projectName,
			},
		});
		toggleIsEditModalOpen();

	}

	return (
		<div
			className={cn(
				"transition-opacity",
				isPending && "opacity-60 pointer-events-none",
				isError &&
				"rounded-lg border-2 border-destructive bg-destructive/5 p-3",
			)}
		>

			<EditTaskModal
				isOpen={isEditModalOpen}
				onClose={toggleIsEditModalOpen}
				initialValues={editModalInitialValues}
				headerMeta={editModalInitialValues?.headerMeta ?? undefined}
			/>

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
				tasks={sectionsTasks}
				onTaskClick={handleTaskClick}
				projectId={projectId}
				sectionId={section.id}
			/>
		</div>
	);
};
