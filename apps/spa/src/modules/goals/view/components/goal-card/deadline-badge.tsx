import { differenceInDays, formatDateWithYear } from "@/utils/date-utils";
import { cn } from "@repo/ui/utils";
import { Calendar } from "lucide-react";

type DeadlineBadgeProps = {
	deadline?: string;
};

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
	if (!deadline) return null;

	const diff = differenceInDays(new Date(`${deadline}T12:00:00`), new Date());
	const label =
		diff < 0
			? "Atrasada"
			: diff === 0
				? "Vence hoje"
				: diff <= 7
					? `${diff}d restantes`
					: formatDateWithYear(new Date(`${deadline}T12:00:00`));

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
				diff < 0
					? "bg-destructive/10 text-destructive"
					: diff <= 7
						? "bg-[oklch(0.72_0.19_70)]/10 text-[oklch(0.45_0.15_70)]"
						: "bg-muted text-muted-foreground",
			)}
		>
			<Calendar className="w-3 h-3" />
			{label}
		</span>
	);
}
