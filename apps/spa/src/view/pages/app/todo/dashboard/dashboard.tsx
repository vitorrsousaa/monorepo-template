import { ROUTES } from "@/config/routes";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS_MOCK, TASKS_MOCK } from "./dashboard.mocks";
import { TaskCard } from "./task-card";

function ProgressBar({ value, max, color = "bg-primary" }: { value: number; max: number; color?: string }) {
	const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
	return (
		<div className="h-1.5 bg-muted rounded-full overflow-hidden">
			<div
				className={cn("h-full rounded-full transition-all duration-500", color)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	)
}

export function Dashboard() {
	const navigate = useNavigate();
	const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

	// Mock data - substituir por hooks da API quando integrar
	const [tasks] = useState(TASKS_MOCK);
	const [projects] = useState(PROJECTS_MOCK);

	const today = new Date().toISOString().split("T")[0];

	const setView = (view: "hoje" | { type: "projeto"; id: string }) => {
		if (view === "hoje") {
			navigate(ROUTES.TODO.TODAY);
		} else if (view.type === "projeto") {
			navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", view.id));
		}
	};

	const completed = tasks.filter((t) => t.status === "concluida").length
	const overdueTasks = tasks.filter((t) => t.dueDate < today && t.status === "pendente").length
	const todayTasks = tasks.filter((t) => t.dueDate === today)
	const todayDone = todayTasks.filter((t) => t.status === "concluida").length
	const efficiency = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

	const stats = [
		{
			label: "Concluídas",
			value: completed,
			icon: CheckCircle2,
			iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			trend: "Hoje",
		},
		{
			label: "Atrasadas",
			value: overdueTasks,
			icon: AlertCircle,
			iconBg: "bg-amber-100 dark:bg-amber-900/30",
			iconColor: "text-amber-600 dark:text-amber-400",
			trend: overdueTasks === 0 ? "em dia" : "requer atenção",
		},
		{
			label: "Para hoje",
			value: todayTasks.length,
			icon: Calendar,
			iconBg: "bg-orange-100 dark:bg-orange-900/30",
			iconColor: "text-orange-600 dark:text-orange-400",
			trend: `${todayDone} concluídas`,
		},
		{
			label: "Eficiência",
			value: `${efficiency}%`,
			icon: TrendingUp,
			iconBg: "bg-violet-100 dark:bg-violet-900/30",
			iconColor: "text-violet-600 dark:text-violet-400",
			trend: "geral",
		},
	]

	const recentProjects = projects.slice(0, 4)

	const weekStats = [
		{ label: "Tarefas concluídas", value: completed + 3 },
		{ label: "Horas focadas", value: "12h 40m" },
		{ label: "Metas em andamento", value: projects.filter((p) => p.isGoal && p.status === "ativo").length },
	]

	return (
		<div className="p-6 space-y-6 max-w-6xl mx-auto">
			{/* Greeting */}
			<div>
				<h2 className="text-2xl font-bold text-foreground text-balance">Bom dia, Marcos</h2>
				<p className="text-muted-foreground mt-1">
					Você tem <span className="font-semibold text-foreground">{todayTasks.filter(t => t.status === "pendente").length} tarefas</span> para concluir hoje.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map(({ label, value, icon: Icon, iconBg, iconColor, trend }) => (
					<div key={label} className="bg-card border border-border rounded-xl p-4 space-y-3">
						<div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconBg)}>
							<Icon className={cn("w-5 h-5", iconColor)} />
						</div>
						<div>
							<div className="text-2xl font-bold text-foreground">{value}</div>
							<div className="text-sm text-muted-foreground">{label}</div>
						</div>
						<div className="text-xs text-muted-foreground/70">{trend}</div>
					</div>
				))}
			</div>

			{/* Main grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Tarefas de hoje */}
				<div className="lg:col-span-2 space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-foreground">Tarefas de Hoje</h3>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setView("hoje")}
							className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium no-underline"
						>
							All tasks <ArrowRight className="w-3 h-3" />
						</Button>
					</div>

					{todayTasks.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-xl text-center">
							<CheckCircle2 className="w-10 h-10 text-muted-foreground/40 mb-3" />
							<p className="font-medium text-muted-foreground">Nada para hoje!</p>
							<p className="text-sm text-muted-foreground/60 mt-1">Aproveite o dia ou crie uma nova tarefa</p>
							<button
								onClick={() => setIsNewTaskOpen(true)}
								className="mt-4 text-sm text-primary font-medium hover:underline"
							>
								Criar tarefa
							</button>
						</div>
					) : (
						<div className="space-y-2">
							{todayTasks.map((t) => (
								<TaskCard key={t.id} task={t} />
							))}
						</div>
					)}
				</div>

				{/* Projetos recentes */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-foreground">Projetos</h3>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => navigate(ROUTES.PROJECTS.LIST)}
							className="text-xs text-primary hover:text-primary/80 font-medium transition-colors no-underline"
						>
							All projects <ArrowRight className="w-3 h-3" />
						</Button>
					</div>

					<div className="space-y-3">
						{recentProjects.map((p) => {
							const projectTasks = tasks.filter((t) => t.projectId === p.id)
							const doneTasks = projectTasks.filter((t) => t.status === "concluida").length
							const pct = projectTasks.length > 0 ? Math.round((doneTasks / projectTasks.length) * 100) : 0

							const statusLabels: Record<string, string> = {
								ativo: "Ativo",
								concluido: "Concluído",
								arquivado: "Arquivado",
							}
							const statusColors: Record<string, string> = {
								ativo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
								concluido: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
								arquivado: "bg-muted text-muted-foreground",
							}

							return (
								<button
									key={p.id}
									onClick={() => setView({ type: "projeto", id: p.id })}
									className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors space-y-3"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											<span className="text-xl">{p.emoji}</span>
											<div>
												<p className="text-sm font-medium text-foreground leading-none">{p.name}</p>
												{p.description && (
													<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
												)}
											</div>
										</div>
										<span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0", statusColors[p.status])}>
											{statusLabels[p.status]}
										</span>
									</div>
									<div className="space-y-1">
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>
												{projectTasks.length > 0
													? `${doneTasks}/${projectTasks.length} tarefas`
													: "Sem tarefas"}
											</span>
											<span>{pct}%</span>
										</div>
										<ProgressBar value={doneTasks} max={Math.max(projectTasks.length, 1)} />
									</div>
									{p.isGoal && p.targetValue && (
										<div className="text-xs text-muted-foreground">
											Meta: {p.currentValue ?? 0} / {p.targetValue} {p.unit}
										</div>
									)}
								</button>
							)
						})}
					</div>
				</div>
			</div>

			{/* Resumo da semana */}
			<div className="bg-card border border-border rounded-xl p-5">
				<h3 className="font-semibold text-foreground mb-4">Resumo da semana</h3>
				<div className="grid grid-cols-3 gap-4">
					{weekStats.map(({ label, value }) => (
						<div key={label} className="text-center">
							<div className="text-2xl font-bold text-foreground">{value}</div>
							<div className="text-xs text-muted-foreground mt-1">{label}</div>
						</div>
					))}
				</div>
			</div>

			<NewTodoModal
				isOpen={isNewTaskOpen}
				onClose={() => setIsNewTaskOpen(false)}
			/>
		</div>
	);
}
