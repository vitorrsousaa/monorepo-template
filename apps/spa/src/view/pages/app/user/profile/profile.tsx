"use client";

import { useAuth } from "@/hooks/auth";
import {
	GOALS_PROJECTS_MOCK,
	GOALS_TASKS_MOCK,
} from "@/pages/app/goals/dashboard/goals-dashboard.mocks";
import {
	PROJECTS_MOCK,
	TASKS_MOCK,
} from "@/pages/app/todo/dashboard/dashboard.mocks";
import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import { cn } from "@repo/ui/utils";
import {
	Camera,
	Check,
	CheckCircle2,
	Edit3,
	Flame,
	FolderKanban,
	Star,
	Target,
	TrendingUp,
	X,
} from "lucide-react";
import { useState } from "react";

function StatCard({
	label,
	value,
	icon: Icon,
	color,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
	color: string;
}) {
	return (
		<div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
			<div
				className={cn(
					"flex items-center justify-center w-11 h-11 rounded-xl shrink-0",
					color,
				)}
			>
				<Icon className="w-5 h-5" />
			</div>
			<div>
				<p className="text-2xl font-bold text-foreground leading-none">
					{value}
				</p>
				<p className="text-xs text-muted-foreground mt-1">{label}</p>
			</div>
		</div>
	);
}

const ACTIVITY_DAYS = 70;

function ActivityGrid({ completedDates }: { completedDates: string[] }) {
	const today = new Date();
	const cells = Array.from({ length: ACTIVITY_DAYS }, (_, i) => {
		const d = new Date(today);
		d.setDate(today.getDate() - (ACTIVITY_DAYS - 1 - i));
		const key = d.toISOString().split("T")[0];
		const count = completedDates.filter((x) => x === key).length;
		return { key, count };
	});

	return (
		<div className="flex flex-wrap gap-1">
			{cells.map(({ key, count }) => (
				<div
					key={key}
					title={`${key}: ${count} tarefa(s)`}
					className={cn(
						"w-4 h-4 rounded-sm transition-colors",
						count === 0 && "bg-muted",
						count === 1 && "bg-primary/30",
						count === 2 && "bg-primary/55",
						count >= 3 && "bg-primary",
					)}
				/>
			))}
		</div>
	);
}

const BADGES = [
	{
		id: "first",
		label: "Primeira tarefa",
		icon: Star,
		earned: true,
		description: "Completou sua primeira tarefa",
	},
	{
		id: "streak7",
		label: "7 dias seguidos",
		icon: Flame,
		earned: true,
		description: "Manteve a sequência por 7 dias",
	},
	{
		id: "goals",
		label: "Meta alcançada",
		icon: Target,
		earned: true,
		description: "Completou sua primeira meta",
	},
	{
		id: "streak30",
		label: "30 dias seguidos",
		icon: Flame,
		earned: false,
		description: "Mantenha a sequência por 30 dias",
	},
	{
		id: "pro",
		label: "Produtividade Pro",
		icon: TrendingUp,
		earned: false,
		description: "Complete 100 tarefas",
	},
];

