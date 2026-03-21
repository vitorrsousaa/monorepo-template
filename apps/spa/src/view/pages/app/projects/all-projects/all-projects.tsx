import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ROUTES } from "@/config/routes";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { useGetProjectsSummary } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { useCreateProject } from "@/modules/projects/app/hooks/use-create-project";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { ProjectSummary } from "@repo/contracts/projects/summary";
import { Card } from "@repo/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	History,
	Loader2,
	MoreHorizontal,
	Plus,
	RotateCw,
	Search,
	Trash2,
} from "lucide-react";
import { AllProjectsSkeleton } from "./all-projects-skeleton";
import { AllProjectsEmptyState } from "./all-projects-empty-state";
import { AllProjectsErrorState } from "./all-projects-error-state";

type ProjectStatus = "ativo" | "concluido";

function deriveStatus(project: ProjectSummary): ProjectStatus {
	if (project.totalCount > 0 && project.completedCount === project.totalCount) {
		return "concluido";
	}
	return "ativo";
}

type FilterTab = "todos" | "ativo" | "concluido";

type ProjectWithStatus = WithOptimisticState<ProjectSummary> & {
	status: ProjectStatus;
};

export function AllProjects() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const {
		projectSummaries,
		isFetchingProjectsSummary,
		isErrorProjectsSummary,
		refetchProjectsSummary,
	} = useGetProjectsSummary();
	const { retryProject } = useCreateProject();

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterTab>("todos");
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		project: ProjectWithStatus | null;
	}>({ isOpen: false, project: null });

	const projectsWithStatus: ProjectWithStatus[] = (projectSummaries ?? []).map(
		(p) => ({ ...p, status: deriveStatus(p) }),
	);

	const filtered = projectsWithStatus.filter((p) => {
		const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
		const matchesFilter = filter === "todos" || p.status === filter;
		return matchesSearch && matchesFilter;
	});

	const isFiltered = search.length > 0 || filter !== "todos";

	const filterTabs: { id: FilterTab; label: string }[] = [
		{ id: "todos", label: t("projects.allProjects.filters.all") },
		{ id: "ativo", label: t("projects.allProjects.filters.active") },
		{ id: "concluido", label: t("projects.allProjects.filters.completed") },
	];

	function openDeleteConfirm(project: ProjectWithStatus) {
		setDeleteModal({ isOpen: true, project });
	}

	function handleConfirmDelete() {
		// TODO: integrar com API de delete quando disponível
		setDeleteModal({ isOpen: false, project: null });
	}

	const showEmpty =
		!isFetchingProjectsSummary &&
		!isErrorProjectsSummary &&
		filtered.length === 0;
	const showList =
		!isFetchingProjectsSummary &&
		!isErrorProjectsSummary &&
		filtered.length > 0;

	return (
		<div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground tracking-tight">
						{t("projects.allProjects.title")}
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{t("projects.allProjects.count", {
							count: projectsWithStatus.length,
						})}
					</p>
				</div>
				<Button
					onClick={() => setIsNewProjectModalOpen(true)}
					size="sm"
					className="gap-1.5 shrink-0"
				>
					<Plus className="w-4 h-4" />
					{t("projects.allProjects.newProject")}
				</Button>
			</div>

			{/* Filtros + Busca */}
			<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
				<div className="flex items-center gap-1 bg-muted rounded-lg p-1 shrink-0">
					{filterTabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setFilter(tab.id)}
							className={cn(
								"px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
								filter === tab.id
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{tab.label}
							<span
								className={cn(
									"text-[10px] font-semibold",
									filter === tab.id
										? "text-primary"
										: "text-muted-foreground/60",
								)}
							>
								{tab.id === "todos"
									? projectsWithStatus.length
									: projectsWithStatus.filter((p) => p.status === tab.id)
											.length}
							</span>
						</button>
					))}
				</div>

				<div className="relative flex-1 w-full sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
					<Input
						placeholder={t("projects.allProjects.searchPlaceholder")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8 h-8 text-sm"
					/>
				</div>
			</div>

			{/* Estados */}
			<RenderIf
				condition={isFetchingProjectsSummary}
				render={<AllProjectsSkeleton />}
			/>
			<RenderIf
				condition={isErrorProjectsSummary}
				render={
					<AllProjectsErrorState onRetry={refetchProjectsSummary} />
				}
			/>
			<RenderIf
				condition={showEmpty}
				render={
					<AllProjectsEmptyState
						onNewProject={() => setIsNewProjectModalOpen(true)}
						isFiltered={isFiltered}
					/>
				}
			/>
			<RenderIf
				condition={showList}
				render={
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((project) => {
							const remaining = Math.max(
								project.totalCount - project.completedCount,
								0,
							);
							const isMuted = project.status !== "ativo";

							const isPending =
								project.optimisticState === OptimisticState.PENDING;
							const isOptimisticError =
								project.optimisticState === OptimisticState.ERROR;
							const isSynced =
								project.optimisticState === OptimisticState.SYNCED ||
								!project.optimisticState;
							const isNavigable = isSynced;

							return (
								<Card
									key={project.id}
									className={cn(
										"group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-200",
										isNavigable &&
											"cursor-pointer hover:border-border/80 hover:shadow-sm",
										!isPending &&
											!isOptimisticError &&
											!isMuted &&
											"border-border",
										isMuted &&
											isSynced &&
											"border-border/70 opacity-70 hover:opacity-90",
										isPending && "cursor-not-allowed opacity-60 border-border/50",
										isOptimisticError &&
											"cursor-not-allowed border-destructive/50 bg-destructive/5",
									)}
									onClick={() => {
										if (!isNavigable) return;
										navigate(
											ROUTES.PROJECTS.PROJECT_DETAILS.replace(
												":id",
												project.id,
											),
										);
									}}
								>
									{/* Faixa de cor no topo */}
									<div
										className={cn(
											"h-[3px] w-full",
											isPending && "animate-pulse",
										)}
										style={{
											backgroundColor: isOptimisticError
												? "var(--destructive)"
												: isMuted || isPending
													? "rgba(148,163,184,0.9)"
													: project.color,
										}}
									/>

									<div className="flex flex-1 flex-col gap-4 px-5 pb-4 pt-4">
										{/* Cabeçalho */}
										<div className="flex items-start gap-3">
											<div
												className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
												style={{
													backgroundColor:
														isMuted || isPending
															? "rgba(148,163,184,0.4)"
															: `${project.color}33`,
													color:
														isMuted || isPending
															? "rgb(148,163,184)"
															: project.color,
												}}
											>
												{project.name.charAt(0).toUpperCase()}
											</div>

											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<div className="min-w-0">
														<p className="truncate text-sm font-semibold tracking-tight">
															{project.name}
														</p>
														{project.description && (
															<p className="mt-0.5 truncate text-[11px] text-muted-foreground">
																{project.description}
															</p>
														)}
													</div>

													<div className="flex items-start gap-1 shrink-0">
														{/* Badge de status concluído (só synced) */}
														{project.status !== "ativo" && isSynced && (
															<span className="mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
																<CheckCircle2 className="mr-1 h-3 w-3" />
																{t(
																	"projects.allProjects.status.completed",
																)}
															</span>
														)}

														{/* Indicador PENDING */}
														<RenderIf
															condition={isPending}
															render={
																<span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
																	<Loader2 className="h-3 w-3 animate-spin" />
																	{t(
																		"projects.allProjects.card.saving",
																	)}
																</span>
															}
														/>

														{/* Indicador ERROR + retry */}
														<RenderIf
															condition={isOptimisticError}
															render={
																<button
																	type="button"
																	onClick={(e) => {
																		e.stopPropagation();
																		retryProject(project.id);
																	}}
																	className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
																>
																	<AlertCircle className="h-3 w-3" />
																	{t(
																		"projects.allProjects.card.saveFailed",
																	)}
																	<RotateCw className="h-2.5 w-2.5 ml-0.5" />
																</button>
															}
														/>

														{/* Dropdown (só synced) */}
														<RenderIf
															condition={isSynced}
															render={
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<button
																			type="button"
																			className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
																			onClick={(e) =>
																				e.stopPropagation()
																			}
																		>
																			<MoreHorizontal className="h-4 w-4" />
																		</button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		align="end"
																		className="w-48"
																		onClick={(e) => e.stopPropagation()}
																	>
																		<DropdownMenuItem
																			onSelect={() =>
																				navigate(
																					ROUTES.PROJECTS.PROJECT_DETAILS.replace(
																						":id",
																						project.id,
																					),
																				)
																			}
																		>
																			<Eye className="text-muted-foreground" />
																			<span>
																				{t(
																					"projects.allProjects.card.viewProject",
																				)}
																			</span>
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			<History className="text-muted-foreground" />
																			<span>
																				{t(
																					"projects.allProjects.card.viewActivity",
																				)}
																			</span>
																		</DropdownMenuItem>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem
																			className="text-destructive focus:text-destructive"
																			onSelect={() =>
																				openDeleteConfirm(project)
																			}
																		>
																			<Trash2 className="text-muted-foreground" />
																			<span>
																				{t(
																					"projects.allProjects.card.deleteProject",
																				)}
																			</span>
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															}
														/>
													</div>
												</div>
											</div>
										</div>

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

											<div className="flex items-center justify-between pt-0.5">
												<span className="text-[11px] text-muted-foreground">
													{project.status === "concluido"
														? t("projects.allProjects.card.finished")
														: t("projects.allProjects.card.remaining", {
																count: remaining,
															})}
												</span>
											</div>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				}
			/>

			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={() => setIsNewProjectModalOpen(false)}
			/>

			<DeleteProjectModal
				isOpen={deleteModal.isOpen}
				onClose={() => setDeleteModal({ isOpen: false, project: null })}
				projectName={deleteModal.project?.name ?? ""}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
