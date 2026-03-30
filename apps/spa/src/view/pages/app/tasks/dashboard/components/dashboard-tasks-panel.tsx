import { TaskListCard } from "@/components/task-list-card";
import { ROUTES } from "@/config/routes";
import { useGetTodayTasks } from "@/modules/tasks/app/hooks/use-get-today-tasks";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import { RenderIf } from "@repo/ui/render-if";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardTasksPanelEmpty } from "./dashboard-tasks-panel-empty";
import { DashboardTasksPanelErrorState } from "./dashboard-tasks-panel-error-state";
import { DashboardTasksPanelSkeleton } from "./dashboard-tasks-panel-skeleton";

export function DashboardTasksPanel() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const {
		todayData,
		isFetchingTodayTasks,
		isErrorTodayTasks,
		refetchTodayTasks,
	} = useGetTodayTasks();

	const todayTasks = todayData.projects
		.filter((p) => p.id !== PROJECTS_DEFAULT_IDS.INBOX)
		.flatMap((p) => p.tasks)
		.slice(0, 7);

	const shouldRenderEmptyState =
		!isFetchingTodayTasks && !isErrorTodayTasks && todayTasks.length === 0;
	const shouldRenderList =
		!isFetchingTodayTasks && !isErrorTodayTasks && todayTasks.length > 0;

	return (
		<div className="bg-card border border-border rounded-[14px] shadow-sm overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4 border-b border-border/70">
				<h3 className="text-[13px] font-semibold text-foreground">
					{t("dashboard.panels.todayTasks")}
				</h3>
				<button
					type="button"
					onClick={() => navigate(ROUTES.TASKS.TODAY)}
					className="text-xs font-medium text-primary hover:text-primary/90 flex items-center gap-0.5 no-underline"
				>
					{t("dashboard.panels.seeAll")}
					<ArrowRight className="w-3 h-3" />
				</button>
			</div>
			<RenderIf
				condition={isFetchingTodayTasks}
				render={<DashboardTasksPanelSkeleton />}
			/>
			<RenderIf
				condition={isErrorTodayTasks}
				render={<DashboardTasksPanelErrorState onRetry={refetchTodayTasks} />}
			/>
			<RenderIf
				condition={shouldRenderEmptyState}
				render={<DashboardTasksPanelEmpty />}
			/>
			<RenderIf
				condition={shouldRenderList}
				render={<TaskListCard tasks={todayTasks} shouldAllowAddTask={false} />}
			/>
		</div>
	);
}
