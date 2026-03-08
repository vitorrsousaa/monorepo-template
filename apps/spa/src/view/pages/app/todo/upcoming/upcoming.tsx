import { addDays, formatDateLong } from "@/utils/date-utils";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import { Button } from "@repo/ui/button";
import { CalendarClock, Plus } from "lucide-react";
import { useState } from "react";
import { getUpcomingTasksMock } from "./upcoming.mocks";
import { UpcomingTaskCard } from "./upcoming-task-card";

export function Upcoming() {
	const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

	// Mock data - substituir por hook da API quando integrar
	const [tasks] = useState(() => getUpcomingTasksMock());

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Próximos 7 dias (excluindo hoje)
	const days = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1));

	const upcomingTasks = tasks.filter((t) => {
		if (!t.dueDate) return false;
		const d = new Date(t.dueDate + "T12:00:00");
		return d > today;
	});

	return (
		<div className="p-8 space-y-6">
			{/* Header - largura inteira, mesmo estilo do Inbox */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-balance">Em breve</h1>
					<p className="text-muted-foreground mt-1">Próximos 7 dias</p>
				</div>
				<Button
					className="bg-primary text-primary-foreground hover:bg-primary/90"
					onClick={() => setIsNewTaskOpen(true)}
					type="button"
				>
					<Plus className="w-4 h-4 mr-2" />
					Nova tarefa
				</Button>
			</div>

			{upcomingTasks.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
						<CalendarClock className="w-8 h-8 text-muted-foreground/50" />
					</div>
					<h3 className="font-semibold text-foreground">Nenhuma tarefa futura</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Adicione tarefas com datas futuras para planejá-las
					</p>
				</div>
			) : (
				<div className="max-h-[calc(100vh-200px)] overflow-y-auto px-24 pb-10 space-y-6">
					{days.map((day) => {
						const dayStr = day.toISOString().split("T")[0];
						const dayTasks = upcomingTasks.filter((t) => t.dueDate === dayStr);
						if (dayTasks.length === 0) return null;
						return (
							<div key={dayStr} className="space-y-2">
								<div className="flex items-center gap-2">
									<h3 className="text-sm font-semibold text-foreground capitalize">
										{formatDateLong(day)}
									</h3>
									<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
										{dayTasks.length}
									</span>
								</div>
								<div className="space-y-2">
									{dayTasks.map((t) => (
										<UpcomingTaskCard key={t.id} task={t} />
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			<NewTodoModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
		</div>
	);
}
