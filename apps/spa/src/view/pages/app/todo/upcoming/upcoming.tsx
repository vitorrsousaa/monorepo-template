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

	const tomorrow = addDays(today, 1);
	const inTwoDays = addDays(today, 2);

	function diffInDaysFromToday(dateIso: string) {
		const date = new Date(dateIso + "T12:00:00");
		date.setHours(0, 0, 0, 0);
		return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
	}

	const upcomingTasks = tasks.filter((t) => {
		if (!t.dueDate) return false;
		const diff = diffInDaysFromToday(t.dueDate);
		return diff >= 1 && diff <= 7;
	});

	const tomorrowTasks = upcomingTasks.filter((t) => diffInDaysFromToday(t.dueDate) === 1);
	const inTwoDaysTasks = upcomingTasks.filter((t) => diffInDaysFromToday(t.dueDate) === 2);
	const laterTasks = upcomingTasks.filter((t) => diffInDaysFromToday(t.dueDate) >= 3);

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center justify-between border-b border-border pb-5">
				<div>
					<h1 className="text-[26px] font-semibold tracking-tight text-balance">Em breve</h1>
					<p className="mt-1 text-xs text-muted-foreground">Próximos 7 dias</p>
				</div>
				<Button
					className="gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
					onClick={() => setIsNewTaskOpen(true)}
					type="button"
				>
					<Plus className="mr-1 h-3.5 w-3.5" />
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
				<div className="max-h-[calc(100vh-220px)] overflow-y-auto pb-10">
					<div className="mx-auto flex max-w-3xl flex-col gap-7">
						{tomorrowTasks.length > 0 && (
							<section className="space-y-2">
								<header className="flex items-center gap-2">
									<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
										amanhã
									</span>
									<span className="text-xs font-semibold text-foreground">
										{formatDateLong(tomorrow)}
									</span>
									<span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
										{tomorrowTasks.length}
									</span>
								</header>
								<div className="rounded-xl border border-border bg-card">
									<div className="divide-y divide-border">
										{tomorrowTasks.map((task) => (
											<div key={task.id} className="px-4 py-3">
												<UpcomingTaskCard task={task} />
											</div>
										))}
									</div>
								</div>
							</section>
						)}

						{inTwoDaysTasks.length > 0 && (
							<section className="space-y-2">
								<header className="flex items-center gap-2">
									<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
										em 2 dias
									</span>
									<span className="text-xs font-semibold text-foreground">
										{formatDateLong(inTwoDays)}
									</span>
									<span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
										{inTwoDaysTasks.length}
									</span>
								</header>
								<div className="rounded-xl border border-border bg-card">
									<div className="divide-y divide-border">
										{inTwoDaysTasks.map((task) => (
											<div key={task.id} className="px-4 py-3">
												<UpcomingTaskCard task={task} />
											</div>
										))}
									</div>
								</div>
							</section>
						)}

						{laterTasks.length > 0 && (
							<section className="space-y-3">
								<header className="flex items-center gap-3">
									<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										em 7 dias
									</span>
									<span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
										mais para frente
									</span>
									<span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
										{laterTasks.length}
									</span>
								</header>
								<div className="rounded-xl border border-border bg-card">
									<div className="divide-y divide-border">
										{laterTasks.map((task) => (
											<div key={task.id} className="px-4 py-3">
												<UpcomingTaskCard task={task} />
											</div>
										))}
									</div>
								</div>
							</section>
						)}
					</div>
				</div>
			)}

			<NewTodoModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
		</div>
	);
}
