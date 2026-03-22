import { PROJECT_INBOX_ID } from "@/config/constants";
import type { TTaskFormSchema } from "@/modules/tasks/view/forms/task/task-form.schema";
import { EditTaskModal } from "@/modules/tasks/view/modals/edit-task-modal";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import type { TodayProjectDto } from "@repo/contracts/tasks/today";
import { Card } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import { Calendar, Plus } from "lucide-react";
import { useMemo } from "react";
import { ProjectColumnHeader } from "../project-column-header";
import { useProjectColumnHook } from "./project-column.hook";

/** Stripe color class for the left edge of task cards by project. */
function getProjectStripeColor(projectId: string): string {
	if (projectId === PROJECT_INBOX_ID) return "bg-muted-foreground/50";
	// Cycle by project id for consistent colors across columns
	const colors = ["bg-violet-500", "bg-emerald-600", "bg-blue-600"] as const;
	const idx =
		projectId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
		colors.length;
	return colors[idx];
}

type ProjectColumnProps = {
	project: TodayProjectDto;
	onProjectDeleted?: () => void;
};

export const ProjectColumn = (props: ProjectColumnProps) => {
	const { project, onProjectDeleted } = props;

	const {
		selectedTask,
		isNewTodoModalOpen,
		selectedProjectId,
		deleteProjectModal,
		setSelectedTask,
		setIsNewTodoModalOpen,
		setDeleteProjectModal,
		handleViewProjectDetails,
		handleDeleteProject,
		handleTaskClick,
		handleNewTodo,
		formatDate,
		confirmDeleteProject,
	} = useProjectColumnHook({ onProjectDeleted });

	const editTodoFormInitialValues = useMemo((): Partial<TTaskFormSchema> => {
		if (!selectedTask) return {};
		return {
			id: selectedTask.id,
			title: selectedTask.title,
			description: selectedTask.description ?? undefined,
			project: selectedTask.projectId ?? "inbox",
			section: selectedTask.sectionId ?? "none",
			priority: selectedTask.priority ?? "none",
			dueDate: selectedTask.dueDate
				? new Date(selectedTask.dueDate)
				: undefined,
		};
	}, [selectedTask]);

	const editTodoFormHeaderMeta = useMemo(():
		| {
			projectName: string;
			createdAt: string;
		}
		| undefined => {
		if (!selectedTask) return undefined;
		return {
			projectName: selectedTask.projectName,
			createdAt: selectedTask.createdAt,
		};
	}, [selectedTask]);

	return (
		<>
			<div className="flex-shrink-0 w-80 h-full flex flex-col rounded-[14px] border border-border bg-card overflow-hidden">
				<div className="px-4 pt-4 pb-3 border-b border-border/70 flex-shrink-0">
					<ProjectColumnHeader
						project={project}
						onViewProjectDetails={handleViewProjectDetails}
						onDeleteProject={handleDeleteProject}
					/>
				</div>

				{/* Task Cards */}
				<div className="flex-1 overflow-y-auto min-h-0 px-3 py-3">
					<div className="space-y-2">
						{project.tasks.map((task) => {
							const dateInfo = task.dueDate ? formatDate(task.dueDate) : null;
							const isOverdue = !!dateInfo?.isOverdue && !task.completed;
							const stripeColor = getProjectStripeColor(project.id);

							return (
								<Card
									key={task.id}
									className={cn(
										"relative pl-5 pr-4 py-4 border-border hover:border-primary/50 transition-colors",
										isOverdue
											? "bg-[#FEF2F2] dark:bg-red-950/20 border-red-200/20 dark:border-red-900/20"
											: "bg-card",
									)}
									onClick={() => handleTaskClick(task, project)}
								>
									{/* Category stripe — left edge */}
									<div
										className={cn(
											"absolute left-0 top-2 bottom-2 w-[3px] rounded-r opacity-70",
											stripeColor,
										)}
										aria-hidden
									/>
									<div className="space-y-3">
										{/* Task Header */}
										<div className="flex items-start gap-3">
											<Checkbox
												checked={task.completed}
												className="mt-0.5 border-2 data-[state=checked]:border-primary"
											/>
											<div className="flex-1 min-w-0">
												<h3
													className={cn(
														"font-medium text-balance leading-tight",
														task.completed &&
														"line-through text-muted-foreground",
													)}
												>
													{task.title}
												</h3>
												<RenderIf
													condition={!!task.description}
													render={
														<p className="text-sm text-muted-foreground mt-1 truncate">
															{task.description}
														</p>
													}
												/>
											</div>
										</div>

										{/* Task Footer */}
										<RenderIf
											condition={!!dateInfo}
											render={
												<div className="flex items-center gap-1 text-xs">
													<Calendar className="w-3 h-3 shrink-0" />
													<span
														className={
															dateInfo?.isOverdue
																? "text-destructive"
																: "text-muted-foreground"
														}
													>
														{dateInfo?.text}
													</span>
													{dateInfo?.isOverdue && !task.completed && (
														<span className="text-[10px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
															overdue
														</span>
													)}
												</div>
											}
										/>
									</div>
								</Card>
							);
						})}
					</div>

					{/* Add Task — dashed style like mockup */}
					<button
						type="button"
						onClick={() => handleNewTodo(project.id)}
						className={cn(
							"mt-2 w-full flex items-center gap-2 py-2 px-3 rounded-md",
							"border border-dashed border-border text-muted-foreground text-xs",
							"hover:bg-card hover:text-foreground hover:border-solid hover:border-border transition-colors cursor-pointer",
						)}
					>
						<Plus className="w-3.5 h-3.5 shrink-0" />
						Adicionar tarefa
					</button>
				</div>
			</div>
			<NewTaskModal
				isOpen={isNewTodoModalOpen}
				onClose={() => setIsNewTodoModalOpen(false)}
				projectId={selectedProjectId ?? undefined}
			/>

			<DeleteProjectModal
				isOpen={deleteProjectModal.isOpen}
				onClose={() => setDeleteProjectModal({ isOpen: false, project: null })}
				projectName={deleteProjectModal.project?.name || ""}
				onConfirm={confirmDeleteProject}
			/>
			<RenderIf
				condition={!!selectedTask}
				render={
					selectedTask ? (
						<EditTaskModal
							isOpen={!!selectedTask}
							onClose={() => setSelectedTask(null)}
							initialValues={editTodoFormInitialValues}
							headerMeta={editTodoFormHeaderMeta}
						/>
					) : null
				}
			/>
		</>
	);
};
