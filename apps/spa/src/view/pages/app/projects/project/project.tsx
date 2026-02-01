import { useGetProjectDetail } from "@/modules/projects/app/hooks/use-get-project-detail";
import { EditTodoModal } from "@/modules/todo/view/modals/edit-todo-modal";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Input } from "@repo/ui/input";
import { Calendar, Flag, GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Todo } from "../../todo/today";
import { ProjectErrorState } from "./components/project-error-state";
import { ProjectLoadingSkeleton } from "./components/project-loading-skeleton";

export function Projects() {
	const { id } = useParams();
	const projectId = id ?? "";

	const {
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		refetchProjectDetail,
	} = useGetProjectDetail({ projectId });

	const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
	const [sections, setSections] = useState([
		"Backlog",
		"In Progress",
		"Review",
		"Done",
	]);
	const [isAddingSection, setIsAddingSection] = useState(false);
	const [newSectionName, setNewSectionName] = useState("");

	const handleAddSection = () => {
		if (newSectionName.trim()) {
			setSections([...sections, newSectionName.trim()]);
			setNewSectionName("");
			setIsAddingSection(false);
		}
	};

	// Loading state
	if (isFetchingProjectDetail) {
		return <ProjectLoadingSkeleton />;
	}

	// Error state
	if (isErrorProjectDetail) {
		return (
			<div className="p-8">
				<ProjectErrorState onRetry={() => refetchProjectDetail()} />
			</div>
		);
	}

	// Mock project data (fallback when API projectDetail not used yet)

	if (!projectDetail) {
		return (
			<div className="p-8">
				<div className="text-center text-muted-foreground">
					Project not found
				</div>
			</div>
		);
	}

	// all todos completed in project
	const completedCount = 30;
	// all todos in project
	const totalCount = 50;
	const progressPercentage = Math.round((completedCount / totalCount) * 100);

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Project Header - Fixed */}
			<div className="flex-shrink-0 border-b border-border px-8 py-6">
				<div className="flex items-center gap-3 mb-2">
					<span className="text-4xl">🐍</span>
					<h1 className="text-3xl font-semibold">
						{projectDetail.project.name}
					</h1>
				</div>
				<p className="text-muted-foreground mb-4">
					{projectDetail.project.description}
				</p>

				<div className="flex items-center gap-4">
					<div className="text-sm text-muted-foreground">
						{completedCount} of {totalCount} completed ({progressPercentage}%)
					</div>
					<div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Tasks grouped by sections - Scrollable */}
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="p-8 space-y-6">
					{projectDetail.sections.map((section) => {
						const sectionTodos = section.todos;

						console.log(sectionTodos);

						return (
							<div
								key={`section-${section.id}-${Math.random().toString(36).substring(2, 15)}`}
							>
								<div className="flex items-center gap-3 mb-3">
									<GripVertical className="w-4 h-4 text-muted-foreground" />
									<h2 className="font-semibold text-lg">{section.name}</h2>
									<Badge variant="secondary" className="rounded-full">
										{sectionTodos.length}
									</Badge>
									<Button
										variant="ghost"
										size="sm"
										className="ml-auto h-8"
										onClick={() => setIsNewTodoModalOpen(true)}
									>
										<Plus className="w-4 h-4" />
									</Button>
								</div>

								<div className="space-y-2">
									{sectionTodos.map((todo) => (
										<button
											key={todo.id}
											type="button"
											className="group w-full flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer text-left"
											// onClick={() =>
											// 	setSelectedTodo({
											// 		...todo,
											// 		projectName: project.name,
											// 		projectId: project?.id || "",
											// 	})
											// }
										>
											<Checkbox
												checked={todo.completed}
												className="border-2"
												onClick={(e) => e.stopPropagation()}
											/>
											<div className="flex-1 min-w-0">
												<div
													className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
												>
													{todo.title}
												</div>
												{todo.description && (
													<div className="text-sm text-muted-foreground mt-1">
														{todo.description}
													</div>
												)}
												<div className="flex items-center gap-3 mt-2">
													{todo.dueDate && (
														<div className="flex items-center gap-1 text-xs text-muted-foreground">
															<Calendar className="w-3 h-3" />
															{new Date(todo.dueDate).toLocaleDateString(
																"en-US",
																{ month: "short", day: "numeric" },
															)}
														</div>
													)}
													<Badge
														variant="secondary"
														className={cn(
															"text-xs",
															todo.priority === "high"
																? "bg-destructive/20 text-destructive"
																: todo.priority === "medium"
																	? "bg-chart-2/20 text-chart-2"
																	: "bg-chart-4/20 text-chart-4",
														)}
													>
														<Flag className="w-3 h-3 mr-1" />
														{todo.priority}
													</Badge>
												</div>
											</div>
										</button>
									))}

									{sectionTodos.length === 0 && (
										<div className="text-sm text-muted-foreground italic py-4 text-center">
											No tasks in this section
										</div>
									)}
								</div>
							</div>
						);
					})}

					{/* Add New Section */}
					{isAddingSection ? (
						<div className="flex items-center gap-2">
							<GripVertical className="w-4 h-4 text-muted-foreground" />
							<Input
								value={newSectionName}
								onChange={(e) => setNewSectionName(e.target.value)}
								placeholder="Section name"
								className="h-9"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleAddSection();
									if (e.key === "Escape") {
										setIsAddingSection(false);
										setNewSectionName("");
									}
								}}
							/>
							<Button size="sm" onClick={handleAddSection}>
								Add
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									setIsAddingSection(false);
									setNewSectionName("");
								}}
							>
								Cancel
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setIsAddingSection(true)}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Section
						</Button>
					)}
				</div>
			</div>

			{selectedTodo && (
				<EditTodoModal
					isOpen={!!selectedTodo}
					onClose={() => setSelectedTodo(null)}
					todo={
						selectedTodo as unknown as Record<string, string> & {
							completed: boolean;
						}
					}
				/>
			)}

			<NewTodoModal
				isOpen={isNewTodoModalOpen}
				onClose={() => setIsNewTodoModalOpen(false)}
				projectId={projectId}
			/>
		</div>
	);
}

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
