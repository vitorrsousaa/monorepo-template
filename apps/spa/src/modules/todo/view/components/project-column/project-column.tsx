import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { EditTodoModal } from "@/modules/todo/view/modals/edit-todo-modal";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import type { TodayProjectDto } from "@repo/contracts/tasks/today";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Card } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { Calendar, Plus } from "lucide-react";
import { ProjectColumnHeader } from "../project-column-header";
import { useProjectColumnHook } from "./project-column.hook";

export type ProjectColumnProps = {
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

	return (
		<>
			<div className="flex-shrink-0 w-80 h-full flex flex-col">
				<ProjectColumnHeader
					project={project}
					onViewProjectDetails={handleViewProjectDetails}
					onDeleteProject={handleDeleteProject}
				/>

				{/* Task Cards */}
				<div className="flex-1 overflow-y-auto space-y-3 min-h-0">
					{project.tasks.map((task) => {
						const dateInfo = task.dueDate ? formatDate(task.dueDate) : null;

						return (
							<Card
								key={task.id}
								className="p-4 bg-card border-border hover:border-primary/50 transition-colors"
								onClick={() => handleTaskClick(task, project)}
							>
								<div className="space-y-3">
									{/* Task Header */}
									<div className="flex items-start gap-3">
										<Checkbox className="mt-0.5 border-2 data-[state=checked]:border-primary" />
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-balance leading-tight">
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
												<Calendar className="w-3 h-3" />
												<span
													className={
														dateInfo!.isOverdue
															? "text-destructive"
															: "text-primary"
													}
												>
													{dateInfo!.text}
												</span>
											</div>
										}
									/>
								</div>
							</Card>
						);
					})}
				</div>

				{/* Add Task Button */}
				<Button
					variant="ghost"
					className="mt-3 justify-start text-muted-foreground hover:text-primary flex-shrink-0"
					onClick={() => handleNewTodo(project.id)}
				>
					<Plus className="w-4 h-4 mr-2" />
					Add task
				</Button>
			</div>
			<NewTodoModal
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
					<EditTodoModal
						isOpen={!!selectedTask}
						onClose={() => setSelectedTask(null)}
						todo={
							selectedTask as unknown as Record<string, string> & {
								completed: boolean;
							} & { dueDate: string }
						}
					/>
				}
			/>
		</>
	);
};
