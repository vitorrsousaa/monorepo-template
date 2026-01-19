import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Icon } from "@repo/ui/icon";
import {
	Activity,
	CalendarDays,
	CheckCircle2,
	Folder,
	List,
	Play,
	Plus,
	TrendingUp,
	Zap,
} from "lucide-react";

export function Dashboard() {
	const projects = [
		{
			id: "1",
			name: "Study Plan - Automated Tests",
			description:
				"Learn to create and run automated tests to ensure software quality.",
			progress: 50,
			totalTasks: 10,
			completedTasks: 5,
			dueDate: "2026-01-20",
			priority: "high",
		},
		{
			id: "2",
			name: "Python Study Plan",
			description: "Detailed plan to learn Python step by step.",
			progress: 30,
			totalTasks: 10,
			completedTasks: 3,
			dueDate: "2026-01-21",
			priority: "medium",
		},
	];

	return (
		<div className="p-8 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-semibold text-balance">Dashboard</h1>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Icon name="fire" className="w-5 h-5 text-primary" />
						<span className="font-semibold">7</span>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-primary/10">
							<CheckCircle2 className="w-6 h-6 text-primary" />
						</div>
						<div>
							<div className="text-3xl font-bold">3</div>
							<div className="text-sm text-muted-foreground">Completed</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-chart-2/10">
							<Activity className="w-6 h-6 text-chart-2" />
						</div>
						<div>
							<div className="text-3xl font-bold">13</div>
							<div className="text-sm text-muted-foreground">In Progress</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-destructive/10">
							<CalendarDays className="w-6 h-6 text-destructive" />
						</div>
						<div>
							<div className="text-3xl font-bold">2</div>
							<div className="text-sm text-muted-foreground">Today</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-chart-4/10">
							<TrendingUp className="w-6 h-6 text-chart-4" />
						</div>
						<div>
							<div className="text-3xl font-bold">16%</div>
							<div className="text-sm text-muted-foreground">Efficiency</div>
						</div>
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Today's Tasks */}
				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-3 mb-6">
						<List className="w-5 h-5 text-primary" />
						<div>
							<h2 className="text-xl font-semibold text-balance">
								{"Today's Tasks"}
							</h2>
							<p className="text-sm text-muted-foreground">
								Your priorities for today
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
							<div>
								<div className="font-medium">File Management</div>
								<div className="text-sm text-muted-foreground">
									07:00 - 09:00
								</div>
							</div>
							<Badge
								variant="secondary"
								className="bg-chart-2/20 text-chart-2 hover:bg-chart-2/20"
							>
								Medium
							</Badge>
						</div>

						<div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
							<div>
								<div className="font-medium">Modules and Packages</div>
								<div className="text-sm text-muted-foreground">
									11:00 - 13:00
								</div>
							</div>
							<Badge
								variant="secondary"
								className="bg-chart-2/20 text-chart-2 hover:bg-chart-2/20"
							>
								Medium
							</Badge>
						</div>
					</div>
				</Card>

				{/* Recent Groups */}
				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-3 mb-6">
						<Folder className="w-5 h-5 text-primary" />
						<div>
							<h2 className="text-xl font-semibold text-balance">
								Recent Projects
							</h2>
							<p className="text-sm text-muted-foreground">
								Your most recent projects
							</p>
						</div>
					</div>

					<div className="space-y-4">
						{projects.map((project) => (
							<div
								key={project.id}
								className="space-y-2 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
							>
								<div className="font-medium">{project.name}</div>
								<p className="text-sm text-muted-foreground">
									{project.description}
								</p>
								<div className="space-y-1">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											{project.completedTasks} of {project.totalTasks} completed
											({project.progress}%)
										</span>
									</div>
									<div className="h-2 bg-secondary rounded-full overflow-hidden">
										<div
											className="h-full bg-primary w-[20%]"
											style={{ width: `${project.progress}%` }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Quick Actions */}
				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-3 mb-6">
						<Zap className="w-5 h-5 text-primary" />
						<div>
							<h2 className="text-xl font-semibold text-balance">
								Quick Actions
							</h2>
						</div>
					</div>

					<div className="space-y-3">
						<Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base">
							<Play className="w-5 h-5 mr-2" />
							Start Pomodoro
						</Button>

						<Button
							variant="outline"
							className="w-full h-12 border-border hover:bg-secondary/50 bg-transparent"
						>
							<Plus className="w-5 h-5 mr-2" />
							New Task
						</Button>
					</div>
				</Card>

				{/* This Week */}
				<Card className="p-6 bg-card border-border">
					<div className="flex items-center gap-3 mb-6">
						<TrendingUp className="w-5 h-5 text-primary" />
						<div>
							<h2 className="text-xl font-semibold text-balance">This Week</h2>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-chart-2">0h</div>
							<div className="text-sm text-muted-foreground mt-1">
								Hours Studied
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-chart-3">0</div>
							<div className="text-sm text-muted-foreground mt-1">
								Pomodoros
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-chart-4">16%</div>
							<div className="text-sm text-muted-foreground mt-1">Goals</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
