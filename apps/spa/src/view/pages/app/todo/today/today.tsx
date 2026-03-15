import { useGetTodayTasks } from "@/modules/todo/app/hooks/use-get-today-tasks";
import { ProjectColumn } from "@/modules/todo/view/components/project-column";
import { TodayTasksHeader } from "@/modules/todo/view/components/today-header";
import { RenderIf } from "@repo/ui/render-if";
import { useMemo } from "react";
import { TodayErrorState } from "./components/today-error-state";
import { TodayLoadingSkeleton } from "./components/today-loading-skeleton";

export function Today() {
	const {
		todayData,
		isFetchingTodayTasks,
		isErrorTodayTasks,
		refetchTodayTasks,
	} = useGetTodayTasks();

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
					condition={!isFetchingTodayTasks && !isErrorTodayTasks}
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
		</div>
	);
}
