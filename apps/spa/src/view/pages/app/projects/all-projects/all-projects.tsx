import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetProjectsSummary } from "@/modules/projects/app/hooks/use-get-projects-summary";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import type { WithOptimisticState } from "@/utils/types";
import type { ProjectSummary } from "@repo/contracts/projects/summary";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import { Plus, Search } from "lucide-react";
import { AllProjectsEmptyState } from "./components/all-projects-empty-state";
import { AllProjectsErrorState } from "./components/all-projects-error-state";
import { AllProjectsList } from "./components/all-projects-list";
import { AllProjectsSkeleton } from "./components/all-projects-skeleton";

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
	const { t } = useTranslation();
	const {
		projectSummaries,
		isFetchingProjectsSummary,
		isErrorProjectsSummary,
		refetchProjectsSummary,
	} = useGetProjectsSummary();

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterTab>("todos");
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

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
				render={<AllProjectsErrorState onRetry={refetchProjectsSummary} />}
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
				render={<AllProjectsList projects={filtered} />}
			/>

			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={() => setIsNewProjectModalOpen(false)}
			/>
		</div>
	);
}
