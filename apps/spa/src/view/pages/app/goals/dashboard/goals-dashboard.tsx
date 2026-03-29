import type { Goal, GoalProgress } from "@/modules/goals/app/entities/goal";
import { GoalCard } from "@/modules/goals/view/components/goal-card";
import { EditValueModal } from "@/modules/goals/view/modals/edit-value-modal";
import { NewGoalModal } from "@/modules/goals/view/modals/new-goal-modal";
import { createLogger } from "@/utils/logger";
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

const logger = createLogger({ module: "goals", component: "GoalsDashboard" });

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
		logger.info("Update goal value:", goalId, value);
		setEditingGoalId(null);
	};

	const handleDeleteGoal = (goalId: string) => {
		// TODO: Integrar com API - por enquanto apenas log
		logger.info("Delete goal:", goalId);
	};

	const editingGoal = editingGoalId
		? projects.find((p) => p.id === editingGoalId)
		: null;

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
				<div className="max-w-4xl mx-auto space-y-4">
					<div className="flex items-end justify-between gap-4">
						<div>
							<h2 className="text-[22px] font-semibold tracking-tight text-foreground">
								Goals
							</h2>
							<p className="text-xs text-muted-foreground mt-1 max-w-xl">
								Progress is calculated automatically from linked project tasks,
								or updated manually.
							</p>
						</div>
						<Button
							size="sm"
							className="gap-1.5 rounded-md"
							onClick={toggleNewGoalModal}
						>
							<Plus className="w-3.5 h-3.5" />
							New goal
						</Button>
					</div>

					{/* Filter pills */}
					<div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-1.5 py-1">
						{(["todas", "em-andamento", "concluida", "pausada"] as const).map(
							(f) => (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={cn(
										"inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
										filter === f
											? "bg-muted text-foreground shadow-sm"
											: "text-muted-foreground hover:bg-muted/70",
									)}
									type="button"
								>
									<span>
										{f === "todas"
											? "All"
											: f === "em-andamento"
												? "In progress"
												: f === "concluida"
													? "Completed"
													: "Paused"}
									</span>
									<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground">
										{counts[f]}
									</span>
								</button>
							),
						)}
					</div>
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
						const projectTasks = tasks.filter(
							(t) => t.projectId === project.id,
						);
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
									setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)
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
