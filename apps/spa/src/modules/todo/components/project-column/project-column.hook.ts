import { ROUTES } from "@/config/routes";
import type { Project, Todo } from "@/pages/app/todo/today";
import { PROJECTS_MOCKS } from "@/pages/app/todo/today/today.mocks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useProjectColumnHook() {
	const navigate = useNavigate();
	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [deleteProjectModal, setDeleteProjectModal] = useState<{
		isOpen: boolean;
		project: Project | null;
	}>({
		isOpen: false,
		project: null,
	});
	const [selectedTodo, setSelectedTodo] = useState<
		(Todo & { projectName: string; createdAt: string }) | null
	>(null);

	// Mock projects data
	const [projects, setProjects] = useState<Project[]>(PROJECTS_MOCKS);

	const handleNewTodo = (projectId: string) => {
		setSelectedProjectId(projectId);
		setIsNewTodoModalOpen(true);
	};

	const handleDeleteProject = (project: Project) => {
		setDeleteProjectModal({ isOpen: true, project });
	};

	const confirmDeleteProject = () => {
		if (deleteProjectModal.project) {
			console.log("[v0] Deleting project:", deleteProjectModal.project.id);
			setProjects(
				projects.filter((p) => p.id !== deleteProjectModal.project?.id),
			);
		}
	};

	const handleTaskClick = (todo: Todo, project: Project) => {
		setSelectedTodo({
			...todo,
			projectName: project.name,
			createdAt: new Date().toISOString(),
		});
	};

	const handleViewProjectDetails = (projectId: string) => {
		console.log("projectId", projectId);
		navigate(ROUTES.TODO.PROJECTS.replace(":id", projectId));
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const isOverdue = date < now && date.toDateString() !== now.toDateString();

		return {
			text: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			isOverdue,
		};
	};

	return {
		selectedTodo,
		setSelectedTodo,
		isNewTodoModalOpen,
		setIsNewTodoModalOpen,
		selectedProjectId,
		deleteProjectModal,
		setDeleteProjectModal,
		handleNewTodo,
		handleDeleteProject,
		handleTaskClick,
		handleViewProjectDetails,
		formatDate,
		confirmDeleteProject,
	};
}
