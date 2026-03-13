import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
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
import { cn } from "@repo/ui/utils";
import {
	Archive,
	ArrowRight,
	CheckCircle2,
	Eye,
	Folder,
	History,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import {
	ALL_PROJECTS_MOCK,
	ALL_PROJECTS_TASKS_MOCK,
	type AllProjectsProject,
} from "./all-projects.mocks";

const statusLabels: Record<
	AllProjectsProject["status"],
	{ label: string; color: string }
> = {
	ativo: { label: "Ativo", color: "bg-primary/10 text-primary" },
	concluido: {
		label: "Concluído",
		color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	},
	arquivado: { label: "Arquivado", color: "bg-muted text-muted-foreground" },
};

const filterTabs = [
	{ id: "todos" as const, label: "Todos" },
	{ id: "ativo" as const, label: "Ativos" },
	{ id: "concluido" as const, label: "Concluídos" },
	{ id: "arquivado" as const, label: "Arquivados" },
];

type FilterTab = (typeof filterTabs)[number]["id"];

export function AllProjects() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterTab>("todos");
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		project: AllProjectsProject | null;
	}>({ isOpen: false, project: null });

	// Mock data - substituir por hooks da API quando integrar
	const [projects] = useState(ALL_PROJECTS_MOCK);
	const [tasks] = useState(ALL_PROJECTS_TASKS_MOCK);

	const filtered = projects.filter((p) => {
		const matchesSearch = p.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesFilter = filter === "todos" || p.status === filter;
		return matchesSearch && matchesFilter;
	});

	function getProjectStats(projectId: string) {
		const projectTasks = tasks.filter((t) => t.projectId === projectId);
		const done = projectTasks.filter((t) => t.status === "concluida").length;
		const total = projectTasks.length;
		const pct = total === 0 ? 0 : Math.round((done / total) * 100);
		return { done, total, pct };
	}

	function openDeleteConfirm(project: AllProjectsProject) {
		setDeleteModal({ isOpen: true, project });
	}

	function handleConfirmDelete() {
		// TODO: integrar com API de delete quando disponível
		setDeleteModal({ isOpen: false, project: null });
	}

	return (
		<div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground tracking-tight">
						Todos os projetos
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{projects.length}{" "}
						{projects.length === 1 ? "projeto" : "projetos"} no total
					</p>
				</div>
				<Button
					onClick={() => setIsNewProjectModalOpen(true)}
					size="sm"
					className="gap-1.5 shrink-0"
				>
					<Plus className="w-4 h-4" />
					Novo projeto
				</Button>
			</div>

			{/* Filtros + Busca */}
			<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
				{/* Tabs de filtro */}
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
									filter === tab.id ? "text-primary" : "text-muted-foreground/60",
								)}
							>
								{tab.id === "todos"
									? projects.length
									: projects.filter((p) => p.status === tab.id).length}
							</span>
						</button>
					))}
				</div>

				{/* Busca */}
				<div className="relative flex-1 w-full sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
					<Input
						placeholder="Buscar projeto..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8 h-8 text-sm"
					/>
				</div>
			</div>

			{/* Grid de projetos */}
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<Folder className="w-10 h-10 text-muted-foreground/30 mb-3" />
					<p className="text-sm font-medium text-muted-foreground">
						Nenhum projeto encontrado
					</p>
					<p className="text-xs text-muted-foreground/60 mt-1">
						{search ? "Tente outro termo de busca" : "Crie um projeto para começar"}
					</p>
					{!search && (
						<Button
							size="sm"
							variant="outline"
							className="mt-4"
							onClick={() => setIsNewProjectModalOpen(true)}
						>
							<Plus className="w-3.5 h-3.5 mr-1.5" />
							Novo projeto
						</Button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((project) => {
						const { done, total, pct } = getProjectStats(project.id);
						const status = statusLabels[project.status];
						const remaining = Math.max(total - done, 0);
						const isMuted = project.status !== "ativo";

						return (
							<Card
								key={project.id}
								className={cn(
									"group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-200",
									isMuted
										? "border-border/70 opacity-70 hover:opacity-90"
										: "border-border hover:border-border/80 hover:shadow-sm",
								)}
								onClick={() =>
									navigate(
										ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", project.id),
									)
								}
							>
								{/* Faixa de cor no topo */}
								<div
									className="h-[3px] w-full"
									style={{
										backgroundColor: isMuted ? "rgba(148,163,184,0.9)" : project.color,
									}}
								/>

								<div className="flex flex-1 flex-col gap-4 px-5 pb-4 pt-4">
									{/* Cabeçalho: ícone + título/descrição + status */}
									<div className="flex items-start gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-lg">
											{project.emoji}
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

												<div className="flex items-start gap-1">
													{project.status !== "ativo" && (
														<span
															className={cn(
																"mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
																project.status === "concluido"
																	? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
																	: "bg-muted text-muted-foreground",
															)}
														>
															{project.status === "concluido" && (
																<CheckCircle2 className="mr-1 h-3 w-3" />
															)}
															{project.status === "arquivado" && (
																<Archive className="mr-1 h-3 w-3" />
															)}
															{status.label}
														</span>
													)}

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
																onClick={(event) => {
																	event.stopPropagation();
																}}
															>
																<MoreHorizontal className="h-4 w-4" />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-48"
															onClick={(event) => {
																event.stopPropagation();
															}}
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
																<span>Ver projeto</span>
															</DropdownMenuItem>
															<DropdownMenuItem>
																<History className="text-muted-foreground" />
																<span>Ver atividade</span>
															</DropdownMenuItem>
															<DropdownMenuSeparator />
																<DropdownMenuItem
																className="text-destructive focus:text-destructive"
																onSelect={() => openDeleteConfirm(project)}
															>
																<Trash2 className="text-muted-foreground" />
																<span>Excluir projeto</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
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
													color: isMuted ? "rgb(148,163,184)" : project.color,
												}}
											>
												{pct}%
											</span>
											<span className="text-[11px] text-muted-foreground">
												{done} de {total} tarefas
											</span>
										</div>

										<div className="h-1 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full transition-all duration-500"
												style={{
													width: `${pct}%`,
													backgroundColor: isMuted
														? "rgba(148,163,184,0.85)"
														: project.color,
												}}
											/>
										</div>

										<div className="flex items-center justify-between pt-0.5">
											<span className="text-[11px] text-muted-foreground">
												{project.status === "concluido"
													? "Finalizado"
													: project.status === "arquivado"
														? "Arquivado"
														: `${remaining} ${
																remaining === 1 ? "restante" : "restantes"
															}`}
											</span>

											{project.deadline && (
												<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
													<History className="h-3 w-3" />
													<span>
														até{" "}
														{new Date(
															`${project.deadline}T12:00:00`,
														).toLocaleDateString("pt-BR", {
															day: "2-digit",
															month: "short",
														})}
													</span>
												</span>
											)}
										</div>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}

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
