import type { DashboardTask } from "../dashboard/dashboard.mocks";
import { Card } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { Calendar } from "lucide-react";

type UpcomingTaskCardProps = {
	task: DashboardTask;
};

function formatDueDate(dueDate: string): string {
	const date = new Date(dueDate);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}

export function UpcomingTaskCard({ task }: UpcomingTaskCardProps) {
	const isCompleted = task.status === "concluida";

	return (
		<Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
			<div className="flex items-center gap-4">
				<Checkbox checked={isCompleted} className="border-2 shrink-0" />
				<div className="flex-1 min-w-0">
					<div
						className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}
					>
						{task.title}
					</div>
					{task.description && (
						<p className="text-sm text-muted-foreground mt-0.5 truncate">
							{task.description}
						</p>
					)}
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							<Calendar className="w-3 h-3 shrink-0" />
							{formatDueDate(task.dueDate)}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
