import { cn } from "@repo/ui/utils";
import type { DashboardTask } from "../../tasks/dashboard/dashboard.mocks";

type UpcomingTaskCardProps = {
	task: DashboardTask;
};

type Category = "work" | "home" | "study" | "health";

const STRIPE_COLORS: Record<Category, string> = {
	work: "bg-violet-600",
	home: "bg-emerald-600",
	study: "bg-blue-600",
	health: "bg-amber-600",
};

const TAG_STYLES: Record<Category, string> = {
	work: "bg-violet-100 text-violet-700",
	home: "bg-emerald-100 text-emerald-700",
	study: "bg-blue-100 text-blue-700",
	health: "bg-amber-100 text-amber-700",
};

const TAG_LABELS: Record<Category, string> = {
	work: "Profissional",
	home: "Casa",
	study: "Estudos",
	health: "Saúde",
};

function getCategoryFromProject(projectId: string): Category {
	switch (projectId) {
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

export function UpcomingTaskCard({ task }: UpcomingTaskCardProps) {
	const isCompleted = task.status === "concluida";
	const category = getCategoryFromProject(task.projectId);

	return (
		<div className="relative flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-muted/60 rounded-r">
			<div
				className={cn(
					"absolute left-0 top-2 bottom-2 w-[3px] rounded-r opacity-60",
					STRIPE_COLORS[category],
				)}
				aria-hidden
			/>
			<button
				type="button"
				className={cn(
					"mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors",
					isCompleted
						? "border-emerald-600 bg-emerald-600 text-white"
						: "border-border bg-background",
				)}
				aria-pressed={isCompleted}
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
			</button>
			<div className="flex min-w-0 flex-1 items-baseline gap-2">
				<div
					className={cn(
						"text-[13px] font-medium truncate",
						isCompleted
							? "line-through text-muted-foreground"
							: "text-foreground",
					)}
				>
					{task.title}
				</div>
			</div>
			<span
				className={cn(
					"ml-3 rounded-[4px] px-2 py-0.5 text-[11px] font-semibold",
					TAG_STYLES[category],
				)}
			>
				{TAG_LABELS[category]}
			</span>
		</div>
	);
}
