import { ROUTES } from "@/config/routes";
import type { TaskDto, TodayProjectDto } from "@repo/contracts/tasks/today";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UseProjectColumnHookOptions {
	onProjectDeleted?: () => void;
}

export function useProjectColumnHook(options?: UseProjectColumnHookOptions) {
	const { onProjectDeleted } = options ?? {};
	const navigate = useNavigate();
	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [deleteProjectModal, setDeleteProjectModal] = useState<{
		isOpen: boolean;
		project: TodayProjectDto | null;
	}>({
		isOpen: false,
		project: null,
	});
	const [selectedTask, setSelectedTask] = useState<
		(TaskDto & { projectName: string }) | null
	>(null);

	const handleNewTodo = (projectId: string) => {
		setSelectedProjectId(projectId);
		setIsNewTodoModalOpen(true);
	};

	const handleDeleteProject = (project: TodayProjectDto) => {
		setDeleteProjectModal({ isOpen: true, project });
	};

	const confirmDeleteProject = () => {
		if (deleteProjectModal.project) {
			onProjectDeleted?.();
		}
		setDeleteProjectModal({ isOpen: false, project: null });
	};

	const handleTaskClick = (task: TaskDto, project: TodayProjectDto) => {
		setSelectedTask({
			...task,
			projectName: project.name,
		});
	};

	const handleViewProjectDetails = (projectId: string) => {
		navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", projectId));
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const taskStart = new Date(date);
		taskStart.setHours(0, 0, 0, 0);
		const isOverdue = taskStart < todayStart;

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
		selectedTask,
		setSelectedTask,
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
