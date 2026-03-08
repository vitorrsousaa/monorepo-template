import type { Goal, GoalProgress } from "@/modules/goals/app/entities/goal";
import { GoalCard } from "@/modules/goals/view/components/goal-card";
import { EditValueModal } from "@/modules/goals/view/modals/edit-value-modal";
import { NewGoalModal } from "@/modules/goals/view/modals/new-goal-modal";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { Plus, Target } from "lucide-react";
import { useReducer, useState } from "react";
import {
	GOALS_PROJECTS_MOCK,
	GOALS_TASKS_MOCK,
	type GoalsProject,
	type GoalsTask,
} from "./goals-dashboard.mocks";

type FilterType = "todas" | "em-andamento" | "concluida" | "pausada";

const STATUS_TO_FILTER: Record<string, FilterType> = {
	ativo: "em-andamento",
	concluido: "concluida",
	arquivado: "pausada",
};

function mapProjectToGoal(project: GoalsProject): Goal {
	return {
		id: project.id,
		name: project.name,
		description: project.description,
		emoji: project.emoji,
		color: project.color,
		status: project.status,
		targetValue: project.targetValue,
		currentValue: project.currentValue,
		unit: project.unit,
		deadline: project.deadline,
	};
}

function getGoalProgress(
	project: GoalsProject,
	tasks: GoalsTask[],
): GoalProgress {
	const projectTasks = tasks.filter((t) => t.projectId === project.id);

	if (project.targetValue != null) {
		const current = project.currentValue ?? 0;
		const total = project.targetValue;
		return {
			current,
			total,
			pct: total > 0 ? Math.round((current / total) * 100) : 0,
			label: `${current} / ${total}${project.unit ? ` ${project.unit}` : ""}`,
		};
	}

	const done = projectTasks.filter((t) => t.status === "concluida").length;
	const total = projectTasks.length;
	return {
		current: done,
		total,
		pct: total > 0 ? Math.round((done / total) * 100) : 0,
		label: `${done} / ${total} tarefas`,
	};
}

export function GoalsDashboard() {
	const [isNewGoalModalOpen, toggleNewGoalModal] = useReducer(
		(state) => !state,
		false,
	);
	const [filter, setFilter] = useState<FilterType>("todas");
	const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
	const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

	// Mock data - substituir por hooks da API quando integrar
	const [projects] = useState(GOALS_PROJECTS_MOCK);
	const [tasks] = useState(GOALS_TASKS_MOCK);

	const filtered = projects.filter(
		(p) => filter === "todas" || STATUS_TO_FILTER[p.status] === filter,
	);

	const counts = {
		todas: projects.length,
		"em-andamento": projects.filter((p) => p.status === "ativo").length,
		concluida: projects.filter((p) => p.status === "concluido").length,
		pausada: projects.filter((p) => p.status === "arquivado").length,
	};

	const handleUpdateGoalValue = (goalId: string, value: number) => {
		// TODO: Integrar com API - por enquanto atualiza local apenas para demo
		console.log("[v0] Update goal value:", goalId, value);
		setEditingGoalId(null);
	};

	const handleDeleteGoal = (goalId: string) => {
		// TODO: Integrar com API - por enquanto apenas log
		console.log("[v0] Delete goal:", goalId);
	};

	const editingGoal = editingGoalId
		? projects.find((p) => p.id === editingGoalId)
		: null;

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
				<div className="flex items-center justify-between max-w-4xl mx-auto">
					<div>
						<h2 className="text-xl font-bold text-foreground">Metas</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							Progresso calculado automaticamente pelas tarefas do projeto ou
							atualizado manualmente
						</p>
					</div>
					<Button size="sm" className="gap-1.5" onClick={toggleNewGoalModal}>
						<Plus className="w-3.5 h-3.5" />
						Nova meta
					</Button>
				</div>

				{/* Filtros */}
				<div className="flex gap-1 mt-4 max-w-4xl mx-auto">
					{(["todas", "em-andamento", "concluida", "pausada"] as const).map(
						(f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={cn(
									"px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
									filter === f
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted",
								)}
								type="button"
							>
								{f === "todas"
									? "Todas"
									: f === "em-andamento"
										? "Em andamento"
										: f === "concluida"
											? "Concluídas"
											: "Pausadas"}{" "}
								<span className="opacity-60">({counts[f]})</span>
							</button>
						),
					)}
				</div>
			</div>

			{/* Lista */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="max-w-4xl mx-auto space-y-3">
					{filtered.length === 0 && (
						<div className="text-center py-16 text-muted-foreground">
							<Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
							<p className="text-sm">Nenhuma meta aqui.</p>
							<Button
								variant="link"
								className="text-primary text-sm mt-1 h-auto p-0"
								onClick={toggleNewGoalModal}
							>
								Criar primeira meta
							</Button>
						</div>
					)}

					{filtered.map((project) => {
						const goal = mapProjectToGoal(project);
						const progress = getGoalProgress(project, tasks);
						const projectTasks = tasks.filter((t) => t.projectId === project.id);
						const doneTasks = projectTasks.filter(
							(t) => t.status === "concluida",
						);
						const pendingTasks = projectTasks.filter(
							(t) => t.status === "pendente",
						);

						const progressSource =
							project.targetValue != null ? "manual" : "tasks";

						return (
							<GoalCard
								key={goal.id}
								goal={goal}
								progress={progress}
								progressSource={progressSource}
								projectTasks={{
									done: doneTasks.map((t) => ({
										id: t.id,
										title: t.title,
										dueDate: t.dueDate,
										status: t.status,
									})),
									pending: pendingTasks.map((t) => ({
										id: t.id,
										title: t.title,
										dueDate: t.dueDate,
										status: t.status,
									})),
								}}
								isExpanded={expandedGoalId === goal.id}
								onToggleExpand={() =>
									setExpandedGoalId(
										expandedGoalId === goal.id ? null : goal.id,
									)
								}
								onEditValue={
									goal.targetValue != null
										? () => setEditingGoalId(goal.id)
										: undefined
								}
								onDelete={() => handleDeleteGoal(goal.id)}
							/>
						);
					})}
				</div>
			</div>

			<NewGoalModal isOpen={isNewGoalModalOpen} onClose={toggleNewGoalModal} />

			{editingGoal && editingGoal.targetValue != null && (
				<EditValueModal
					goalId={editingGoal.id}
					currentValue={editingGoal.currentValue ?? 0}
					targetValue={editingGoal.targetValue}
					unit={editingGoal.unit}
					onSave={handleUpdateGoalValue}
					onClose={() => setEditingGoalId(null)}
				/>
			)}
		</div>
	);
}
