import { ProjectSectionBlock } from "@/components/project-section-block";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import type { TaskWithOptimisticState } from "@/modules/tasks/app/hooks/use-create-tasks";
import { useUpdateTaskCompletion } from "@/modules/tasks/app/hooks/use-update-task-completion";
import { OptimisticState } from "@/utils/types";
import { cn } from "@repo/ui/utils";
import { AlertCircle, Loader2 } from "lucide-react";

type ProjectSectionProps = {
	section: ProjectDetailWithOptimisticState["sections"][number];
	projectId: string;
	projectName: string;
};

export const ProjectSection = (props: ProjectSectionProps) => {
	const { section, projectId, projectName } = props;
	const { toggleTaskCompletion } = useUpdateTaskCompletion();
	const sectionsTasks = section.tasks;
	const optimisticState = section?.optimisticState;
	const isPending = optimisticState === OptimisticState.PENDING;
	const isError = optimisticState === OptimisticState.ERROR;

	const handleTaskCheck = (task: TaskWithOptimisticState, checked: boolean) => {
		if (!task.id || task.optimisticState !== OptimisticState.SYNCED) return;
		toggleTaskCompletion({
			taskId: task.id,
			projectId,
			nextCompleted: checked,
		});
	};

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
				tasks={sectionsTasks}
				projectId={projectId}
				sectionId={section.id}
				projectName={projectName}
				onTaskCheck={handleTaskCheck}
			/>
		</div>
	);
};
