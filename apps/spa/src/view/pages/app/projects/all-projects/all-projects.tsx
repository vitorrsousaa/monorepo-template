import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/utils";
import {
	Archive,
	ArrowRight,
	CheckCircle2,
	Folder,
	MoreHorizontal,
	Plus,
	Search,
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((project) => {
						const { done, total, pct } = getProjectStats(project.id);
						const status = statusLabels[project.status];

						return (
							<div
								key={project.id}
								className="group bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
							>
								{/* Topo do card */}
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-3 min-w-0">
										<div
											className="flex items-center justify-center w-10 h-10 rounded-lg text-xl shrink-0"
											style={{
												backgroundColor: `${project.color}20`,
											}}
										>
											{project.emoji}
										</div>
										<div className="min-w-0">
											<p className="font-semibold text-sm text-foreground truncate">
												{project.name}
											</p>
											{project.description && (
												<p className="text-xs text-muted-foreground truncate mt-0.5">
													{project.description}
												</p>
											)}
										</div>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												type="button"
												className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
											>
												<MoreHorizontal className="w-4 h-4" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-44">
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
												<ArrowRight className="w-4 h-4 mr-2" />
												Abrir projeto
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive focus:text-destructive"
												onSelect={() => openDeleteConfirm(project)}
											>
												Excluir projeto
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								{/* Badge de status */}
								<div className="flex items-center justify-between">
									<span
										className={cn(
											"inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
											status.color,
										)}
									>
										{project.status === "ativo" && (
											<CheckCircle2 className="w-3 h-3 mr-1" />
										)}
										{project.status === "arquivado" && (
											<Archive className="w-3 h-3 mr-1" />
										)}
										{status.label}
									</span>
									<span className="text-xs text-muted-foreground">
										{done}/{total} tarefas
									</span>
								</div>

								{/* Barra de progresso */}
								<div className="space-y-1.5">
									<div className="h-1.5 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-500"
											style={{
												width: `${pct}%`,
												backgroundColor: project.color,
											}}
										/>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											{pct}% concluído
										</span>
										{project.deadline && (
											<span className="text-xs text-muted-foreground">
												até{" "}
												{new Date(
													`${project.deadline}T12:00:00`,
												).toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "short",
												})}
											</span>
										)}
									</div>
								</div>

								{/* Botão abrir */}
								<button
									type="button"
									onClick={() =>
										navigate(
											ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", project.id),
										)
									}
									className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-150"
								>
									Abrir projeto
									<ArrowRight className="w-3.5 h-3.5" />
								</button>
							</div>
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
