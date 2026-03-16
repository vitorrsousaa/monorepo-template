import { ROUTES } from "@/config/routes";
import { useAuth } from "@/hooks/auth";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { cn } from "@repo/ui/utils";
import {
	AlertCircle,
	ArrowRight,
	Calendar,
	CheckCircle2,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS_MOCK, TASKS_MOCK } from "./dashboard.mocks";
import { TaskCard } from "./task-card";

/** Category for task stripe: maps project id to semantic color. */
function getProjectCategory(
	projectId: string,
): "work" | "home" | "study" | "health" {
	switch (projectId) {
		case "1":
			return "work";
		case "2":
			return "home";
		case "3":
			return "study";
		case "4":
			return "health";
		default:
			return "work";
	}
}

function ProgressBar({
	value,
	max,
	color = "bg-primary",
}: { value: number; max: number; color?: string }) {
	const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
	return (
		<div className="h-1 bg-muted rounded-full overflow-hidden flex-1 min-w-0">
			<div
				className={cn("h-full rounded-full transition-all duration-500", color)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
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

	const completed = tasks.filter((t) => t.status === "concluida").length;
	const overdueTasks = tasks.filter(
		(t) => t.dueDate < today && t.status === "pendente",
	).length;
	const todayTasks = tasks.filter((t) => t.dueDate === today);
	const todayDone = todayTasks.filter((t) => t.status === "concluida").length;
	const efficiency =
		tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

	const stats = [
		{
			key: "ok",
			label: "Concluídas",
			value: completed,
			icon: CheckCircle2,
			iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			trend: "+1 hoje",
			trendVariant: "up" as const,
			sublabel: "Hoje",
			stripeClass: "bg-emerald-500",
		},
		{
			key: "warn",
			label: "Atrasada",
			value: overdueTasks,
			icon: AlertCircle,
			iconBg: "bg-amber-100 dark:bg-amber-900/30",
			iconColor: "text-amber-600 dark:text-amber-400",
			trend: overdueTasks === 0 ? "em dia" : "requer atenção",
			trendVariant: overdueTasks > 0 ? "down" : "flat",
			sublabel: "Ver agora →",
			stripeClass: "bg-amber-500",
			tintedBg: true,
		},
		{
			key: "info",
			label: "Para hoje",
			value: todayTasks.length,
			icon: Calendar,
			iconBg: "bg-blue-100 dark:bg-blue-900/30",
			iconColor: "text-blue-600 dark:text-blue-400",
			trend: `${todayDone} de ${todayTasks.length} feitas`,
			trendVariant: "flat" as const,
			sublabel: `${Math.max(0, todayTasks.length - todayDone)} pendentes`,
			stripeClass: "bg-blue-500",
		},
		{
			key: "meta",
			label: "Eficiência",
			value: `${efficiency}%`,
			icon: TrendingUp,
			iconBg: "bg-violet-100 dark:bg-violet-900/30",
			iconColor: "text-violet-600 dark:text-violet-400",
			trend: "geral",
			trendVariant: "flat" as const,
			sublabel: "Meta: 70%",
			stripeClass: "bg-violet-500",
			showArc: true,
		},
	];

	const recentProjects = projects.slice(0, 4);

	const weekStats = [
		{ label: "Tarefas concluídas", value: completed + 3 },
		{ label: "Horas focadas", value: "12h 40m" },
		{
			label: "Metas em andamento",
			value: projects.filter((p) => p.isGoal && p.status === "ativo").length,
		},
	];

	const pendingToday = todayTasks.filter((t) => t.status === "pendente").length;
	const hasOverdue = overdueTasks > 0;

	const { user } = useAuth();

	const firstName = user?.name.split(" ")[0];

	return (
		<div className="p-8 space-y-6 max-w-6xl">
			{/* Greeting */}
			<div>
				<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
					{new Date().toLocaleDateString("pt-BR", {
						weekday: "long",
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
				</p>
				<h2 className="text-[26px] font-semibold text-foreground tracking-tight leading-tight">
					Bom dia, {firstName} 👋
				</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Você tem{" "}
					<strong className="text-foreground font-semibold">
						{pendingToday} tarefas
					</strong>{" "}
					para concluir hoje
					{hasOverdue ? " — 1 requer atenção." : "."}
				</p>
			</div>

			{/* Stat strip — horizontal cards with left accent stripe */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				{stats.map(
					({
						key,
						label,
						value,
						icon: Icon,
						iconBg,
						iconColor,
						trend,
						trendVariant,
						sublabel,
						stripeClass,
						tintedBg,
						showArc,
					}) => (
						<div
							key={key}
							className={cn(
								"relative rounded-[14px] p-5 overflow-hidden bg-card border border-border shadow-sm",
								tintedBg &&
									"bg-[#FFFAF4] dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30",
							)}
						>
							{/* Left accent stripe */}
							<div
								className={cn(
									"absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]",
									stripeClass,
								)}
							/>
							<div className="flex items-center justify-between mb-3">
								<div
									className={cn(
										"flex items-center justify-center w-[30px] h-[30px] rounded-md",
										iconBg,
									)}
								>
									{key === "ok" ? (
										<span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
											✓
										</span>
									) : (
										<Icon className={cn("w-4 h-4", iconColor)} />
									)}
								</div>
								<span
									className={cn(
										"text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
										trendVariant === "up" &&
											"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
										trendVariant === "down" &&
											"bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
										trendVariant === "flat" && "bg-muted text-muted-foreground",
									)}
								>
									{trend}
								</span>
							</div>
							<div
								className={cn(
									"text-[28px] font-bold tracking-tight leading-none mb-1",
									key === "ok" && "text-emerald-700 dark:text-emerald-400",
									key === "warn" && "text-amber-700 dark:text-amber-400",
									key === "info" && "text-blue-600 dark:text-blue-400",
									key === "meta" && "text-violet-600 dark:text-violet-400",
								)}
							>
								{value}
							</div>
							<div className="text-xs font-medium text-muted-foreground">
								{label}
							</div>
							<div className="text-[11px] text-muted-foreground/80">
								{sublabel}
							</div>
							{showArc && (
								<div className="absolute right-4 bottom-4 opacity-15 pointer-events-none">
									<svg
										width="60"
										height="60"
										viewBox="0 0 60 60"
										className="text-violet-500"
									>
										<circle
											cx="30"
											cy="30"
											r="24"
											fill="none"
											stroke="currentColor"
											strokeWidth="8"
											strokeDasharray="45 105"
											strokeLinecap="round"
											transform="rotate(-90 30 30)"
										/>
									</svg>
								</div>
							)}
						</div>
					),
				)}
			</div>

			{/* Content grid: Tarefas de Hoje (left) + Projetos (right) */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
				{/* Tarefas de Hoje — panel */}
				<div className="bg-card border border-border rounded-[14px] shadow-sm overflow-hidden">
					<div className="flex items-center justify-between px-5 py-4 border-b border-border/70">
						<h3 className="text-[13px] font-semibold text-foreground">
							Tarefas de Hoje
						</h3>
						<button
							type="button"
							onClick={() => setView("hoje")}
							className="text-xs font-medium text-primary hover:text-primary/90 flex items-center gap-0.5 no-underline"
						>
							Ver todas
							<ArrowRight className="w-3 h-3" />
						</button>
					</div>
					{todayTasks.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<CheckCircle2 className="w-10 h-10 text-muted-foreground/40 mb-3" />
							<p className="font-medium text-muted-foreground">
								Nada para hoje!
							</p>
							<p className="text-sm text-muted-foreground/60 mt-1">
								Aproveite o dia ou crie uma nova tarefa
							</p>
							<button
								onClick={() => setIsNewTaskOpen(true)}
								className="mt-4 text-sm text-primary font-medium hover:underline"
							>
								Criar tarefa
							</button>
						</div>
					) : (
						<div className="divide-y divide-border/70">
							{todayTasks.map((t) => {
								const project = projects.find((pr) => pr.id === t.projectId);
								const isOverdue = t.dueDate < today && t.status === "pendente";
								const category = getProjectCategory(t.projectId);
								return (
									<TaskCard
										key={t.id}
										task={t}
										project={project}
										category={category}
										isOverdue={isOverdue}
									/>
								);
							})}
						</div>
					)}
				</div>

				{/* Projetos — panel */}
				<div className="bg-card border border-border rounded-[14px] shadow-sm overflow-hidden">
					<div className="flex items-center justify-between px-5 py-4 border-b border-border/70">
						<h3 className="text-[13px] font-semibold text-foreground">
							Projetos
						</h3>
						<button
							type="button"
							onClick={() => navigate(ROUTES.PROJECTS.LIST)}
							className="text-xs font-medium text-primary hover:text-primary/90 flex items-center gap-0.5 no-underline"
						>
							Ver todos
							<ArrowRight className="w-3 h-3" />
						</button>
					</div>
					<div className="divide-y divide-border/70">
						{recentProjects.map((p) => {
							const projectTasks = tasks.filter((t) => t.projectId === p.id);
							const doneTasks = projectTasks.filter(
								(t) => t.status === "concluida",
							).length;
							const pct =
								projectTasks.length > 0
									? Math.round((doneTasks / projectTasks.length) * 100)
									: 0;
							const progressColor =
								p.id === "1"
									? "bg-violet-600"
									: p.id === "2"
										? "bg-emerald-600"
										: p.id === "3"
											? "bg-blue-600"
											: "bg-amber-600";
							return (
								<button
									key={p.id}
									type="button"
									onClick={() => setView({ type: "projeto", id: p.id })}
									className="w-full text-left px-5 py-4 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start gap-3 mb-3">
										<div
											className={cn(
												"w-[30px] h-[30px] rounded-md flex items-center justify-center text-[15px] shrink-0",
												p.id === "1" && "bg-violet-100 dark:bg-violet-900/30",
												p.id === "2" && "bg-emerald-100 dark:bg-emerald-900/30",
												p.id === "3" && "bg-blue-100 dark:bg-blue-900/30",
												p.id === "4" && "bg-amber-100 dark:bg-amber-900/30",
											)}
										>
											{p.emoji}
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-[13px] font-semibold text-foreground">
												{p.name}
											</div>
											{p.description && (
												<div className="text-[11px] text-muted-foreground truncate">
													{p.description}
												</div>
											)}
										</div>
										<span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shrink-0">
											{p.status === "ativo"
												? "Ativo"
												: p.status === "concluido"
													? "Concluído"
													: "Arquivado"}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<ProgressBar
											value={doneTasks}
											max={Math.max(projectTasks.length, 1)}
											color={progressColor}
										/>
										<span
											className={cn(
												"text-[11px] font-semibold min-w-[30px] text-right",
												pct > 0 ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{pct}%
										</span>
									</div>
									<div className="text-[11px] text-muted-foreground mt-1.5">
										{projectTasks.length > 0
											? `${doneTasks} / ${projectTasks.length} tarefas`
											: "0 / 0 tarefas"}
									</div>
									{p.isGoal && p.targetValue != null && (
										<div className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded mt-2">
											<Calendar className="w-2.5 h-2.5" />
											Meta: {p.currentValue ?? 0} / {p.targetValue} {p.unit}
										</div>
									)}
								</button>
							);
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

			<NewTaskModal
				isOpen={isNewTaskOpen}
				onClose={() => setIsNewTaskOpen(false)}
			/>
		</div>
	);
}
