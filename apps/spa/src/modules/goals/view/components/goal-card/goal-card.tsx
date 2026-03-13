import type { Goal, GoalProgress } from "@/modules/goals/app/entities/goal";
import {
	ChevronDown,
	ChevronRight,
	Circle,
	CheckCircle2,
	FolderKanban,
	Pencil,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { formatDateShort } from "@/utils/date-utils";
import { DeadlineBadge } from "./deadline-badge";
import { ProgressBar } from "./progress-bar";
import { ProgressRing } from "./progress-ring";

type GoalTask = {
	id: string;
	title: string;
	dueDate?: string;
	status: "concluida" | "pendente";
};

type GoalCardProps = {
	goal: Goal;
	progress: GoalProgress;
	/** Tarefas do projeto vinculado (quando progresso é por tasks) */
	projectTasks?: {
		done: GoalTask[];
		pending: GoalTask[];
	};
	/** true quando progresso vem de tasks, false quando vem de currentValue/targetValue */
	progressSource?: "tasks" | "manual";
	isExpanded?: boolean;
	onToggleExpand?: () => void;
	onEditValue?: () => void;
	onDelete?: () => void;
};

export function GoalCard({
	goal,
	progress,
	projectTasks = { done: [], pending: [] },
	progressSource = "manual",
	isExpanded = false,
	onToggleExpand,
	onEditValue,
	onDelete,
}: GoalCardProps) {
	const { done, pending } = projectTasks;
	const hasProjectTasks = done.length > 0 || pending.length > 0;
	const showEditButton = goal.targetValue != null;

	return (
		<div className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
			<div className="p-4 flex items-start gap-4">
				{/* Ring de progresso */}
				<div className="relative shrink-0">
					<ProgressRing
						value={progress.current}
						max={progress.total}
						size={60}
						color={goal.color ?? "#7C3AED"}
					/>
					<span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
						{progress.pct}%
					</span>
				</div>

				{/* Conteúdo */}
				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<h3 className="text-sm font-semibold text-foreground truncate">
								{goal.emoji} {goal.name}
							</h3>
							{goal.description && (
								<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
									{goal.description}
								</p>
							)}
						</div>
						<div className="flex items-center gap-1 shrink-0">
							{showEditButton && onEditValue && (
								<button
									onClick={onEditValue}
									className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									title="Atualizar progresso manualmente"
									type="button"
								>
									<Pencil className="w-3.5 h-3.5" />
								</button>
							)}
							{onDelete && (
								<button
									onClick={onDelete}
									className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
									title="Excluir meta"
									type="button"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							)}
						</div>
					</div>

					<ProgressBar
						value={progress.current}
						max={progress.total}
						color={goal.color ?? "#7C3AED"}
					/>

					<div className="flex items-center flex-wrap gap-2">
						<span className="text-xs text-muted-foreground">
							{progress.label}
						</span>

						{progressSource === "tasks" ? (
							<span
								className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border"
								style={{
									backgroundColor: (goal.color ?? "#7C3AED") + "18",
									borderColor: (goal.color ?? "#7C3AED") + "40",
									color: goal.color ?? "#7C3AED",
								}}
							>
								<FolderKanban className="w-3 h-3" />
								Progresso por tarefas
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
								Progresso manual
							</span>
						)}

						<DeadlineBadge deadline={goal.deadline} />
					</div>
				</div>

				{/* Toggle expandir tasks */}
				{hasProjectTasks && onToggleExpand && (
					<button
						onClick={onToggleExpand}
						className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors self-center"
						type="button"
					>
						{isExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>
				)}
			</div>

			{/* Painel expandido: tasks do projeto */}
			{isExpanded && hasProjectTasks && (
				<div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
					<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
						<TrendingUp className="w-3.5 h-3.5" />
						Tarefas do projeto vinculado
					</p>

					{done.length > 0 && (
						<div className="space-y-1.5">
							<p className="text-xs text-muted-foreground font-medium">
								Concluídas ({done.length})
							</p>
							{done.slice(0, 4).map((t) => (
								<div
									key={t.id}
									className="flex items-center gap-2 text-xs text-muted-foreground"
								>
									<CheckCircle2
										className="w-3.5 h-3.5 shrink-0"
										style={{ color: goal.color ?? "#7C3AED" }}
									/>
									<span className="line-through truncate">{t.title}</span>
								</div>
							))}
							{done.length > 4 && (
								<p className="text-xs text-muted-foreground pl-5">
									+ {done.length - 4} concluídas
								</p>
							)}
						</div>
					)}

					{pending.length > 0 && (
						<div className="space-y-1.5">
							<p className="text-xs text-muted-foreground font-medium">
								Pendentes ({pending.length})
							</p>
							{pending.slice(0, 4).map((t) => (
								<div
									key={t.id}
									className="flex items-center gap-2 text-xs text-foreground"
								>
									<Circle className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
									<span className="truncate">{t.title}</span>
									{t.dueDate && (
										<span className="ml-auto shrink-0 text-muted-foreground">
											{formatDateShort(
												new Date(t.dueDate + "T12:00:00"),
											)}
										</span>
									)}
								</div>
							))}
							{pending.length > 4 && (
								<p className="text-xs text-muted-foreground pl-5">
									+ {pending.length - 4} pendentes
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
