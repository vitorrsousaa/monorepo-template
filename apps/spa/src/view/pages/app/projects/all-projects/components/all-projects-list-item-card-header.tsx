import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateProject } from "@/modules/projects/app/hooks/use-create-project";
import type { ProjectSummaryWithOptimisticState } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { OptimisticState } from "@/utils/types";
import { RenderIf } from "@repo/ui/render-if";
import { AlertCircle, CheckCircle2, RotateCw } from "lucide-react";
import { AllProjectsListItemActions } from "./all-projects-list-item-actions";
import { AllProjectsListItemLoadingIndicator } from "./all-projects-list-item-loading-indicator";

interface AllProjectsListItemCardHeaderProps {
	project: ProjectSummaryWithOptimisticState;
}

export function AllProjectsListItemCardHeader(
	props: AllProjectsListItemCardHeaderProps,
) {
	const { project } = props;
	const { t } = useTranslation();

	const projectName = project.name;
	const projectDescription = project.description;
	const projectId = project.id;

	const { retryProject } = useCreateProject();

	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		project: ProjectSummaryWithOptimisticState | null;
	}>({ isOpen: false, project: null });

	function openDeleteConfirm(project: ProjectSummaryWithOptimisticState) {
		setDeleteModal({ isOpen: true, project });
	}

	function handleConfirmDelete() {
		// TODO: integrar com API de delete quando disponível
		setDeleteModal({ isOpen: false, project: null });
	}

	const isMuted = project.completedCount === project.totalCount;

	const isPending = project.optimisticState === OptimisticState.PENDING;
	const isOptimisticError = project.optimisticState === OptimisticState.ERROR;
	const isSynced =
		project.optimisticState === OptimisticState.SYNCED ||
		!project.optimisticState;

	return (
		<>
			<div className="flex items-start gap-3">
				<div
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
					style={{
						backgroundColor:
							isMuted || isPending
								? "rgba(148,163,184,0.4)"
								: `${project.color}33`,
						color: isMuted || isPending ? "rgb(148,163,184)" : project.color,
					}}
				>
					{projectName.charAt(0).toUpperCase()}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold tracking-tight">
								{projectName}
							</p>
							{projectDescription && (
								<p className="mt-0.5 truncate text-[11px] text-muted-foreground">
									{projectDescription}
								</p>
							)}
						</div>

						<div className="flex items-start gap-1 shrink-0">
							{/* Badge de status concluído (só synced) */}
							{isMuted && isSynced && (
								<span className="mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
									<CheckCircle2 className="mr-1 h-3 w-3" />
									{t("projects.allProjects.status.completed")}
								</span>
							)}

							{/* Indicador PENDING */}
							<RenderIf
								condition={isPending}
								render={<AllProjectsListItemLoadingIndicator />}
							/>

							{/* Indicador ERROR + retry */}
							<RenderIf
								condition={isOptimisticError}
								render={
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											retryProject(projectId);
										}}
										className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
									>
										<AlertCircle className="h-3 w-3" />
										{t("projects.allProjects.card.saveFailed")}
										<RotateCw className="h-2.5 w-2.5 ml-0.5" />
									</button>
								}
							/>

							<RenderIf
								condition={isSynced}
								render={
									<AllProjectsListItemActions
										projectId={projectId}
										onDeleteConfirm={() => openDeleteConfirm(project)}
									/>
								}
							/>
						</div>
					</div>
				</div>
			</div>

			<DeleteProjectModal
				isOpen={deleteModal.isOpen}
				onClose={() => setDeleteModal({ isOpen: false, project: null })}
				projectName={deleteModal.project?.name ?? ""}
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
}
