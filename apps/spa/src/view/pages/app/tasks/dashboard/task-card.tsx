import { cn } from "@repo/ui/utils";
import type { DashboardProject, DashboardTask } from "./dashboard.mocks";

type TaskCardProps = {
	task: DashboardTask;
	project?: DashboardProject | null;
	category: "work" | "home" | "study" | "health";
	isOverdue: boolean;
};

function formatDueDate(dueDate: string): string {
	const date = new Date(dueDate);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		timeZone: "UTC",
	});
}

/** Derive meta subtitle and duration/recurring badge from task description. */
function parseMetaFromDescription(description: string | undefined): {
	extra?: string;
	badge?: string;
} {
	if (!description?.trim()) return {};
	const d = description.trim();
	// "10 minutos" / "10 min" -> "10 min"
	const minMatch = d.match(/(\d+)\s*min(?:utos?)?/i);
	if (minMatch) return { badge: `${minMatch[1]} min` };
	// "30 min"
	if (/\d+\s*min/i.test(d)) {
		const n = d.match(/\d+/)?.[0];
		return { badge: n ? `${n} min` : undefined };
	}
	// "10 semanas" -> "10 sem. recorrente"
	const semMatch = d.match(/(\d+)\s*sem(?:anas?)?/i);
	if (semMatch) return { badge: `${semMatch[1]} sem. recorrente` };
	// "Gliglish · 15 min" -> extra "Gliglish", badge "15 min"
	const parts = d.split(/\s*[·\-–]\s*/);
	if (parts.length >= 2) {
		const last = parts[parts.length - 1];
		const minPart = last.match(/(\d+)\s*min/i);
		if (minPart) {
			return { extra: parts[0].trim(), badge: `${minPart[1]} min` };
		}
		return { extra: parts[0].trim() };
	}
	// "Clean Architecture - camada de domínio" -> extra "Clean Architecture"
	if (d.includes(" - ")) {
		const [first] = d.split(" - ");
		return { extra: first?.trim() };
	}
	return { extra: d };
}

const STRIPE_COLORS = {
	work: "bg-violet-600",
	home: "bg-emerald-600",
	study: "bg-blue-600",
	health: "bg-amber-600",
} as const;

export function TaskCard({
	task,
	project,
	category,
	isOverdue,
}: TaskCardProps) {
	const isCompleted = task.status === "concluida";
	const { extra, badge } = parseMetaFromDescription(task.description);
	const projectName = project?.name ?? "Sem projeto";
	const metaExtra = extra ? ` · ${extra}` : "";

	return (
		<div
			className={cn(
				"flex items-start gap-3 pl-5 pr-5 py-4 transition-colors relative group",
				isOverdue && "bg-[#FEF2F2] dark:bg-red-950/20",
			)}
		>
			{/* Category stripe — left edge, more opaque on hover */}
			<div
				className={cn(
					"absolute left-0 top-2 bottom-2 w-[3px] rounded-r opacity-50 group-hover:opacity-100 transition-opacity",
					STRIPE_COLORS[category],
				)}
				aria-hidden
			/>
			{/* Checkbox — custom styled */}
			<div
				className={cn(
					"w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors",
					isCompleted
						? "bg-emerald-600 border-emerald-600 text-white"
						: "border-border bg-background",
				)}
				aria-hidden
			>
				{isCompleted && (
					<svg
						width="8"
						height="5"
						viewBox="0 0 8 5"
						fill="none"
						className="text-white"
						aria-hidden
					>
						<title>Check mark</title>
						<path
							d="M1 2.5L3 4.5L7 0.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div
					className={cn(
						"text-[13px] font-medium mb-0.5",
						isCompleted
							? "line-through text-muted-foreground"
							: "text-foreground",
					)}
				>
					{task.title}
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-[11px] text-muted-foreground">
						{projectName}
						{metaExtra}
					</span>
					{isOverdue && (
						<span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
							Atrasada
						</span>
					)}
					{badge && !isOverdue && (
						<span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-[3px]">
							{badge}
						</span>
					)}
				</div>
			</div>
			<span className="text-[11px] text-muted-foreground shrink-0">
				{formatDueDate(task.dueDate)}
			</span>
		</div>
	);
}
