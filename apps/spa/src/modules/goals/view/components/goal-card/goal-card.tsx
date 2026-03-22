import type { Goal, GoalProgress } from "@/modules/goals/app/entities/goal";
import { formatDateShort } from "@/utils/date-utils";
import {
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Circle,
	FolderKanban,
	Pencil,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { DeadlineBadge } from "./deadline-badge";
import { ProgressBar } from "./progress-bar";

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
		<div className="bg-card border border-border rounded-2xl overflow-hidden transition-colors hover:border-foreground/15">
			{/* Faixa de cor no topo */}
			<div
				className="h-0.5 w-full"
				style={{ backgroundColor: goal.color ?? "#7C3AED" }}
			/>

			{/* Linha principal */}
			<div className="px-4 py-3 flex items-center gap-4">
				{/* Percentual grande à esquerda */}
				<div className="shrink-0 w-14 text-center">
					<div
						className="text-xl font-bold leading-none tracking-tight"
						style={{ color: goal.color ?? "#7C3AED" }}
					>
						{progress.pct}%
					</div>
					<div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.08em]">
						done
					</div>
				</div>

				{/* Conteúdo principal */}
				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<div className="flex items-center gap-1.5 min-w-0">
								<span className="text-base leading-none">{goal.emoji}</span>
								<h3 className="text-sm font-semibold text-foreground truncate">
									{goal.name}
								</h3>
							</div>
							{goal.description && (
								<p className="text-xs text-muted-foreground mt-0.5">
									{goal.description}
								</p>
							)}
						</div>

						{/* Ações */}
						<div className="flex items-center gap-1 shrink-0">
							{showEditButton && onEditValue && (
								<button
									onClick={onEditValue}
									className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									title="Atualizar progresso manualmente"
									type="button"
								>
									<Pencil className="w-3.5 h-3.5" />
								</button>
							)}
							{onDelete && (
								<button
									onClick={onDelete}
									className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
									title="Excluir meta"
									type="button"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							)}
						</div>
					</div>

					{/* Barra de progresso reta */}
					<ProgressBar
						value={progress.current}
						max={progress.total}
						color={goal.color ?? "#7C3AED"}
					/>

					{/* Metadados */}
					<div className="flex items-center flex-wrap gap-2 mt-1">
						<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-foreground/80">
							{progress.label}
						</span>

						{progressSource === "tasks" ? (
							<span
								className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium"
								style={{
									backgroundColor: `${goal.color ?? "#7C3AED"}12`,
									color: goal.color ?? "#7C3AED",
								}}
							>
								<FolderKanban className="w-3 h-3" />
								Auto · tarefas do projeto
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
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
						className="shrink-0 p-1.5 rounded-md border border-border bg-muted/60 text-muted-foreground hover:bg-muted transition-colors self-center"
						type="button"
					>
						{isExpanded ? (
							<ChevronDown className="w-3.5 h-3.5" />
						) : (
							<ChevronRight className="w-3.5 h-3.5" />
						)}
					</button>
				)}
			</div>

			{/* Painel expandido: tasks do projeto */}
			{isExpanded && hasProjectTasks && (
				<div className="border-t border-border bg-card px-4 py-3 space-y-3">
					<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em] flex items-center gap-1.5">
						<TrendingUp className="w-3.5 h-3.5" />
						Tarefas vinculadas à meta
					</p>

					{done.length > 0 && (
						<div className="space-y-1.5">
							<p className="text-[11px] text-muted-foreground font-medium">
								Concluídas · {done.length}
							</p>
							{done.map((t) => (
								<div
									key={t.id}
									className="flex items-center gap-2 text-xs text-muted-foreground py-1"
								>
									<CheckCircle2
										className="w-3.5 h-3.5 shrink-0"
										style={{ color: goal.color ?? "#7C3AED" }}
									/>
									<span className="line-through truncate">{t.title}</span>
								</div>
							))}
						</div>
					)}

					{pending.length > 0 && (
						<div className="space-y-1.5">
							<p className="text-[11px] text-muted-foreground font-medium">
								Pendentes · {pending.length}
							</p>
							{pending.map((t) => (
								<div
									key={t.id}
									className="flex items-center gap-2 text-xs text-foreground py-1"
								>
									<Circle className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
									<span className="truncate">{t.title}</span>
									{t.dueDate && (
										<span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
											{formatDateShort(new Date(`${t.dueDate}T12:00:00`))}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
