import { useTranslation } from "react-i18next";

import type { ProjectSummaryWithOptimisticState } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { OptimisticState } from "@/utils/types";
import { cn } from "@repo/ui/utils";
import { AllProjectsListItemCard } from "./all-projects-list-item-card";
import { AllProjectsListItemCardHeader } from "./all-projects-list-item-card-header";
import { AllProjectsListItemFooter } from "./all-projects-list-item-footer";

interface AllProjectsListProps {
	projects: ProjectSummaryWithOptimisticState[];
}

export function AllProjectsList(props: AllProjectsListProps) {
	const { projects } = props;

	const { t } = useTranslation();

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{projects.map((project) => {
				const remaining = Math.max(
					project.totalCount - project.completedCount,
					0,
				);
				const isMuted = project.completedCount === project.totalCount;

				const isPending = project.optimisticState === OptimisticState.PENDING;
				const isOptimisticError =
					project.optimisticState === OptimisticState.ERROR;

				return (
					<AllProjectsListItemCard
						key={project.id}
						projectId={project.id}
						optimisticState={project.optimisticState}
						isCompleted={isMuted}
						color={project.color}
					>
						<div className="flex flex-1 flex-col gap-4 px-5 pb-4 pt-4">
							{/* Cabeçalho */}
							<AllProjectsListItemCardHeader project={project} />

							{/* Progresso */}
							<div className="mt-auto space-y-1.5">
								<div className="flex items-baseline justify-between">
									<span
										className="text-xl font-semibold leading-none tracking-tight"
										style={{
											color:
												isMuted || isPending
													? "rgb(148,163,184)"
													: isOptimisticError
														? "var(--destructive)"
														: project.color,
										}}
									>
										{project.percentageCompleted}%
									</span>
									<span className="text-[11px] text-muted-foreground">
										{t("projects.allProjects.card.tasksOf", {
											done: project.completedCount,
											total: project.totalCount,
										})}
									</span>
								</div>

								<div className="h-1 overflow-hidden rounded-full bg-muted">
									<div
										className={cn(
											"h-full rounded-full transition-all duration-500",
											isPending && "animate-pulse",
										)}
										style={{
											width: `${project.percentageCompleted}%`,
											backgroundColor:
												isMuted || isPending
													? "rgba(148,163,184,0.85)"
													: isOptimisticError
														? "var(--destructive)"
														: project.color,
										}}
									/>
								</div>

								<AllProjectsListItemFooter
									isFinished={project.completedCount === project.totalCount}
									remaining={remaining}
								/>
							</div>
						</div>
					</AllProjectsListItemCard>
				);
			})}
		</div>
	);
}
