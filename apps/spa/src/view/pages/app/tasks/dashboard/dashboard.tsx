import { useAuth } from "@/hooks/auth";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { cn } from "@repo/ui/utils";
import { AlertCircle, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTasksPanel } from "./components/dashboard-tasks-panel";
import { ProjectPanel } from "./components/project-panel";
import { PROJECTS_MOCK, TASKS_MOCK } from "./dashboard.mocks";

export function Dashboard() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

	// Mock data - substituir por hooks da API quando integrar
	const [tasks] = useState(TASKS_MOCK);
	const [projects] = useState(PROJECTS_MOCK);

	const today = new Date().toISOString().split("T")[0];

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
			label: t("dashboard.stats.completed"),
			value: completed,
			icon: CheckCircle2,
			iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
			iconColor: "text-emerald-600 dark:text-emerald-400",
			trend: t("dashboard.stats.today"),
			trendVariant: "up" as const,
			sublabel: t("dashboard.stats.today"),
			stripeClass: "bg-emerald-500",
		},
		{
			key: "warn",
			label: t("dashboard.stats.overdue"),
			value: overdueTasks,
			icon: AlertCircle,
			iconBg: "bg-amber-100 dark:bg-amber-900/30",
			iconColor: "text-amber-600 dark:text-amber-400",
			trend:
				overdueTasks === 0
					? t("dashboard.stats.onTrack")
					: t("dashboard.stats.needsAttention"),
			trendVariant: overdueTasks > 0 ? "down" : "flat",
			sublabel: t("dashboard.stats.seeNow"),
			stripeClass: "bg-amber-500",
			tintedBg: true,
		},
		{
			key: "info",
			label: t("dashboard.stats.forToday"),
			value: todayTasks.length,
			icon: Calendar,
			iconBg: "bg-blue-100 dark:bg-blue-900/30",
			iconColor: "text-blue-600 dark:text-blue-400",
			trend: t("dashboard.stats.doneOf", {
				done: todayDone,
				total: todayTasks.length,
			}),
			trendVariant: "flat" as const,
			sublabel: t("dashboard.stats.pending", {
				count: Math.max(0, todayTasks.length - todayDone),
			}),
			stripeClass: "bg-blue-500",
		},
		{
			key: "meta",
			label: t("dashboard.stats.efficiency"),
			value: `${efficiency}%`,
			icon: TrendingUp,
			iconBg: "bg-violet-100 dark:bg-violet-900/30",
			iconColor: "text-violet-600 dark:text-violet-400",
			trend: t("dashboard.stats.overall"),
			trendVariant: "flat" as const,
			sublabel: t("dashboard.stats.goal"),
			stripeClass: "bg-violet-500",
			showArc: true,
		},
	];

	const weekStats = [
		{ label: t("dashboard.weekSummary.completedTasks"), value: completed + 3 },
		{ label: t("dashboard.weekSummary.focusedHours"), value: "12h 40m" },
		{
			label: t("dashboard.weekSummary.activeGoals"),
			value: projects.filter((p) => p.isGoal && p.status === "ativo").length,
		},
	];

	const pendingToday = todayTasks.filter((t) => t.status === "pendente").length;
	const hasOverdue = overdueTasks > 0;

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
					{t("dashboard.greeting", { name: firstName })}
				</h2>
				<p className="text-sm text-muted-foreground mt-1">
					{t("dashboard.pendingTasks", { count: pendingToday })}
					{hasOverdue ? t("dashboard.needsAttention") : ""}
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
										aria-hidden
									>
										<title>Decorative progress arc</title>
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
				<DashboardTasksPanel />

				{/* Projetos — panel */}
				<ProjectPanel />
			</div>

			{/* Resumo da semana */}
			<div className="bg-card border border-border rounded-xl p-5">
				<h3 className="font-semibold text-foreground mb-4">
					{t("dashboard.weekSummary.title")}
				</h3>
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
