import { ROUTES } from "@/config/routes";
import { useGetProjectsSummary } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProjectPanelEmptyState } from "./project-panel-empty-state";
import { ProjectPanelErrorState } from "./project-panel-error-state";
import { ProjectPanelSkeleton } from "./project-panel-skeleton";

interface ProgressBarProps {
	value: number;
	color?: string;
}

const ProgressBar = (props: ProgressBarProps) => {
	const { value, color = "bg-primary" } = props;
	const pct = Math.min(value, 100);

	return (
		<div className="h-1 bg-muted rounded-full overflow-hidden flex-1 min-w-0">
			<div
				className={cn("h-full rounded-full transition-all duration-500", color)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
};

export const ProjectPanel = () => {
	const { projectSummaries, isFetchingProjectsSummary, isErrorProjectsSummary, refetchProjectsSummary } =
		useGetProjectsSummary();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const recentProjects = projectSummaries?.slice(0, 4) ?? [];
	const isEmpty = !isFetchingProjectsSummary && !isErrorProjectsSummary && recentProjects.length === 0;
	const shouldShowList = !isFetchingProjectsSummary && !isErrorProjectsSummary && recentProjects.length > 0;

	const handleNavigateToProjects = () => navigate(ROUTES.PROJECTS.LIST);

	return (
		<div className="bg-card border border-border rounded-[14px] shadow-sm overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4 border-b border-border/70">
				<h3 className="text-[13px] font-semibold text-foreground">
					{t("dashboard.panels.projects")}
				</h3>
				<button
					type="button"
					onClick={handleNavigateToProjects}
					className="text-xs font-medium text-primary hover:text-primary/90 flex items-center gap-0.5 no-underline"
				>
					{t("dashboard.panels.seeAllProjects")}
					<ArrowRight className="w-3 h-3" />
				</button>
			</div>

			<RenderIf condition={isFetchingProjectsSummary} render={<ProjectPanelSkeleton />} />
			<RenderIf condition={isErrorProjectsSummary} render={<ProjectPanelErrorState onRetry={refetchProjectsSummary} />} />
			<RenderIf condition={isEmpty} render={<ProjectPanelEmptyState />} />
			<RenderIf
				condition={shouldShowList}
				render={
					<div className="divide-y divide-border/70">
						{recentProjects.map((p) => {
							const handleClick = () =>
								navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", p.id));

							return (
								<button
									key={p.id}
									type="button"
									onClick={handleClick}
									className="w-full text-left px-5 py-4 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start gap-3 mb-3">
										<div
											className="w-[30px] h-[30px] rounded-md shrink-0"
											style={{ backgroundColor: `${p.color}20` }}
										>
											<div
												className="w-full h-full rounded-md opacity-60"
												style={{ backgroundColor: p.color }}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-[13px] font-semibold text-foreground">
												{p.name}
											</div>
											<RenderIf
												condition={!!p.description}
												render={
													<div className="text-[11px] text-muted-foreground truncate">
														{p.description}
													</div>
												}
											/>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<ProgressBar value={p.percentageCompleted} />
										<span
											className={cn(
												"text-[11px] font-semibold min-w-[30px] text-right",
												p.percentageCompleted > 0
													? "text-foreground"
													: "text-muted-foreground",
											)}
										>
											{Math.round(p.percentageCompleted)}%
										</span>
									</div>
									<div className="text-[11px] text-muted-foreground mt-1.5">
										<RenderIf
											condition={p.totalCount > 0}
											render={t("dashboard.stats.tasksOf", {
												done: p.completedCount,
												total: p.totalCount,
											})}
											fallback={t("dashboard.stats.noTasks")}
										/>
									</div>
								</button>
							);
						})}
					</div>
				}
			/>
		</div>
	);
};
