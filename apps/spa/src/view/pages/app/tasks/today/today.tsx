import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { useGetTodayTasks } from "@/modules/tasks/app/hooks/use-get-today-tasks";
import { ProjectColumn } from "@/modules/todo/view/components/project-column";
import { TodayTasksHeader } from "@/modules/todo/view/components/today-header";
import { RenderIf } from "@repo/ui/render-if";
import { useMemo, useState } from "react";
import { TodayEmptyState } from "./components/today-empty-state";
import { TodayErrorState } from "./components/today-error-state";
import { TodayLoadingSkeleton } from "./components/today-loading-skeleton";

export function Today() {
	const {
		todayData,
		isFetchingTodayTasks,
		isErrorTodayTasks,
		refetchTodayTasks,
	} = useGetTodayTasks();
	const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

	const taskCount = useMemo(
		() =>
			todayData.projects.reduce(
				(acc, project) => acc + project.tasks.length,
				0,
			),
		[todayData],
	);

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Header - Fixed */}
			<TodayTasksHeader
				taskCount={taskCount}
				isLoading={isFetchingTodayTasks}
			/>

			{/* Kanban Board - Scrollable Container */}
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
				<RenderIf
					condition={isFetchingTodayTasks}
					render={<TodayLoadingSkeleton />}
				/>
				<RenderIf
					condition={isErrorTodayTasks}
					render={<TodayErrorState onRetry={() => refetchTodayTasks()} />}
				/>
				<RenderIf
					condition={
						!isFetchingTodayTasks &&
						!isErrorTodayTasks &&
						todayData.projects.length === 0
					}
					render={
						<TodayEmptyState onAddTask={() => setIsNewTaskModalOpen(true)} />
					}
				/>
				<RenderIf
					condition={
						!isFetchingTodayTasks &&
						!isErrorTodayTasks &&
						todayData.projects.length > 0
					}
					render={
						<div className="p-6 flex gap-4" style={{ minWidth: "max-content" }}>
							{todayData.projects.map((project) => (
								<ProjectColumn
									key={project.id}
									project={project}
									onProjectDeleted={refetchTodayTasks}
								/>
							))}
						</div>
					}
				/>
			</div>

			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={() => setIsNewTaskModalOpen(false)}
			/>
		</div>
	);
}
