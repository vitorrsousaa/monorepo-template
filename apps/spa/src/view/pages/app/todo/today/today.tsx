import { useGetTodayTasks } from "@/modules/todo/app/hooks/use-get-today-tasks";
import { ProjectColumn } from "@/modules/todo/view/components/project-column";
import { TodayTasksHeader } from "@/modules/todo/view/components/today-header";
import type { TaskDto } from "@repo/contracts/tasks/today";
import type { TodayProjectDto } from "@repo/contracts/tasks/today";
import { RenderIf } from "@repo/ui/render-if";
import { useMemo } from "react";
import { TodayErrorState } from "./components/today-error-state";
import { TodayLoadingSkeleton } from "./components/today-loading-skeleton";

export interface Todo {
	id: string;
	title: string;
	description?: string;
	dueDate?: string;
	completed: boolean;
	tags?: string[];
	comments?: number;
	projectId: string;
	projectName?: string;
	userId?: string;
}

export interface Project {
	id: string;
	name: string;
	emoji: string;
	todos: Todo[];
	userId?: string;
}

function mapApiToView(apiProjects: TodayProjectDto[]): Project[] {
	return apiProjects.map((p) => ({
		id: p.id,
		name: p.name,
		emoji: "",
		todos: p.tasks.map((t: TaskDto) => ({
			id: t.id,
			title: t.title,
			description: t.description,
			dueDate: t.dueDate ?? undefined,
			completed: t.completed,
			projectId: t.projectId ?? p.id,
			projectName: p.name,
			userId: t.userId,
		})),
	}));
}

export function Today() {


	const {
		todayData,
		isFetchingTodayTasks,
		isErrorTodayTasks,
		refetchTodayTasks,
	} = useGetTodayTasks();

	const projects = useMemo(
		() => mapApiToView(todayData.projects),
		[todayData.projects],
	);

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Header - Fixed */}
			<TodayTasksHeader taskCount={projects.reduce((acc, project) => acc + project.todos.length, 0)} isLoading={isFetchingTodayTasks} />

			{/* Kanban Board - Scrollable Container */}
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
				<RenderIf
					condition={isFetchingTodayTasks}
					render={<TodayLoadingSkeleton />}
				/>
				<RenderIf
					condition={isErrorTodayTasks}
					render={
						<TodayErrorState onRetry={() => refetchTodayTasks()} />
					}
				/>
				<RenderIf
					condition={!isFetchingTodayTasks && !isErrorTodayTasks}
					render={
						<div className="p-6 flex gap-4" style={{ minWidth: "max-content" }}>
							{projects.map((project) => (
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