export function Profile() {
	const tasks = TASKS_MOCK;
	const projects = PROJECTS_MOCK;
	const goals = GOALS_PROJECTS_MOCK;

	const { user } = useAuth();

	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(user?.name || "");
	const [bio, setBio] = useState(
		"Desenvolvedor apaixonado por produtividade, tecnologia e aprendizado contínuo.",
	);
	const [location, setLocation] = useState("São Paulo, Brasil");
	const [tempName, setTempName] = useState(name);
	const [tempBio, setTempBio] = useState(bio);
	const [tempLocation, setTempLocation] = useState(location);

	const completedTasks = tasks.filter((t) => t.status === "concluida");
	const pendingTasks = tasks.filter((t) => t.status === "pendente");
	const activeProjects = projects.filter((p) => p.status === "ativo");
	const activeGoals = goals.filter((g) => g.status === "ativo");

	// Simula datas de conclusão para o grid de atividade
	const today = new Date().toISOString().split("T")[0];
	const completedDates = [
		...completedTasks.map(() => today),
		today,
		today,
		today,
		new Date(Date.now() - 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
		new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
	];

	// Progresso de metas (goals com targetValue)
	const goalsWithProgress = goals
		.filter((g) => g.targetValue != null)
		.map((g) => ({
			...g,
			percent: Math.min(
				100,
				Math.round(((g.currentValue ?? 0) / (g.targetValue ?? 1)) * 100),
			),
		}));

	const handleSave = () => {
		setName(tempName);
		setBio(tempBio);
		setLocation(tempLocation);
		setEditing(false);
	};

	const handleCancel = () => {
		setTempName(name);
		setTempBio(bio);
		setTempLocation(location);
		setEditing(false);
	};

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	// Projetos para exibir (combina projects + goals como projetos)
	const allProjects: Array<{ id: string; name: string; emoji: string }> = [
		...projects.map((p) => ({ id: p.id, name: p.name, emoji: p.emoji })),
		...goals.map((g) => ({ id: g.id, name: g.name, emoji: g.emoji })),
	];
	const allTasks = [...TASKS_MOCK, ...GOALS_TASKS_MOCK];

	return (
		<div className="flex-1 p-6 max-w-4xl mx-auto space-y-6 w-full">
			{/* Header do perfil */}
			<div className="bg-card border border-border rounded-xl overflow-hidden">
				{/* Banner */}
				<div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
					<div
						className="absolute inset-0 opacity-20"
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 60%), radial-gradient(circle at 80% 20%, hsl(262 83% 58%) 0%, transparent 50%)",
						}}
					/>
				</div>

				{/* Info do usuário */}
				<div className="px-6 pb-6">
					<div className="flex items-end justify-between -mt-10 mb-4">
						<div className="relative">
							<Avatar className="h-20 w-20 border-4 border-card shadow-md">
								<AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
									{initials}
								</AvatarFallback>
							</Avatar>
							<button
								type="button"
								className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-card border-2 border-border shadow hover:bg-muted transition-colors"
							>
								<Camera className="w-3.5 h-3.5 text-muted-foreground" />
							</button>
						</div>

						<div className="flex items-center gap-2 pb-1">
							{editing ? (
								<>
									<Button
										size="sm"
										variant="ghost"
										onClick={handleCancel}
										className="gap-1.5"
									>
										<X className="w-3.5 h-3.5" />
										Cancelar
									</Button>
									<Button size="sm" onClick={handleSave} className="gap-1.5">
										<Check className="w-3.5 h-3.5" />
										Salvar
									</Button>
								</>
							) : (
								<Button
									size="sm"
									variant="outline"
									onClick={() => setEditing(true)}
									className="gap-1.5"
								>
									<Edit3 className="w-3.5 h-3.5" />
									Editar perfil
								</Button>
							)}
						</div>
					</div>

					{editing ? (
						<div className="space-y-3">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<Label htmlFor="p-name">Nome</Label>
									<Input
										id="p-name"
										value={tempName}
										onChange={(e) => setTempName(e.target.value)}
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="p-location">Localização</Label>
									<Input
										id="p-location"
										value={tempLocation}
										onChange={(e) => setTempLocation(e.target.value)}
										placeholder="Cidade, País"
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="p-bio">Bio</Label>
								<Textarea
									id="p-bio"
									value={tempBio}
									onChange={(e) => setTempBio(e.target.value)}
									rows={2}
									placeholder="Uma breve descrição sobre você..."
								/>
							</div>
						</div>
					) : (
						<div>
							<h2 className="text-xl font-bold text-foreground">{name}</h2>
							<p className="text-sm text-muted-foreground mt-0.5">{location}</p>
							<p className="text-sm text-foreground/80 mt-2 max-w-xl">{bio}</p>
							<div className="flex items-center gap-2 mt-3">
								<Badge
									variant="outline"
									className="text-xs text-primary border-primary/30 bg-primary/5"
								>
									Plano Free
								</Badge>
								<Badge variant="outline" className="text-xs">
									Membro desde mar/2026
								</Badge>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatCard
					label="Tarefas concluídas"
					value={completedTasks.length}
					icon={CheckCircle2}
					color="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
				/>
				<StatCard
					label="Tarefas pendentes"
					value={pendingTasks.length}
					icon={TrendingUp}
					color="bg-primary/10 text-primary"
				/>
				<StatCard
					label="Projetos ativos"
					value={activeProjects.length}
					icon={FolderKanban}
					color="bg-violet-500/15 text-violet-600 dark:text-violet-400"
				/>
				<StatCard
					label="Metas ativas"
					value={activeGoals.length}
					icon={Target}
					color="bg-amber-500/15 text-amber-600 dark:text-amber-400"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Atividade */}
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-card border border-border rounded-xl p-5 space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-base font-semibold text-foreground">
								Atividade recente
							</h3>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<span className="w-3 h-3 rounded-sm bg-muted inline-block" />{" "}
									Sem atividade
								</span>
								<span className="flex items-center gap-1">
									<span className="w-3 h-3 rounded-sm bg-primary inline-block" />{" "}
									Ativo
								</span>
							</div>
						</div>
						<ActivityGrid completedDates={completedDates} />
						<p className="text-xs text-muted-foreground">
							Exibindo os últimos 70 dias
						</p>
					</div>

					{/* Progresso de Metas */}
					<div className="bg-card border border-border rounded-xl p-5 space-y-4">
						<h3 className="text-base font-semibold text-foreground">
							Progresso das metas
						</h3>
						{goalsWithProgress.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Nenhuma meta criada ainda.
							</p>
						) : (
							<div className="space-y-4">
								{goalsWithProgress.map((g) => (
									<div key={g.id} className="space-y-1.5">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-base">{g.emoji}</span>
												<span className="text-sm font-medium text-foreground">
													{g.name}
												</span>
											</div>
											<span className="text-xs font-semibold text-primary">
												{g.percent}%
											</span>
										</div>
										<div className="h-2 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary rounded-full transition-all duration-500"
												style={{ width: `${g.percent}%` }}
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											{g.currentValue ?? 0} / {g.targetValue} {g.unit}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Conquistas */}
				<div className="space-y-6">
					<div className="bg-card border border-border rounded-xl p-5 space-y-4">
						<h3 className="text-base font-semibold text-foreground">
							Conquistas
						</h3>
						<div className="space-y-3">
							{BADGES.map((b) => {
								const Icon = b.icon;
								return (
									<div
										key={b.id}
										className={cn(
											"flex items-center gap-3 p-3 rounded-lg border transition-colors",
											b.earned
												? "bg-primary/5 border-primary/20"
												: "bg-muted/40 border-border opacity-50",
										)}
									>
										<div
											className={cn(
												"flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
												b.earned
													? "bg-primary/15 text-primary"
													: "bg-muted text-muted-foreground",
											)}
										>
											<Icon className="w-4 h-4" />
										</div>
										<div className="min-w-0">
											<p
												className={cn(
													"text-sm font-medium",
													b.earned
														? "text-foreground"
														: "text-muted-foreground",
												)}
											>
												{b.label}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{b.description}
											</p>
										</div>
										{b.earned && (
											<CheckCircle2 className="w-4 h-4 text-primary shrink-0 ml-auto" />
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Projetos recentes */}
					<div className="bg-card border border-border rounded-xl p-5 space-y-3">
						<h3 className="text-base font-semibold text-foreground">
							Projetos
						</h3>
						{allProjects.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Nenhum projeto ainda.
							</p>
						) : (
							<div className="space-y-2">
								{allProjects.map((p) => {
									const projectTasks = allTasks.filter(
										(t) => t.projectId === p.id,
									);
									const count = projectTasks.length;
									const done = projectTasks.filter(
										(t) => t.status === "concluida",
									).length;
									const pct = count > 0 ? Math.round((done / count) * 100) : 0;
									return (
										<div key={p.id} className="flex items-center gap-3">
											<span className="text-lg leading-none">{p.emoji}</span>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate">
													{p.name}
												</p>
												<div className="flex items-center gap-2 mt-1">
													<div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
														<div
															className="h-full bg-primary rounded-full"
															style={{ width: `${pct}%` }}
														/>
													</div>
													<span className="text-xs text-muted-foreground shrink-0">
														{pct}%
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
