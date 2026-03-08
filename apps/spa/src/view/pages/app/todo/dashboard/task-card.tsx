import { Checkbox } from "@repo/ui/checkbox";
import { Calendar } from "lucide-react";
import type { DashboardTask } from "./dashboard.mocks";

type TaskCardProps = {
	task: DashboardTask;
};

function formatDueDate(dueDate: string): string {
	const date = new Date(dueDate);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}

export function TaskCard({ task }: TaskCardProps) {
	const isCompleted = task.status === "concluida";

	return (
		<div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
			<Checkbox checked={isCompleted} className="border-2 shrink-0" />
			<div className="flex-1 min-w-0">
				<p
					className={`font-medium leading-none ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
				>
					{task.title}
				</p>
				{task.description && (
					<p className="text-sm text-muted-foreground mt-0.5 truncate">
						{task.description}
					</p>
				)}
			</div>
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
				<Calendar className="w-3.5 h-3.5" />
				{formatDueDate(task.dueDate)}
			</div>
		</div>
	);
}
