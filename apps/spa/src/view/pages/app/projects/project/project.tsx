import type { ProjectDetail } from "@/modules/projects/app/entitites/project-detail";
import { EditTodoModal } from "@/modules/todo/view/modals/edit-todo-modal";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import type { TTodoFormSchema } from "@/modules/todo/view/forms/todo/todo-form.schema";
import type { SectionWithOptimisticState } from "@/modules/sections/app/hooks/use-create-section";
import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import type { Todo } from "@/modules/todo/app/entities/todo";
import type { TaskRowTask } from "@/components/task-row";
import { ProjectSection } from "@/modules/projects/view/components/project-section";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { GripVertical, Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { ProjectErrorState } from "./components/project-error-state";
import { ProjectHeader } from "./components/project-header";
import { ProjectLoadingSkeleton } from "./components/project-loading-skeleton";
import { ProjectSectionBlock } from "@/components/project-section-block";
import { ProjectTopbar } from "./components/project-topbar";
import { useProjectHook } from "./project.hook";

function todoToTaskRowTask(t: Todo): TaskRowTask {
	return {
		id: t.id,
		title: t.title,
		description: t.description ?? null,
		completed: t.completed,
		dueDate: t.dueDate ?? null,
		priority: t.priority ?? null,
	};
}

export function Projects() {
	const {
		projectId,
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		openInputToAddSection,
		newSectionName,
		refetchProjectDetail,
		handleAddSection,
		toggleInputToAddSection,
		handleCloseInputToAddSection,
		handleKeyDownInputToAddSection,
		handleChangeInputToAddSection,
	} = useProjectHook();

	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
	const [newTodoSectionId, setNewTodoSectionId] = useState<string | undefined>(
		undefined,
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editModalInitialValues, setEditModalInitialValues] =
		useState<Partial<TTodoFormSchema> | null>(null);
	const [editModalHeaderMeta, setEditModalHeaderMeta] = useState<{
		projectName: string;
		createdAt: string;
	} | null>(null);

	const openEditModal = useCallback(
		(task: TaskRowTask, sectionId: string | null, projectName: string) => {
			const todo = findTodoFromDetail(projectDetail, task.id);
			const rawCreatedAt =
				todo && "createdAt" in todo ? todo.createdAt : undefined;
			const createdAt =
				typeof rawCreatedAt === "string"
					? rawCreatedAt
					: rawCreatedAt instanceof Date
						? rawCreatedAt.toISOString()
						: new Date().toISOString();
			setEditModalInitialValues({
				id: task.id,
				title: task.title,
				description: task.description ?? undefined,
				project: projectId ?? "inbox",
				section: sectionId ?? "none",
				priority: task.priority ?? "none",
				dueDate: task.dueDate ? new Date(task.dueDate as string) : undefined,
			});
			setEditModalHeaderMeta({ projectName, createdAt });
			setIsEditModalOpen(true);
		},
		[projectDetail, projectId],
	);

	const closeEditModal = useCallback(() => {
		setEditModalInitialValues(null);
		setEditModalHeaderMeta(null);
		setIsEditModalOpen(false);
	}, []);

	if (isFetchingProjectDetail) {
		return <ProjectLoadingSkeleton />;
	}

	if (isErrorProjectDetail) {
		return (
			<div className="p-8">
				<ProjectErrorState onRetry={() => refetchProjectDetail()} />
			</div>
		);
	}

	if (!projectDetail) {
		return (
			<div className="p-8">
				<div className="text-center text-muted-foreground">
					Project not found
				</div>
			</div>
		);
	}

	const { project, sections, todosWithoutSection } = projectDetail;
	const allTodos = [
		...todosWithoutSection,
		...sections.flatMap((s) => s.todos),
	];
	const completedCount = allTodos.filter((t) => t.completed).length;
	const totalCount = allTodos.length;

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			<ProjectTopbar
				projectName={project.name}
				onAddTask={() => {
					setNewTodoSectionId(undefined);
					setIsNewTodoModalOpen(true);
				}}
			/>

			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="mx-auto max-w-[740px] px-8 pb-20 pt-8">
					<ProjectHeader
						icon="🐍"
						name={project.name}
						description={project.description}
						completedCount={completedCount}
						totalCount={totalCount}
						deadlineLabel={null}
						statusLabel="Active"
					/>

					{/* Unsectioned */}
					<ProjectSectionBlock
						name="Unsectioned"
						dimmed
						showDragHandle={false}
						tasks={todosWithoutSection.map(todoToTaskRowTask)}
						onTaskClick={(task) => openEditModal(task, null, project.name)}
						onAddTask={() => {
							setNewTodoSectionId(undefined);
							setIsNewTodoModalOpen(true);
						}}
					/>

					{/* Sections */}
					{sections.map((section) => (
						<ProjectSection
							key={section.id}
							section={section}
							projectId={projectId}
							projectName={project.name}
							onTaskClick={(task) =>
								openEditModal(task, section.id, project.name)
							}
							onAddTask={() => {
								setNewTodoSectionId(section.id);
								setIsNewTodoModalOpen(true);
							}}
						/>
					))}

					{/* Add section */}
					{openInputToAddSection ? (
						<div className="flex items-center gap-2 py-2.5">
							<GripVertical className="h-4 w-4 text-muted-foreground" />
							<Input
								value={newSectionName}
								onChange={handleChangeInputToAddSection}
								placeholder="Section name"
								className="h-9"
								autoFocus
								onKeyDown={handleKeyDownInputToAddSection}
							/>
							<Button size="sm" onClick={handleAddSection}>
								Add
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={handleCloseInputToAddSection}
							>
								Cancel
							</Button>
						</div>
					) : (
						<button
							type="button"
							className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							onClick={toggleInputToAddSection}
						>
							<Plus className="h-3.5 w-3.5" />
							Add section
						</button>
					)}
				</div>
			</div>

			<NewTodoModal
				isOpen={isNewTodoModalOpen}
				onClose={() => setIsNewTodoModalOpen(false)}
				projectId={projectId}
				sectionId={newTodoSectionId}
			/>

			<EditTodoModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				initialValues={editModalInitialValues ?? {}}
				headerMeta={editModalHeaderMeta ?? undefined}
			/>
		</div>
	);
}

function findTodoFromDetail(
	detail: ProjectDetail | undefined,
	taskId: string,
): Todo | undefined {
	if (!detail) return undefined;
	const fromUnsected = detail.todosWithoutSection.find((t) => t.id === taskId);
	if (fromUnsected) return fromUnsected;
	for (const section of detail.sections) {
		const found = section.todos.find((t) => t.id === taskId);
		if (found) return found;
	}
	return undefined;
}
