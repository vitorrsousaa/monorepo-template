import { ROUTES } from "@/config/routes";
import { useCreateProject } from "@/modules/projects/app/hooks/use-create-project";
import { useGetProjectsSummary } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { OptimisticState } from "@/utils/types";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import { AlertCircle, ArrowRight, Loader2, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProjectPanelEmptyState } from "./project-panel-empty-state";
import { ProjectPanelErrorState } from "./project-panel-error-state";
import { ProjectPanelSkeleton } from "./project-panel-skeleton";

interface ProgressBarProps {
	value: number;
	color?: string;
	pulse?: boolean;
}

const ProgressBar = (props: ProgressBarProps) => {
	const { value, color = "bg-primary", pulse = false } = props;
	const pct = Math.min(value, 100);

	return (
		<div className="h-1 bg-muted rounded-full overflow-hidden flex-1 min-w-0">
			<div
				className={cn(
					"h-full rounded-full transition-all duration-500",
					color,
					pulse && "animate-pulse",
				)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
};

export const ProjectPanel = () => {
	const { projectSummaries, isFetchingProjectsSummary, isErrorProjectsSummary, refetchProjectsSummary } =
		useGetProjectsSummary();
	const { retryProject } = useCreateProject();
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
							const isPending = p.optimisticState === OptimisticState.PENDING;
							const isOptimisticError = p.optimisticState === OptimisticState.ERROR;
							const isSynced =
								p.optimisticState === OptimisticState.SYNCED || !p.optimisticState;

							const itemContent = (
								<>
									<div className="flex items-start gap-3 mb-3">
										<div
											className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
											style={{
												backgroundColor: isOptimisticError
													? "var(--destructive-foreground, rgba(220,38,38,0.1))"
													: isPending
														? "rgba(148,163,184,0.2)"
														: `${p.color}33`,
												color: isOptimisticError
													? "var(--destructive)"
													: isPending
														? "rgb(148,163,184)"
														: p.color,
											}}
										>
											{p.name.charAt(0).toUpperCase()}
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

										{/* Indicador PENDING */}
										<RenderIf
											condition={isPending}
											render={
												<span className="shrink-0 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
													<Loader2 className="h-3 w-3 animate-spin" />
													{t("projects.allProjects.card.saving")}
												</span>
											}
										/>

										{/* Indicador ERROR */}
										<RenderIf
											condition={isOptimisticError}
											render={
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														retryProject(p.id);
													}}
													className="shrink-0 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
												>
													<AlertCircle className="h-3 w-3" />
													{t("projects.allProjects.card.saveFailed")}
													<RotateCw className="h-2.5 w-2.5" />
												</button>
											}
										/>
									</div>
									<div className="flex items-center gap-3">
										<ProgressBar
											value={p.percentageCompleted}
											pulse={isPending}
										/>
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
								</>
							);

							if (!isSynced) {
								return (
									<div
										key={p.id}
										className={cn(
											"w-full text-left px-5 py-4",
											isPending && "opacity-60",
											isOptimisticError && "bg-destructive/5",
										)}
									>
										{itemContent}
									</div>
								);
							}

							return (
								<button
									key={p.id}
									type="button"
									onClick={() =>
										navigate(
											ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", p.id),
										)
									}
									className="w-full text-left px-5 py-4 hover:bg-muted/50 transition-colors"
								>
									{itemContent}
								</button>
							);
						})}
					</div>
				}
			/>
		</div>
	);
};
