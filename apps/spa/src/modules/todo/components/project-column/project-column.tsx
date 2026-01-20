import { DeleteProjectModal } from "@/modules/todo/modals/delete-project-modal";
import { EditTodoModal } from "@/modules/todo/modals/edit-todo-modal";
import { NewTodoModal } from "@/modules/todo/modals/new-todo-modal";
import type { Project } from "@/pages/app/todo/today";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import { ProjectColumnHeader } from "../project-column-header";
import { useProjectColumnHook } from "./project-column.hook";

export type ProjectColumnProps = {
	project: Project;
};

export const ProjectColumn = (props: ProjectColumnProps) => {
	const { project } = props;

	const {
		selectedTodo,
		isNewTodoModalOpen,
		selectedProjectId,
		deleteProjectModal,
		setSelectedTodo,
		setIsNewTodoModalOpen,
		setDeleteProjectModal,
		handleViewProjectDetails,
		handleDeleteProject,
		handleTaskClick,
		handleNewTodo,
		formatDate,
		confirmDeleteProject,
	} = useProjectColumnHook();

	return (
		<>
			<div className="flex-shrink-0 w-80 h-full flex flex-col">
				<ProjectColumnHeader
					project={project}
					onViewProjectDetails={handleViewProjectDetails}
					onDeleteProject={handleDeleteProject}
				/>

				{/* Todo Cards */}
				<div className="flex-1 overflow-y-auto space-y-3 min-h-0">
					{project.todos.map((todo) => {
						const dateInfo = todo.dueDate ? formatDate(todo.dueDate) : null;

						return (
							<Card
								key={todo.id}
								className="p-4 bg-card border-border hover:border-primary/50 transition-colors"
								onClick={() => handleTaskClick(todo, project)}
							>
								<div className="space-y-3">
									{/* Todo Header */}
									<div className="flex items-start gap-3">
										<Checkbox className="mt-0.5 border-2 data-[state=checked]:border-primary" />
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-balance leading-tight">
												{todo.title}
											</h3>
											{todo.description && (
												<p className="text-sm text-muted-foreground mt-1 truncate">
													{todo.description}
												</p>
											)}
										</div>
									</div>

									{/* Todo Footer */}
									<div className="space-y-2">
										{dateInfo && (
											<div className="flex items-center gap-1 text-xs">
												<Calendar className="w-3 h-3" />
												<span
													className={
														dateInfo.isOverdue
															? "text-destructive"
															: "text-primary"
													}
												>
													{dateInfo.text}
												</span>
											</div>
										)}

										{todo.tags && todo.tags.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{todo.tags.map((tag, index) => (
													<Badge
														key={`${index}-${tag}`}
														variant="secondary"
														className="text-xs bg-secondary/50 text-foreground"
													>
														# {tag}
													</Badge>
												))}
											</div>
										)}

										{todo.comments && (
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<MessageSquare className="w-3 h-3" />
												<span>{todo.comments}</span>
											</div>
										)}
									</div>
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
				projectId={selectedProjectId}
			/>

			<DeleteProjectModal
				isOpen={deleteProjectModal.isOpen}
				onClose={() => setDeleteProjectModal({ isOpen: false, project: null })}
				projectName={deleteProjectModal.project?.name || ""}
				onConfirm={confirmDeleteProject}
			/>
			{selectedTodo && (
				<EditTodoModal
					isOpen={!!selectedTodo}
					onClose={() => setSelectedTodo(null)}
					todo={selectedTodo}
				/>
			)}
		</>
	);
};
