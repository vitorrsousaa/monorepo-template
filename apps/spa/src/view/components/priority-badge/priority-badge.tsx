import { cn } from "@repo/ui/utils";

export type PriorityLevel = "high" | "medium" | "low";

function PriorityBarsIcon({ level }: { level: PriorityLevel }) {
	const paths =
		level === "high"
			? "M1 8V2M4.5 8V4M8 8V2"
			: level === "medium"
				? "M1 8V4M4.5 8V1M8 8V5"
				: "M1 8V6M4.5 8V4M8 8V6";
	return (
		<svg
			width="9"
			height="9"
			viewBox="0 0 9 9"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			aria-hidden
		>
			<title>Priority bars</title>
			<path d={paths} />
		</svg>
	);
}

/** Priority pill badge with a bars icon and level label. */
export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
				priority === "high" && "bg-destructive/10 text-destructive",
				priority === "medium" &&
					"bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
				priority === "low" && "bg-primary/10 text-primary",
			)}
		>
			<PriorityBarsIcon level={priority} />
			{priority}
		</span>
	);
}
